package com.examly.springapp.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examly.springapp.model.Flight;

public interface FlightRepository extends JpaRepository<Flight,Long>
{
    List<Flight> findByOriginAndDestination(String origin, String destination);
    List<Flight> findByOriginAndDestinationAndDepartureTimeBetween(String origin, String destination,LocalDateTime start, LocalDateTime end);
    List<Flight> findByAirline(String airline);
    List<Flight> findByPriceLessThanEqual(double price);
}