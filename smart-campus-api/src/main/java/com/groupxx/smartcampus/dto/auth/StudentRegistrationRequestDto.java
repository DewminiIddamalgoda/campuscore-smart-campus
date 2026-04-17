package com.groupxx.smartcampus.dto.auth;

import jakarta.validation.constraints.NotBlank;

public class StudentRegistrationRequestDto extends BaseRegistrationRequestDto {

    @NotBlank(message = "Faculty is required")
    private String faculty;

    @NotBlank(message = "Academic year is required")
    private String academicYear;

    @NotBlank(message = "User ID is required")
    private String userId;

    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
