package com.groupxx.smartcampus;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.groupxx.smartcampus.controller.BookingController;
import com.groupxx.smartcampus.dto.BookingRequestDto;
import com.groupxx.smartcampus.dto.BookingResponseDto;
import com.groupxx.smartcampus.dto.BookingStatusUpdateDto;
import com.groupxx.smartcampus.enums.BookingStatus;
import com.groupxx.smartcampus.exception.BookingConflictException;
import com.groupxx.smartcampus.exception.BookingValidationException;
import com.groupxx.smartcampus.service.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BookingController.class)
public class BookingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BookingService bookingService;

    @Autowired
    private ObjectMapper objectMapper;

    private BookingRequestDto bookingRequestDto;
    private BookingResponseDto bookingResponseDto;
    private BookingStatusUpdateDto statusUpdateDto;

    @BeforeEach
    public void setUp() {
        bookingRequestDto = new BookingRequestDto();
        bookingRequestDto.setResourceId("resource-123");
        bookingRequestDto.setBookedByName("John Doe");
        bookingRequestDto.setBookedByEmail("john@example.com");
        bookingRequestDto.setPurpose("Team meeting");
        bookingRequestDto.setAttendeeCount(5);
        bookingRequestDto.setBookingDate(LocalDate.now().plusDays(7));
        bookingRequestDto.setStartTime(LocalTime.of(10, 0));
        bookingRequestDto.setEndTime(LocalTime.of(11, 0));
        bookingRequestDto.setNotes("Conference room needed");

        bookingResponseDto = new BookingResponseDto();
        bookingResponseDto.setId("booking-123");
        bookingResponseDto.setResourceId("resource-123");
        bookingResponseDto.setResourceName("Meeting Room A");
        bookingResponseDto.setBookedByName("John Doe");
        bookingResponseDto.setBookedByEmail("john@example.com");
        bookingResponseDto.setPurpose("Team meeting");
        bookingResponseDto.setAttendeeCount(5);
        bookingResponseDto.setBookingDate(LocalDate.now().plusDays(7));
        bookingResponseDto.setStartTime(LocalTime.of(10, 0));
        bookingResponseDto.setEndTime(LocalTime.of(11, 0));
        bookingResponseDto.setStatus(BookingStatus.PENDING);
        bookingResponseDto.setNotes("Conference room needed");

        statusUpdateDto = new BookingStatusUpdateDto();
        statusUpdateDto.setStatus(BookingStatus.APPROVED);
    }

    @Test
    public void testCreateBookingSuccess() throws Exception {
        when(bookingService.createBooking(any(BookingRequestDto.class)))
                .thenReturn(bookingResponseDto);

        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bookingRequestDto)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value("booking-123"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    public void testCreateBookingWithInvalidTimeRange() throws Exception {
        bookingRequestDto.setStartTime(LocalTime.of(11, 0));
        bookingRequestDto.setEndTime(LocalTime.of(10, 0));

        when(bookingService.createBooking(any(BookingRequestDto.class)))
                .thenThrow(new BookingValidationException("Start time must be earlier than end time"));

        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bookingRequestDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Start time must be earlier than end time"));
    }

    @Test
    public void testCreateBookingWithConflict() throws Exception {
        when(bookingService.createBooking(any(BookingRequestDto.class)))
                .thenThrow(new BookingConflictException("This resource already has a booking during the selected time slot"));

        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bookingRequestDto)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").contains("already has a booking"));
    }

    @Test
    public void testGetAllBookings() throws Exception {
        when(bookingService.getAllBookings(null, null, null))
                .thenReturn(Collections.singletonList(bookingResponseDto));

        mockMvc.perform(get("/bookings"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    public void testGetBookingById() throws Exception {
        when(bookingService.getBookingById("booking-123"))
                .thenReturn(bookingResponseDto);

        mockMvc.perform(get("/bookings/booking-123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("booking-123"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    public void testUpdateBooking() throws Exception {
        bookingRequestDto.setPurpose("Updated meeting purpose");
        bookingResponseDto.setPurpose("Updated meeting purpose");

        when(bookingService.updateBooking(eq("booking-123"), any(BookingRequestDto.class)))
                .thenReturn(bookingResponseDto);

        mockMvc.perform(put("/bookings/booking-123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bookingRequestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.purpose").value("Updated meeting purpose"));
    }

    @Test
    public void testUpdateBookingStatusToApproved() throws Exception {
        bookingResponseDto.setStatus(BookingStatus.APPROVED);

        when(bookingService.updateBookingStatus(eq("booking-123"), eq(BookingStatus.APPROVED)))
                .thenReturn(bookingResponseDto);

        mockMvc.perform(patch("/bookings/booking-123/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"));
    }

    @Test
    public void testUpdateBookingStatusToRejected() throws Exception {
        statusUpdateDto.setStatus(BookingStatus.REJECTED);
        bookingResponseDto.setStatus(BookingStatus.REJECTED);

        when(bookingService.updateBookingStatus(eq("booking-123"), eq(BookingStatus.REJECTED)))
                .thenReturn(bookingResponseDto);

        mockMvc.perform(patch("/bookings/booking-123/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REJECTED"));
    }

    @Test
    public void testUpdateBookingStatusToCancelled() throws Exception {
        statusUpdateDto.setStatus(BookingStatus.CANCELLED);
        bookingResponseDto.setStatus(BookingStatus.CANCELLED);

        when(bookingService.updateBookingStatus(eq("booking-123"), eq(BookingStatus.CANCELLED)))
                .thenReturn(bookingResponseDto);

        mockMvc.perform(patch("/bookings/booking-123/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));
    }

    @Test
    public void testCancelledBookingCannotChangeStatus() throws Exception {
        statusUpdateDto.setStatus(BookingStatus.APPROVED);

        when(bookingService.updateBookingStatus(eq("booking-123"), eq(BookingStatus.APPROVED)))
                .thenThrow(new BookingValidationException("Cancelled or rejected bookings cannot change status"));

        mockMvc.perform(patch("/bookings/booking-123/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdateDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").contains("cannot change status"));
    }

    @Test
    public void testApprovedBookingCannotBeRejected() throws Exception {
        statusUpdateDto.setStatus(BookingStatus.REJECTED);

        when(bookingService.updateBookingStatus(eq("booking-123"), eq(BookingStatus.REJECTED)))
                .thenThrow(new BookingValidationException("Approved bookings cannot be rejected"));

        mockMvc.perform(patch("/bookings/booking-123/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdateDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").contains("cannot be rejected"));
    }

    @Test
    public void testDeleteBooking() throws Exception {
        mockMvc.perform(delete("/bookings/booking-123"))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testGetBookingsByResourceIdFilter() throws Exception {
        when(bookingService.getAllBookings(eq("resource-123"), null, null))
                .thenReturn(Collections.singletonList(bookingResponseDto));

        mockMvc.perform(get("/bookings?resourceId=resource-123"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    public void testGetBookingsByStatusFilter() throws Exception {
        when(bookingService.getAllBookings(null, null, eq(BookingStatus.PENDING)))
                .thenReturn(Collections.singletonList(bookingResponseDto));

        mockMvc.perform(get("/bookings?status=PENDING"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}
