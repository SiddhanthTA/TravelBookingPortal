package com.examly.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;

import com.examly.springapp.model.Flight;
import com.examly.springapp.repository.FlightRepository;

@Service
public class FlightService {
    @Autowired private FlightRepository flightrepository;

    public List<Flight> getAllFlights(){ return flightrepository.findAll(); }
    public List<Flight> getFlightsByAirline(String airline){ return flightrepository.findByAirline(airline); }
    public List<Flight> getFlightsByPrice(double price){ return flightrepository.findByPriceLessThanEqual(price); }

    public List<Flight> searchFlightsByDate(String origin,String destination,String dateStr){
        if(origin==null||origin.isBlank())return Collections.emptyList();
        java.time.LocalDate requestedDate=null;
        if(dateStr!=null&&!dateStr.isBlank()){try{requestedDate=java.time.LocalDate.parse(dateStr);}catch(Exception e){return Collections.emptyList();}}
        final java.time.LocalDate filterDate=requestedDate;
        return flightrepository.findAll().stream()
            .filter(f->f.getOrigin()!=null&&f.getOrigin().equalsIgnoreCase(origin.trim()))
            .filter(f->destination==null||destination.isBlank()||(f.getDestination()!=null&&f.getDestination().equalsIgnoreCase(destination.trim())))
            .filter(f->filterDate==null||(f.getDepartureTime()!=null&&f.getDepartureTime().toLocalDate().equals(filterDate)))
            .sorted(Comparator.comparing(Flight::getDepartureTime)).toList();
    }
    public List<Flight> getFlightsByOriginDestinationAndTimeRange(String origin,String destination,LocalDateTime start,LocalDateTime end){return flightrepository.findByOriginAndDestinationAndDepartureTimeBetween(origin,destination,start,end);}
    public Flight addFlight(Flight flight){validate(flight,true);return flightrepository.save(flight);}
    public Optional<Flight> getFlightById(Long id){return flightrepository.findById(id);}
    public void deleteFlight(Long id){flightrepository.deleteById(id);}
    public List<Flight> searchFlights(String origin,String destination){return flightrepository.findByOriginAndDestination(origin,destination);}
    public Flight updateFlight(Long id,Flight updatedFlight){
        validate(updatedFlight,false);
        return flightrepository.findById(id).map(existing->{
            existing.setFlightNumber(updatedFlight.getFlightNumber().trim().toUpperCase());
            existing.setAirline(updatedFlight.getAirline().trim());
            existing.setOrigin(updatedFlight.getOrigin().trim());
            existing.setDestination(updatedFlight.getDestination().trim());
            existing.setDepartureTime(updatedFlight.getDepartureTime());
            existing.setArrivalTime(updatedFlight.getArrivalTime());
            existing.setPrice(updatedFlight.getPrice());
            existing.setAvailableSeats(updatedFlight.getAvailableSeats());
            return flightrepository.save(existing);
        }).orElse(null);
    }
    private void validate(Flight f,boolean creating){
        if(f==null)throw bad("Flight details are required.");
        if(f.getFlightNumber()==null||!f.getFlightNumber().trim().matches("(?i)[A-Z0-9-]{2,12}"))throw bad("Flight number must contain 2–12 letters, numbers or hyphens.");
        if(f.getAirline()==null||f.getAirline().trim().length()<2||f.getAirline().trim().length()>80)throw bad("Airline name must be 2–80 characters.");
        if(f.getOrigin()==null||f.getOrigin().trim().length()<2)throw bad("Enter a valid origin city.");
        if(f.getDestination()==null||f.getDestination().trim().length()<2||f.getOrigin().trim().equalsIgnoreCase(f.getDestination().trim()))throw bad("Enter a destination different from the origin.");
        if(f.getDepartureTime()==null||f.getArrivalTime()==null||!f.getArrivalTime().isAfter(f.getDepartureTime()))throw bad("Arrival time must be later than departure time.");
        if(creating&& !f.getDepartureTime().isAfter(LocalDateTime.now()))throw bad("A new flight must depart in the future.");
        if(!Double.isFinite(f.getPrice())||f.getPrice()<=0)throw bad("Flight fare must be greater than zero.");
        if(f.getAvailableSeats()<0||f.getAvailableSeats()>1000)throw bad("Available seats must be between 0 and 1,000.");
    }
    private ResponseStatusException bad(String message){return new ResponseStatusException(HttpStatus.BAD_REQUEST,message);}
}