package com.groupxx.smartcampus.dto.auth;

public class StaffRegistrationRequestDto extends BaseRegistrationRequestDto {

    private String userId;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
