package com.groupxx.smartcampus.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookingRequestDto {

    @NotBlank(message = "Resource ID is required")
    private String resourceId;

    @NotBlank(message = "Booked by name is required")
    private String bookedByName;

    @NotBlank(message = "Booked by email is required")
    @Email(message = "Booked by email must be valid")
    private String bookedByEmail;

    @NotBlank(message = "Purpose is required")
    private String purpose;

    @NotNull(message = "Attendee count is required")
    @Positive(message = "Attendee count must be positive")
    private Integer attendeeCount;

    @NotNull(message = "Booking date is required")
    @FutureOrPresent(message = "Booking date must be today or later")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate bookingDate;

    @NotNull(message = "Start time is required")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;

    private String notes;

    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }

    public String getBookedByName() { return bookedByName; }
    public void setBookedByName(String bookedByName) { this.bookedByName = bookedByName; }

    public String getBookedByEmail() { return bookedByEmail; }
    public void setBookedByEmail(String bookedByEmail) { this.bookedByEmail = bookedByEmail; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public Integer getAttendeeCount() { return attendeeCount; }
    public void setAttendeeCount(Integer attendeeCount) { this.attendeeCount = attendeeCount; }

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
