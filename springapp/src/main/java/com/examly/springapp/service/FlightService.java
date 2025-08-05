package com.examly.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

import com.examly.springapp.model.Flight;
import com.examly.springapp.repository.FlightRepository;

@Service
public class FlightService
{
    @Autowired
    private FlightRepository flightrepository;

    public List<Flight> getAllFlights()
    {
        return flightrepository.findAll();
    }

    public List<Flight> getFlightsByAirline(String airline)
    {
        return flightrepository.findByAirline(airline);
    }

    public List<Flight> getFlightsByPrice(double price)
    {
        return flightrepository.findByPriceLessThanEqual(price);
    }

    public List<Flight> getFlightsByOriginDestinationAndTimeRange(String origin,String destination,LocalDateTime start,LocalDateTime end)
    {
        return flightrepository.findByOriginAndDestinationAndDepartureTimeBetween(origin,destination,start,end);
    }

    public Flight addFlight(Flight flight)
    {
        return flightrepository.save(flight);
    }
    
    public Optional<Flight> getFlightById(Long id)
    {
        return flightrepository.findById(id);
    }

    public void deleteFlight(Long id)
    {
        flightrepository.deleteById(id);
    }

    public List<Flight> searchFlights(String origin,String destination)
    {
        return flightrepository.findByOriginAndDestination(origin,destination);
    }

    public Flight updateFlight(Long id,Flight updatedFlight)
    {
        return flightrepository.findById(id).map(existing->{
            existing.setFlightNumber(updatedFlight.getFlightNumber());
            existing.setAirline(updatedFlight.getAirline());
            existing.setOrigin(updatedFlight.getOrigin());
            existing.setDestination(updatedFlight.getDestination());
            existing.setDepartureTime(updatedFlight.getDepartureTime());
            existing.setArrivalTime(updatedFlight.getArrivalTime());
            existing.setPrice(updatedFlight.getPrice());
            existing.setAvailableSeats(updatedFlight.getAvailableSeats());
            return flightrepository.save(existing);
        }).orElse(null);
    }
}