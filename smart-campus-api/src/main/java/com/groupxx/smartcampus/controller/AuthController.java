package com.groupxx.smartcampus.controller;

import com.groupxx.smartcampus.dto.auth.AdminRegistrationRequestDto;
import com.groupxx.smartcampus.dto.auth.AuthResponseDto;
import com.groupxx.smartcampus.dto.auth.LoginRequestDto;
import com.groupxx.smartcampus.dto.auth.StudentRegistrationRequestDto;
import com.groupxx.smartcampus.dto.auth.TechnicianRegistrationRequestDto;
import com.groupxx.smartcampus.dto.auth.UserProfileDto;
import com.groupxx.smartcampus.dto.auth.UpdateProfileRequestDto;
import com.groupxx.smartcampus.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register/student")
    public ResponseEntity<AuthResponseDto> registerStudent(@Valid @RequestBody StudentRegistrationRequestDto request) {
        return new ResponseEntity<>(authService.registerStudent(request), HttpStatus.CREATED);
    }

    @PostMapping("/register/admin")
    public ResponseEntity<AuthResponseDto> registerAdmin(@Valid @RequestBody AdminRegistrationRequestDto request) {
        return new ResponseEntity<>(authService.registerAdmin(request), HttpStatus.CREATED);
    }

    @PostMapping("/register/technician")
    public ResponseEntity<AuthResponseDto> registerTechnician(@Valid @RequestBody TechnicianRegistrationRequestDto request) {
        return new ResponseEntity<>(authService.registerTechnician(request), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> me(@RequestHeader(value = "Authorization", required = false) String authorization) {
        return ResponseEntity.ok(authService.getCurrentUser(authorization));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDto> updateProfile(@RequestHeader(value = "Authorization", required = false) String authorization,
                                                        @RequestBody UpdateProfileRequestDto request) {
        return ResponseEntity.ok(authService.updateProfile(authorization, request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestHeader(value = "Authorization", required = false) String authorization) {
        authService.logout(authorization);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/oauth/google/enabled")
    public ResponseEntity<Map<String, Boolean>> googleOAuthEnabled() {
        boolean enabled = isGoogleOAuthEnabled();
        return ResponseEntity.ok(Map.of("enabled", enabled));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserProfileDto>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    private boolean isGoogleOAuthEnabled() {
        String clientId = System.getenv("GOOGLE_CLIENT_ID");
        String clientSecret = System.getenv("GOOGLE_CLIENT_SECRET");
        return clientId != null && !clientId.isBlank() && clientSecret != null && !clientSecret.isBlank();
    }
}
