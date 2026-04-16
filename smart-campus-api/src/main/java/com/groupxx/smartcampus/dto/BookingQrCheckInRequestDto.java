package com.groupxx.smartcampus.dto;

import jakarta.validation.constraints.NotBlank;

public class BookingQrCheckInRequestDto {

    @NotBlank(message = "QR token is required")
    private String token;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
