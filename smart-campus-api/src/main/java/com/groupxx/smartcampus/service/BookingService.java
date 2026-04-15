package com.groupxx.smartcampus.service;

import com.groupxx.smartcampus.dto.BookingRequestDto;
import com.groupxx.smartcampus.dto.BookingResponseDto;
import com.groupxx.smartcampus.enums.BookingStatus;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {

    BookingResponseDto createBooking(BookingRequestDto bookingDto);

    List<BookingResponseDto> getAllBookings(String resourceId, LocalDate bookingDate, BookingStatus status);

    BookingResponseDto getBookingById(String id);

    BookingResponseDto updateBooking(String id, BookingRequestDto bookingDto);

    BookingResponseDto updateBookingStatus(String id, BookingStatus status);

    BookingResponseDto issueQrForBooking(String id);

    BookingResponseDto checkInWithQrToken(String token);

    void deleteBooking(String id);
}
