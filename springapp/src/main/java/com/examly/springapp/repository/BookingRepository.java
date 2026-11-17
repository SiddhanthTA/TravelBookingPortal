package com.examly.springapp.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.examly.springapp.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select b from Booking b where b.id = :id")
    Optional<Booking> findByIdForUpdate(@Param("id") Long id);

    @Query("select coalesce(sum(b.rooms), 0) from Booking b "
            + "where b.hotelId = :hotelId and b.status = 'CONFIRMED' "
            + "and b.checkInDate < :checkOut and b.checkOutDate > :checkIn")
    long countOverlappingHotelRooms(
            @Param("hotelId") Long hotelId,
            @Param("checkOut") LocalDate checkOut,
            @Param("checkIn") LocalDate checkIn);
}
