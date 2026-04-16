package com.groupxx.smartcampus.service.impl;

import com.groupxx.smartcampus.dto.BookingRequestDto;
import com.groupxx.smartcampus.dto.BookingResponseDto;
import com.groupxx.smartcampus.entity.Booking;
import com.groupxx.smartcampus.entity.Resource;
import com.groupxx.smartcampus.enums.BookingStatus;
import com.groupxx.smartcampus.enums.ResourceStatus;
import com.groupxx.smartcampus.exception.BookingConflictException;
import com.groupxx.smartcampus.exception.BookingNotFoundException;
import com.groupxx.smartcampus.exception.BookingValidationException;
import com.groupxx.smartcampus.exception.ResourceNotFoundException;
import com.groupxx.smartcampus.repository.BookingRepository;
import com.groupxx.smartcampus.repository.ResourceRepository;
import com.groupxx.smartcampus.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.LocalTime;
import java.util.EnumSet;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private static final EnumSet<BookingStatus> CONFLICT_BLOCKING_STATUSES =
            EnumSet.of(BookingStatus.PENDING, BookingStatus.APPROVED);
    private static final int CHECK_IN_WINDOW_BEFORE_MINUTES = 15;
    private static final int CHECK_IN_WINDOW_AFTER_MINUTES = 30;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Override
    public BookingResponseDto createBooking(BookingRequestDto bookingDto) {
        Resource resource = getActiveResource(bookingDto.getResourceId());
        validateBookingRequest(bookingDto, resource, null);

        Booking booking = new Booking();
        mapRequestToEntity(bookingDto, booking);
        booking.setStatus(BookingStatus.PENDING);

        return convertToResponseDto(bookingRepository.save(booking), resource);
    }

    @Override
    public List<BookingResponseDto> getAllBookings(String resourceId, LocalDate bookingDate, BookingStatus status) {
        List<Booking> bookings;

        if (resourceId != null && bookingDate != null && status != null) {
            bookings = bookingRepository.findByResourceIdAndBookingDateAndStatusIn(resourceId, bookingDate, List.of(status));
        } else if (resourceId != null) {
            bookings = bookingRepository.findByResourceIdOrderByBookingDateAscStartTimeAsc(resourceId);
        } else if (bookingDate != null) {
            bookings = bookingRepository.findByBookingDateOrderByStartTimeAsc(bookingDate);
        } else if (status != null) {
            bookings = bookingRepository.findByStatusOrderByBookingDateAscStartTimeAsc(status);
        } else {
            bookings = bookingRepository.findAllByOrderByBookingDateAscStartTimeAsc();
        }

        return bookings.stream()
                .filter(booking -> resourceId == null || resourceId.equals(booking.getResourceId()))
                .filter(booking -> bookingDate == null || bookingDate.equals(booking.getBookingDate()))
                .filter(booking -> status == null || status == booking.getStatus())
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponseDto getBookingById(String id) {
        Booking booking = getBookingEntityById(id);
        return convertToResponseDto(booking);
    }

    @Override
    public BookingResponseDto updateBooking(String id, BookingRequestDto bookingDto) {
        Booking existingBooking = getBookingEntityById(id);
        if (!isEditable(existingBooking.getStatus())) {
            throw new BookingValidationException("Only pending or approved bookings can be updated");
        }

        Resource resource = getActiveResource(bookingDto.getResourceId());
        validateBookingRequest(bookingDto, resource, id);

        mapRequestToEntity(bookingDto, existingBooking);
        clearQrData(existingBooking);
        return convertToResponseDto(bookingRepository.save(existingBooking), resource);
    }

    @Override
    public BookingResponseDto updateBookingStatus(String id, BookingStatus status) {
        Booking booking = getBookingEntityById(id);
        validateStatusTransition(booking, status);

        if (status == BookingStatus.APPROVED) {
            Resource resource = getActiveResource(booking.getResourceId());
            validateConflict(booking.getId(), resource, booking.getBookingDate(), booking.getStartTime(), booking.getEndTime());
        }

        booking.setStatus(status);

        booking.setRejectionReason(null);

        if (status != BookingStatus.APPROVED) {
            clearQrData(booking);
        }

        return convertToResponseDto(bookingRepository.save(booking));
    }

    @Override
    public BookingResponseDto issueQrForBooking(String id) {
        Booking booking = getBookingEntityById(id);

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new BookingValidationException("QR codes can only be issued for approved bookings");
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime bookingEnd = LocalDateTime.of(booking.getBookingDate(), booking.getEndTime());
        LocalDateTime qrExpiry = bookingEnd.plusMinutes(CHECK_IN_WINDOW_AFTER_MINUTES);

        if (now.isAfter(qrExpiry)) {
            throw new BookingValidationException("Cannot issue QR for a booking that has already ended");
        }

        booking.setQrToken(UUID.randomUUID().toString());
        booking.setQrIssuedAt(now);
        booking.setQrExpiresAt(qrExpiry);
        booking.setCheckedInAt(null);

        return convertToResponseDto(bookingRepository.save(booking));
    }

    @Override
    public BookingResponseDto checkInWithQrToken(String token) {
        Booking booking = bookingRepository.findByQrToken(token)
                .orElseThrow(() -> new BookingValidationException("Invalid QR token"));

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new BookingValidationException("Only approved bookings can be checked in");
        }

        if (booking.getCheckedInAt() != null) {
            throw new BookingValidationException("This booking has already been checked in");
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime bookingStart = LocalDateTime.of(booking.getBookingDate(), booking.getStartTime());
        LocalDateTime bookingEnd = LocalDateTime.of(booking.getBookingDate(), booking.getEndTime());
        LocalDateTime windowStart = bookingStart.minusMinutes(CHECK_IN_WINDOW_BEFORE_MINUTES);
        LocalDateTime windowEnd = bookingEnd.plusMinutes(CHECK_IN_WINDOW_AFTER_MINUTES);

        if (now.isBefore(windowStart) || now.isAfter(windowEnd)) {
            String errorMsg = String.format(
                "Check-in window closed. Valid window: %s to %s (from 15 min before start until 30 min after end)",
                windowStart.format(DateTimeFormatter.ofPattern("HH:mm")),
                windowEnd.format(DateTimeFormatter.ofPattern("HH:mm"))
            );
            throw new BookingValidationException(errorMsg);
        }

        if (booking.getQrExpiresAt() != null && now.isAfter(booking.getQrExpiresAt())) {
            throw new BookingValidationException("QR token has expired");
        }

        booking.setCheckedInAt(now);
        return convertToResponseDto(bookingRepository.save(booking));
    }

    @Override
    public void deleteBooking(String id) {
        Booking booking = getBookingEntityById(id);
        bookingRepository.delete(booking);
    }

    @Override
    public BookingResponseDto reviewBooking(String id, BookingStatus status, String rejectionReason) {
        Booking booking = getBookingEntityById(id);
        validateStatusTransition(booking, status);

        if (status == BookingStatus.APPROVED) {
            Resource resource = getActiveResource(booking.getResourceId());
            validateConflict(booking.getId(), resource, booking.getBookingDate(), booking.getStartTime(), booking.getEndTime());
        }

        booking.setStatus(status);

        if (status == BookingStatus.REJECTED) {
            booking.setRejectionReason(rejectionReason);
            clearQrData(booking);
        } else if (status == BookingStatus.APPROVED) {
            booking.setRejectionReason(null);
        } else if (status != BookingStatus.APPROVED) {
            clearQrData(booking);
        }

        return convertToResponseDto(bookingRepository.save(booking));
    }

    @Override
    public List<BookingResponseDto> getUserBookings(String email) {
        List<Booking> bookings = bookingRepository.findByBookedByEmailOrderByBookingDateDescStartTimeDesc(email);
        return bookings.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    private Booking getBookingEntityById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));
    }

    private Resource getActiveResource(String resourceId) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + resourceId));

        if (resource.getStatus() != ResourceStatus.ACTIVE) {
            throw new BookingValidationException("Bookings can only be created for active resources");
        }

        return resource;
    }

    private void validateBookingRequest(BookingRequestDto bookingDto, Resource resource, String bookingIdToIgnore) {
        if (!bookingDto.getStartTime().isBefore(bookingDto.getEndTime())) {
            throw new BookingValidationException("Start time must be earlier than end time");
        }

        if (resource.getCapacity() != null && bookingDto.getAttendeeCount() > resource.getCapacity()) {
            throw new BookingValidationException("Attendee count exceeds the selected resource capacity");
        }

        validateWithinResourceAvailability(resource, bookingDto.getStartTime(), bookingDto.getEndTime());
        validateConflict(bookingIdToIgnore, resource, bookingDto.getBookingDate(), bookingDto.getStartTime(), bookingDto.getEndTime());
    }

    private void validateWithinResourceAvailability(Resource resource, LocalTime startTime, LocalTime endTime) {
        if (resource.getAvailableFrom() == null || resource.getAvailableTo() == null) {
            return;
        }

        LocalTime resourceStart = LocalTime.parse(resource.getAvailableFrom());
        LocalTime resourceEnd = LocalTime.parse(resource.getAvailableTo());

        if (startTime.isBefore(resourceStart) || endTime.isAfter(resourceEnd)) {
            throw new BookingValidationException(
                    "Booking time must be within the resource availability window of "
                            + resource.getAvailableFrom() + " to " + resource.getAvailableTo()
            );
        }
    }

    private void validateConflict(String bookingIdToIgnore,
                                  Resource resource,
                                  LocalDate bookingDate,
                                  LocalTime startTime,
                                  LocalTime endTime) {
        List<Booking> existingBookings = bookingRepository.findByResourceIdAndBookingDateAndStatusIn(
                resource.getId(),
                bookingDate,
                CONFLICT_BLOCKING_STATUSES
        );

        boolean hasConflict = existingBookings.stream()
                .filter(existing -> bookingIdToIgnore == null || !existing.getId().equals(bookingIdToIgnore))
                .anyMatch(existing -> timesOverlap(existing.getStartTime(), existing.getEndTime(), startTime, endTime));

        if (hasConflict) {
            throw new BookingConflictException("This resource already has a booking during the selected time slot");
        }
    }

    private boolean timesOverlap(LocalTime existingStart,
                                 LocalTime existingEnd,
                                 LocalTime requestedStart,
                                 LocalTime requestedEnd) {
        return existingStart.isBefore(requestedEnd) && existingEnd.isAfter(requestedStart);
    }

    private boolean isEditable(BookingStatus status) {
        return status == BookingStatus.PENDING || status == BookingStatus.APPROVED;
    }

    private void validateStatusTransition(Booking booking, BookingStatus newStatus) {
        BookingStatus currentStatus = booking.getStatus();

        if (currentStatus == newStatus) {
            return;
        }

        if (currentStatus == BookingStatus.CANCELLED) {
            throw new BookingValidationException("Cancelled bookings cannot change status");
        }

        if (currentStatus == BookingStatus.REJECTED && newStatus != BookingStatus.APPROVED) {
            throw new BookingValidationException("Rejected bookings can only be changed back to approved");
        }
    }

    private void mapRequestToEntity(BookingRequestDto bookingDto, Booking booking) {
        booking.setResourceId(bookingDto.getResourceId());
        booking.setBookedByName(bookingDto.getBookedByName());
        booking.setBookedByEmail(bookingDto.getBookedByEmail());
        booking.setPurpose(bookingDto.getPurpose());
        booking.setAttendeeCount(bookingDto.getAttendeeCount());
        booking.setBookingDate(bookingDto.getBookingDate());
        booking.setStartTime(bookingDto.getStartTime());
        booking.setEndTime(bookingDto.getEndTime());
        booking.setNotes(bookingDto.getNotes());
    }

    private void clearQrData(Booking booking) {
        booking.setQrToken(null);
        booking.setQrIssuedAt(null);
        booking.setQrExpiresAt(null);
        booking.setCheckedInAt(null);
    }

    private BookingResponseDto convertToResponseDto(Booking booking) {
        Resource resource = resourceRepository.findById(booking.getResourceId()).orElse(null);
        return convertToResponseDto(booking, resource);
    }

    private BookingResponseDto convertToResponseDto(Booking booking, Resource resource) {
        BookingResponseDto dto = new BookingResponseDto();
        dto.setId(booking.getId());
        dto.setResourceId(booking.getResourceId());
        dto.setBookedByName(booking.getBookedByName());
        dto.setBookedByEmail(booking.getBookedByEmail());
        dto.setPurpose(booking.getPurpose());
        dto.setAttendeeCount(booking.getAttendeeCount());
        dto.setBookingDate(booking.getBookingDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setStatus(booking.getStatus());
        dto.setNotes(booking.getNotes());
        dto.setQrToken(booking.getQrToken());
        dto.setQrIssuedAt(booking.getQrIssuedAt());
        dto.setQrExpiresAt(booking.getQrExpiresAt());
        dto.setCheckedInAt(booking.getCheckedInAt());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setUpdatedAt(booking.getUpdatedAt());

        if (resource != null) {
            dto.setResourceName(resource.getName());
            dto.setResourceLocation(resource.getLocation());
        }

        return dto;
    }
}
