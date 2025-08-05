package com.examly.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.service.FlightService;
import com.examly.springapp.model.Flight;
import java.util.*;

@RestController
@RequestMapping("/flights")
@CrossOrigin(origins="*")
public class FlightController {
    
    @Autowired
    private FlightService flightService;

    @GetMapping
    public List<Flight> getAllFlights()
    {
        return flightService.getAllFlights();
    }

    @PostMapping
    public Flight addFlight(@RequestBody Flight flight)
    {
        return flightService.addFlight(flight);
    }
    
    @GetMapping("/{id}")
    public Flight getFlightById(@PathVariable Long id)
    {
        return flightService.getFlightById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Flight updateFlight(@PathVariable Long id,@RequestBody Flight flight)
    {
        return flightService.updateFlight(id,flight);
    }

    @GetMapping("/search")
    public List<Flight> searchFlights(@RequestParam String origin,@RequestParam String destination)
    {
        return flightService.searchFlights(origin, destination);
    }
}
