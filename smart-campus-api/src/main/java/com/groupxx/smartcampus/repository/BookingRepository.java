package com.groupxx.smartcampus.repository;

import com.groupxx.smartcampus.entity.Booking;
import com.groupxx.smartcampus.enums.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findAllByOrderByBookingDateAscStartTimeAsc();

    List<Booking> findByResourceIdOrderByBookingDateAscStartTimeAsc(String resourceId);

    List<Booking> findByBookingDateOrderByStartTimeAsc(LocalDate bookingDate);

    List<Booking> findByStatusOrderByBookingDateAscStartTimeAsc(BookingStatus status);

    List<Booking> findByResourceIdAndBookingDateAndStatusIn(String resourceId,
                                                            LocalDate bookingDate,
                                                            Collection<BookingStatus> statuses);

    Optional<Booking> findByQrToken(String qrToken);

    List<Booking> findByBookedByEmailOrderByBookingDateDescStartTimeDesc(String bookedByEmail);
}
