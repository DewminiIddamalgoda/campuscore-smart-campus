package com.groupxx.smartcampus.service.impl;

import com.groupxx.smartcampus.dto.auth.AdminRegistrationRequestDto;
import com.groupxx.smartcampus.dto.auth.AuthResponseDto;
import com.groupxx.smartcampus.dto.auth.LoginRequestDto;
import com.groupxx.smartcampus.dto.auth.StudentRegistrationRequestDto;
import com.groupxx.smartcampus.dto.auth.StaffRegistrationRequestDto;
import com.groupxx.smartcampus.dto.auth.TechnicianRegistrationRequestDto;
import com.groupxx.smartcampus.dto.auth.UserProfileDto;
import com.groupxx.smartcampus.dto.auth.UpdateProfileRequestDto;
import com.groupxx.smartcampus.dto.auth.BaseRegistrationRequestDto;
import com.groupxx.smartcampus.entity.AppUser;
import com.groupxx.smartcampus.entity.AuthSession;
import com.groupxx.smartcampus.enums.Faculty;
import com.groupxx.smartcampus.enums.UserRole;
import com.groupxx.smartcampus.exception.AuthException;
import com.groupxx.smartcampus.repository.AppUserRepository;
import com.groupxx.smartcampus.repository.AuthSessionRepository;
import com.groupxx.smartcampus.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private static final int SESSION_HOURS = 12;
    private static final String STUDENT_ID_ERROR = "Enter a valid user ID";
    private static final String PASSWORD_MISMATCH_ERROR = "Passwords do not match";
    private static final String INVALID_LOGIN_ERROR = "Invalid email, full name, or password";
    private static final String EMAIL_NOT_REGISTERED_ERROR = "Email not registered, please use a valid email or register";

    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private AuthSessionRepository authSessionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public AuthResponseDto registerStudent(StudentRegistrationRequestDto request) {
        Faculty faculty = resolveFaculty(request.getFaculty());
        String normalizedUserId = normalizeUserId(request.getUserId());

        if (!passwordsMatch(request.getPassword(), request.getConfirmPassword())) {
            throw new AuthException(HttpStatus.BAD_REQUEST, PASSWORD_MISMATCH_ERROR);
        }

        validateUserId(normalizedUserId, faculty.getPrefix());
        validateUniqueFields(request.getEmail(), request.getContactNumber(), normalizedUserId);

        AppUser user = buildBaseUser(request, UserRole.STUDENT);
        user.setFaculty(faculty);
        user.setAcademicYear(request.getAcademicYear());
        user.setUserId(normalizedUserId);

        return createUserAndSession(user);
    }

    @Override
    public AuthResponseDto registerAdmin(AdminRegistrationRequestDto request) {
        return registerStaff(request, UserRole.ADMIN, "AD");
    }

    @Override
    public AuthResponseDto registerTechnician(TechnicianRegistrationRequestDto request) {
        return registerStaff(request, UserRole.TECHNICIAN, "TN");
    }

    @Override
    public AuthResponseDto login(LoginRequestDto request) {
        AppUser user = resolveUserForPasswordLogin(request.getEmail(), request.getFullName(), request.getPassword());

        if (!normalizeName(request.getFullName()).equalsIgnoreCase(user.getFullName())) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, INVALID_LOGIN_ERROR);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, INVALID_LOGIN_ERROR);
        }

        return issueSession(user, "Login successful");
    }

    @Override
    public AuthResponseDto loginWithOAuth(String email, String fullName, String firstName, String lastName) {
        String normalizedEmail = normalizeEmail(email);
        if (normalizedEmail == null || normalizedEmail.isBlank()) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "OAuth account does not contain an email address");
        }

        AppUser user = resolveUserForOAuth(normalizedEmail)
                .orElseThrow(() -> new AuthException(HttpStatus.NOT_FOUND, "Google account not registered. Please register first"));

        return issueSession(user, "Login successful via Google");
    }

    @Override
    public UserProfileDto getCurrentUser(String token) {
        AuthSession session = resolveActiveSession(token);
        AppUser user = userRepository.findByUserId(session.getUserId())
                .orElseThrow(() -> new AuthException(HttpStatus.NOT_FOUND, "User not found"));

        return toProfileDto(user);
    }

    @Override
    public void logout(String token) {
        AuthSession session = resolveActiveSession(token);
        session.setRevoked(true);
        authSessionRepository.save(session);
    }

    @Override
    public UserProfileDto updateProfile(String token, UpdateProfileRequestDto request) {
        AuthSession session = resolveActiveSession(token);
        AppUser user = userRepository.findByUserId(session.getUserId())
                .orElseThrow(() -> new AuthException(HttpStatus.NOT_FOUND, "User not found"));

        if (request.getContactNumber() != null && !request.getContactNumber().trim().isEmpty()) {
            String normalizedContact = request.getContactNumber().trim();
            if (!normalizedContact.equals(user.getContactNumber())) {
                if (userRepository.existsByContactNumber(normalizedContact)) {
                    throw new AuthException(HttpStatus.CONFLICT, "Contact number already registered");
                }
                user.setContactNumber(normalizedContact);
            }
        }

        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (!passwordsMatch(request.getNewPassword(), request.getConfirmNewPassword())) {
                throw new AuthException(HttpStatus.BAD_REQUEST, PASSWORD_MISMATCH_ERROR);
            }
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        }

        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return toProfileDto(user);
    }

    private AuthResponseDto registerStaff(StaffRegistrationRequestDto request, UserRole role, String prefix) {
        if (!passwordsMatch(request.getPassword(), request.getConfirmPassword())) {
            throw new AuthException(HttpStatus.BAD_REQUEST, PASSWORD_MISMATCH_ERROR);
        }

        String providedUserId = normalizeUserId(request.getUserId());
        String generatedUserId = (providedUserId == null || providedUserId.isBlank())
                ? generateUniqueUserId(prefix)
                : providedUserId;

        validateUserId(generatedUserId, prefix);
        validateUniqueFields(request.getEmail(), request.getContactNumber(), generatedUserId);

        AppUser user = buildBaseUser(request, role);
        user.setUserId(generatedUserId);

        return createUserAndSession(user);
    }

    private AuthResponseDto createUserAndSession(AppUser user) {
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        AppUser savedUser = userRepository.save(user);
        return issueSession(savedUser, "Registration successful");
    }

    private AuthResponseDto issueSession(AppUser user, String message) {
        LocalDateTime now = LocalDateTime.now();
        String token = UUID.randomUUID().toString().replace("-", "");

        AuthSession session = new AuthSession();
        session.setToken(token);
        session.setUserId(user.getUserId());
        session.setEmail(user.getEmail());
        session.setRole(user.getRole());
        session.setIssuedAt(now);
        session.setExpiresAt(now.plusHours(SESSION_HOURS));
        session.setRevoked(false);
        authSessionRepository.save(session);

        AuthResponseDto response = new AuthResponseDto();
        response.setToken(token);
        response.setUserId(user.getUserId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setRedirectPath(resolveRedirectPath(user.getRole()));
        response.setMessage(message);
        return response;
    }

    private AppUser buildBaseUser(BaseRegistrationRequestDto request, UserRole role) {
        AppUser user = new AppUser();
        user.setFirstName(normalizeName(request.getFirstName()));
        user.setLastName(normalizeName(request.getLastName()));
        user.setFullName(buildFullName(request.getFirstName(), request.getLastName()));
        user.setEmail(normalizeEmail(request.getEmail()));
        user.setContactNumber(request.getContactNumber().trim());
        user.setRole(role);
        user.setPasswordHash(request.getPassword());
        return user;
    }

    private void validateUniqueFields(String email, String contactNumber, String userId) {
        String normalizedEmail = normalizeEmail(email);
        String normalizedContact = contactNumber.trim();
        String normalizedUserId = userId.trim().toUpperCase();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new AuthException(HttpStatus.CONFLICT, "Email already registered");
        }

        if (userRepository.existsByContactNumber(normalizedContact)) {
            throw new AuthException(HttpStatus.CONFLICT, "Contact number already registered");
        }

        if (userRepository.existsByUserId(normalizedUserId)) {
            throw new AuthException(HttpStatus.CONFLICT, "User ID already registered");
        }
    }

    private boolean passwordsMatch(String password, String confirmPassword) {
        return password != null && password.equals(confirmPassword);
    }

    private Faculty resolveFaculty(String facultyValue) {
        Faculty faculty = Faculty.fromDisplayName(facultyValue);
        if (faculty == null) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Invalid faculty selected");
        }
        return faculty;
    }

    private void validateUserId(String userId, String expectedPrefix) {
        if (userId == null || !userId.matches("^[A-Z]{2}\\d{8}$") || !userId.startsWith(expectedPrefix)) {
            throw new AuthException(HttpStatus.BAD_REQUEST, STUDENT_ID_ERROR);
        }
    }

    private String generateUniqueUserId(String prefix) {
        for (int attempt = 0; attempt < 1000; attempt++) {
            String candidate = prefix + String.format("%08d", (int) (Math.random() * 100_000_000));
            if (!userRepository.existsByUserId(candidate)) {
                return candidate;
            }
        }
        throw new AuthException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to generate user ID");
    }

    private AuthSession resolveActiveSession(String token) {
        if (token == null || token.isBlank()) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Please log in first");
        }

        String rawToken = token.trim();
        if (rawToken.toLowerCase().startsWith("bearer ")) {
            rawToken = rawToken.substring(7).trim();
        }

        AuthSession session = authSessionRepository.findByToken(rawToken)
                .orElseThrow(() -> new AuthException(HttpStatus.UNAUTHORIZED, "Please log in first"));

        if (session.isRevoked() || session.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Please log in first");
        }

        return session;
    }

    private UserProfileDto toProfileDto(AppUser user) {
        UserProfileDto profile = new UserProfileDto();
        profile.setUserId(user.getUserId());
        profile.setFullName(user.getFullName());
        profile.setEmail(user.getEmail());
        profile.setContactNumber(user.getContactNumber());
        profile.setRole(user.getRole());
        profile.setFaculty(user.getFaculty());
        profile.setAcademicYear(user.getAcademicYear());
        return profile;
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }

    private String normalizeName(String value) {
        if (value == null || value.isBlank()) {
            return value;
        }

        String trimmed = value.trim();
        String[] parts = trimmed.split("\\s+");
        StringBuilder builder = new StringBuilder();

        for (int index = 0; index < parts.length; index++) {
            String part = parts[index];
            if (part.isEmpty()) {
                continue;
            }

            if (builder.length() > 0) {
                builder.append(' ');
            }

            builder.append(Character.toUpperCase(part.charAt(0)));
            if (part.length() > 1) {
                builder.append(part.substring(1).toLowerCase());
            }
        }

        return builder.toString();
    }

    private String buildFullName(String firstName, String lastName) {
        return normalizeName(firstName) + " " + normalizeName(lastName);
    }

    private String normalizeUserId(String userId) {
        return userId == null ? null : userId.trim().toUpperCase();
    }

    private String resolveRedirectPath(UserRole role) {
        if (role == UserRole.STUDENT) {
            return "/";
        }
        return "/admin/dashboard";
    }

    private AppUser resolveUserForPasswordLogin(String email, String fullName, String password) {
        String normalizedEmail = normalizeEmail(email);
        if (normalizedEmail == null || normalizedEmail.isBlank()) {
            throw new AuthException(HttpStatus.NOT_FOUND, EMAIL_NOT_REGISTERED_ERROR);
        }

        return userRepository.findAllByEmailIgnoreCase(normalizedEmail).stream()
                .filter(user -> normalizeName(fullName).equalsIgnoreCase(user.getFullName()))
                .filter(user -> passwordEncoder.matches(password, user.getPasswordHash()))
                .findFirst()
                .orElseThrow(() -> {
                    if (userRepository.findAllByEmailIgnoreCase(normalizedEmail).isEmpty()) {
                        return new AuthException(HttpStatus.NOT_FOUND, EMAIL_NOT_REGISTERED_ERROR);
                    }
                    return new AuthException(HttpStatus.UNAUTHORIZED, INVALID_LOGIN_ERROR);
                });
    }

    private java.util.Optional<AppUser> resolveUserForOAuth(String email) {
        return userRepository.findAllByEmailIgnoreCase(email).stream()
                .sorted((left, right) -> Integer.compare(rolePriority(right.getRole()), rolePriority(left.getRole())))
                .findFirst();
    }

    private int rolePriority(UserRole role) {
        if (role == UserRole.ADMIN) {
            return 3;
        }
        if (role == UserRole.TECHNICIAN) {
            return 2;
        }
        return 1;
    }
}
