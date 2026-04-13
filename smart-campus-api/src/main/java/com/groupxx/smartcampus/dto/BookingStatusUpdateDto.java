package com.groupxx.smartcampus.dto;

import com.groupxx.smartcampus.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;

public class BookingStatusUpdateDto {

    @NotNull(message = "Booking status is required")
    private BookingStatus status;

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
}
