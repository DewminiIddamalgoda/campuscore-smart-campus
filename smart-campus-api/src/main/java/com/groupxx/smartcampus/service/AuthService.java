package com.groupxx.smartcampus.service;

import com.groupxx.smartcampus.dto.auth.AdminRegistrationRequestDto;
import com.groupxx.smartcampus.dto.auth.AuthResponseDto;
import com.groupxx.smartcampus.dto.auth.LoginRequestDto;
import com.groupxx.smartcampus.dto.auth.StudentRegistrationRequestDto;
import com.groupxx.smartcampus.dto.auth.TechnicianRegistrationRequestDto;
import com.groupxx.smartcampus.dto.auth.UserProfileDto;

public interface AuthService {

    AuthResponseDto registerStudent(StudentRegistrationRequestDto request);

    AuthResponseDto registerAdmin(AdminRegistrationRequestDto request);

    AuthResponseDto registerTechnician(TechnicianRegistrationRequestDto request);

    AuthResponseDto login(LoginRequestDto request);

    AuthResponseDto loginWithOAuth(String email, String fullName, String firstName, String lastName);

    UserProfileDto getCurrentUser(String token);

    void logout(String token);
}
