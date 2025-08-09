package com.examly.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.service.annotation.DeleteExchange;

import com.examly.springapp.service.*;
import com.examly.springapp.model.*;
import java.util.*;

@PreAuthorize("hasRole('ADMIN')")
@RestController
@RequestMapping("/admin")
@CrossOrigin(origins="*")
public class AdminController {
    
    @Autowired
    private HotelService hotelService;

    @Autowired
    private FlightService flightService;

    @Autowired
    private AdminService adminService;


    @GetMapping("/bookings")
    public List<Booking> getAllBookings()
    {
        return adminService.getAllBookings();
    }

    @GetMapping("/bookings/{id}")
    public Booking getBookingById(@PathVariable Long id)
    {
        return adminService.getBookingById(id).orElse(null);
    }

    @DeleteMapping("/bookings/{id}")
    public Booking cancelBooking(@PathVariable Long id)
    {
        return adminService.cancelBooking(id).orElse(null);
    }

    @PostMapping("/bookings/hotel")
    public Booking adminBookHotel(@RequestBody Map<String,Object> request)
    {
        Long hotelId=Long.valueOf(request.get("hotelId").toString());
        Long userId=Long.valueOf(request.get("userId").toString());
        int nights=Integer.parseInt(request.get("nights").toString());
        return adminService.createHotelBooking(hotelId,userId,nights).orElse(null);
    }

    @PostMapping("/bookings/flight")
    public Booking adminBookFlight(@RequestBody Map<String,Object> request)
    {
        Long flightId=Long.valueOf(request.get("flightId").toString());
        Long userId=Long.valueOf(request.get("userId").toString());
        return adminService.createFlightBooking(flightId,userId).orElse(null);
    }
    
    @GetMapping("/hotels")
    public List<Hotel> adminGetAllHotels()
    {
        return hotelService.getAllHotels();
    }   

    @PostMapping("/hotels")
    public Hotel adminAddHotel(@RequestBody Hotel hotel)
    {
        return hotelService.addHotel(hotel);
    }

    @PutMapping("/hotels/{id}")
    public Hotel adminUpdateHotel(@PathVariable Long id, @RequestBody Hotel hotel)
    {
        return hotelService.updateHotel(id,hotel);
    }

    @DeleteMapping("/hotels/{id}")
    public void adminDeleteHotel(@PathVariable Long id)
    {
        hotelService.deleteHotel(id);
    }

    @GetMapping("/flights")
    public List<Flight> adminGetAllFlights()
    {
        return flightService.getAllFlights();
    }

    @PostMapping("/flights")
    public Flight adminAddFlight(@RequestBody Flight flight)
    {
        return flightService.addFlight(flight);
    }

    @GetMapping("/flights/{id}")
    public Flight adminGetFlightById(@PathVariable Long id)
    {
        return flightService.getFlightById(id).orElse(null);
    }

    @PutMapping("/flights/{id}")
    public Flight adminUpdateFlight(@PathVariable Long id,@RequestBody Flight flight)
    {
        return flightService.updateFlight(id,flight);
    }

    @DeleteMapping("/flights/{id}")
    public void adminDeleteFlight(@PathVariable Long id)
    {
        flightService.deleteFlight(id);
    }
}
