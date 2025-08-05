package com.examly.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.service.BookingService;

// import jakarta.websocket.server.PathParam;

import com.examly.springapp.model.*;
import java.util.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    

    @Autowired
    private BookingService bookingService;

    @PostMapping("/flight")
    public Booking bookFlight(@RequestBody Map<String,Object> request)
    {
        Long flightId=Long.valueOf(request.get("flightId").toString());
        Long userID=Long.valueOf(request.get("userId").toString());
        // double price=Double.valueOf(request.getOrDefault("price", 5000).toString());
        return bookingService.createFlightBooking(flightId, userID).orElse(null);
    }
    @PostMapping("/hotel")
    public Booking bookHotel(@RequestBody Map<String,Object> request)
    {
        Long hotelId=Long.valueOf(request.get("hotelId").toString());
        Long userID=Long.valueOf(request.get("userId").toString());
        int nights=Integer.parseInt(request.get("nights").toString());
        // double price=Double.valueOf(request.getOrDefault("price", 5000).toString());

        // double pricePerNight=Double.valueOf(request.getOrDefault("pricePerNight", 3000).toString());
        return bookingService.createHotelBooking(hotelId, userID, nights).orElse(null);
    }

    @GetMapping
    public List<Booking> getAllBooking()
    {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id)
    {
        return bookingService.getBookingById(id).orElse(null);
    }

    @PutMapping("/{id}/cancel")
    public Booking cancelBooking(@PathVariable Long id)
    {
        return bookingService.cancelBooking(id).orElse(null);
    }
}
