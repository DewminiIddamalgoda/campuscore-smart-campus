package com.groupxx.smartcampus.service.impl;

import com.groupxx.smartcampus.dto.BookingResponseDto;
import com.groupxx.smartcampus.entity.Booking;
import com.groupxx.smartcampus.entity.Resource;
import com.groupxx.smartcampus.enums.BookingStatus;
import com.groupxx.smartcampus.enums.ResourceStatus;
import com.groupxx.smartcampus.exception.BookingValidationException;
import com.groupxx.smartcampus.repository.BookingRepository;
import com.groupxx.smartcampus.repository.ResourceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private ResourceRepository resourceRepository;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private Resource resource;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;

    @BeforeEach
    void setUp() {
        bookingDate = LocalDate.of(2026, 4, 20);
        startTime = LocalTime.of(10, 0);
        endTime = LocalTime.of(11, 0);

        resource = new Resource();
        resource.setId("resource-123");
        resource.setName("Meeting Room A");
        resource.setLocation("Block A");
        resource.setCapacity(20);
        resource.setStatus(ResourceStatus.ACTIVE);
        resource.setAvailableFrom("08:00");
        resource.setAvailableTo("18:00");
    }

    @Test
    void shouldAllowApprovedBookingToBeRejectedThroughReview() {
        Booking booking = buildBooking(BookingStatus.APPROVED);
        booking.setQrToken("qr-token");
        booking.setQrIssuedAt(LocalDateTime.of(2026, 4, 20, 9, 30));
        booking.setQrExpiresAt(LocalDateTime.of(2026, 4, 20, 11, 30));

        when(bookingRepository.findById("booking-123")).thenReturn(Optional.of(booking));
        when(resourceRepository.findById("resource-123")).thenReturn(Optional.of(resource));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponseDto response = bookingService.reviewBooking("booking-123", BookingStatus.REJECTED, "Room unavailable");

        assertEquals(BookingStatus.REJECTED, response.getStatus());
        assertNull(response.getQrToken());
        assertNull(response.getQrIssuedAt());
        assertNull(response.getQrExpiresAt());
        assertNull(response.getCheckedInAt());

        ArgumentCaptor<Booking> captor = ArgumentCaptor.forClass(Booking.class);
        verify(bookingRepository).save(captor.capture());
        Booking savedBooking = captor.getValue();
        assertEquals(BookingStatus.REJECTED, savedBooking.getStatus());
        assertEquals("Room unavailable", savedBooking.getRejectionReason());
        assertNull(savedBooking.getQrToken());
        assertNull(savedBooking.getQrIssuedAt());
        assertNull(savedBooking.getQrExpiresAt());
        assertNull(savedBooking.getCheckedInAt());
    }

    @Test
    void shouldAllowRejectedBookingToBeApprovedThroughStatusUpdate() {
        Booking booking = buildBooking(BookingStatus.REJECTED);
        booking.setRejectionReason("Old reason");

        when(bookingRepository.findById("booking-123")).thenReturn(Optional.of(booking));
        when(resourceRepository.findById("resource-123")).thenReturn(Optional.of(resource));
        when(bookingRepository.findByResourceIdAndBookingDateAndStatusIn(
                eq("resource-123"),
                eq(bookingDate),
                anyCollection()))
                .thenReturn(Collections.emptyList());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponseDto response = bookingService.updateBookingStatus("booking-123", BookingStatus.APPROVED);

        assertEquals(BookingStatus.APPROVED, response.getStatus());
        assertNull(response.getRejectionReason());

        ArgumentCaptor<Booking> captor = ArgumentCaptor.forClass(Booking.class);
        verify(bookingRepository).save(captor.capture());
        Booking savedBooking = captor.getValue();
        assertEquals(BookingStatus.APPROVED, savedBooking.getStatus());
        assertNull(savedBooking.getRejectionReason());
    }

    @Test
    void shouldBlockCancelledBookingsFromChangingStatus() {
        Booking booking = buildBooking(BookingStatus.CANCELLED);

        when(bookingRepository.findById("booking-123")).thenReturn(Optional.of(booking));

        BookingValidationException exception = assertThrows(
                BookingValidationException.class,
                () -> bookingService.updateBookingStatus("booking-123", BookingStatus.APPROVED)
        );

        assertEquals("Cancelled bookings cannot change status", exception.getMessage());
        verify(resourceRepository, never()).findById(any());
        verify(bookingRepository, never()).save(any());
    }

    private Booking buildBooking(BookingStatus status) {
        Booking booking = new Booking();
        booking.setId("booking-123");
        booking.setResourceId("resource-123");
        booking.setBookedByName("John Doe");
        booking.setBookedByEmail("john@example.com");
        booking.setPurpose("Team meeting");
        booking.setAttendeeCount(5);
        booking.setBookingDate(bookingDate);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setStatus(status);
        booking.setNotes("Conference room needed");
        return booking;
    }
}
