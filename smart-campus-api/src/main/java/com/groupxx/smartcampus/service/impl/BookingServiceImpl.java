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
import java.time.LocalTime;
import java.util.EnumSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private static final EnumSet<BookingStatus> CONFLICT_BLOCKING_STATUSES =
            EnumSet.of(BookingStatus.PENDING, BookingStatus.APPROVED);

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
        return convertToResponseDto(bookingRepository.save(booking));
    }

    @Override
    public void deleteBooking(String id) {
        Booking booking = getBookingEntityById(id);
        bookingRepository.delete(booking);
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

        if (currentStatus == BookingStatus.CANCELLED || currentStatus == BookingStatus.REJECTED) {
            throw new BookingValidationException("Cancelled or rejected bookings cannot change status");
        }

        if (currentStatus == BookingStatus.APPROVED && newStatus == BookingStatus.REJECTED) {
            throw new BookingValidationException("Approved bookings cannot be rejected");
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
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setUpdatedAt(booking.getUpdatedAt());

        if (resource != null) {
            dto.setResourceName(resource.getName());
            dto.setResourceLocation(resource.getLocation());
        }

        return dto;
    }
}
