package com.groupxx.smartcampus.controller;

import com.groupxx.smartcampus.dto.BookingRequestDto;
import com.groupxx.smartcampus.dto.BookingQrCheckInRequestDto;
import com.groupxx.smartcampus.dto.BookingResponseDto;
import com.groupxx.smartcampus.dto.BookingStatusUpdateDto;
import com.groupxx.smartcampus.dto.BookingReviewDto;
import com.groupxx.smartcampus.enums.BookingStatus;
import com.groupxx.smartcampus.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(@Valid @RequestBody BookingRequestDto bookingDto) {
        BookingResponseDto createdBooking = bookingService.createBooking(bookingDto);
        return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<BookingResponseDto>> getAllBookings(
            @RequestParam(required = false) String resourceId,
            @RequestParam(required = false) LocalDate bookingDate,
            @RequestParam(required = false) BookingStatus status) {
        return ResponseEntity.ok(bookingService.getAllBookings(resourceId, bookingDate, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDto> getBookingById(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingResponseDto> updateBooking(@PathVariable String id,
                                                            @Valid @RequestBody BookingRequestDto bookingDto) {
        return ResponseEntity.ok(bookingService.updateBooking(id, bookingDto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingResponseDto> updateBookingStatus(@PathVariable String id,
                                                                  @Valid @RequestBody BookingStatusUpdateDto statusDto) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, statusDto.getStatus()));
    }

    @PostMapping("/{id}/qr")
    public ResponseEntity<BookingResponseDto> issueQrForBooking(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.issueQrForBooking(id));
    }

    @PostMapping("/check-in")
    public ResponseEntity<BookingResponseDto> checkInWithQrToken(@Valid @RequestBody BookingQrCheckInRequestDto checkInDto) {
        return ResponseEntity.ok(bookingService.checkInWithQrToken(checkInDto.getToken()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/review")
    public ResponseEntity<BookingResponseDto> reviewBooking(@PathVariable String id,
                                                            @Valid @RequestBody BookingReviewDto reviewDto) {
        return ResponseEntity.ok(bookingService.reviewBooking(id, reviewDto.getStatus(), reviewDto.getRejectionReason()));
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<BookingResponseDto>> getUserBookings(@PathVariable String email) {
        return ResponseEntity.ok(bookingService.getUserBookings(email));
    }
}
