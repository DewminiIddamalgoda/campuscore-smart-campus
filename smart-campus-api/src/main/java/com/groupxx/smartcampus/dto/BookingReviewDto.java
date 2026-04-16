package com.groupxx.smartcampus.dto;

import com.groupxx.smartcampus.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;

public class BookingReviewDto {

    @NotNull(message = "Status is required")
    private BookingStatus status;

    private String rejectionReason;

    public BookingReviewDto() {
    }

    public BookingReviewDto(BookingStatus status, String rejectionReason) {
        this.status = status;
        this.rejectionReason = rejectionReason;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
