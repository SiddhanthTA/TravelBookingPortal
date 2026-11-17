package com.examly.springapp.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.examly.springapp.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);

    @Query("select coalesce(sum(b.rooms), 0) from Booking b "
            + "where b.hotelId = :hotelId and b.status = 'CONFIRMED' "
            + "and b.checkInDate < :checkOut and b.checkOutDate > :checkIn")
    long countOverlappingHotelRooms(
            @Param("hotelId") Long hotelId,
            @Param("checkOut") LocalDate checkOut,
            @Param("checkIn") LocalDate checkIn);
}
