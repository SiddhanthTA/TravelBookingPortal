package com.examly.springapp.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.examly.springapp.model.Flight;

public interface FlightRepository extends JpaRepository<Flight, Long> {
    List<Flight> findByOriginAndDestination(String origin, String destination);
    boolean existsByFlightNumber(String flightNumber);
    List<Flight> findByOriginAndDestinationAndDepartureTimeBetween(String origin, String destination, LocalDateTime start, LocalDateTime end);
    List<Flight> findByAirline(String airline);
    List<Flight> findByPriceLessThanEqual(double price);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select f from Flight f where f.id = :id")
    Optional<Flight> findByIdForUpdate(@Param("id") Long id);
}
