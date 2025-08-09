package com.examly.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.model.Booking;
import com.examly.springapp.model.User;
import com.examly.springapp.service.BookingService;
import com.examly.springapp.service.UserService;
import java.util.*;

// import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/Auth")
public class UsermodelController {
    

    @Autowired
    UserService ser;

    @Autowired
    private BookingService bookingService;

    @PostMapping("/register")
    public String insertData(@RequestBody User data)
    {
        return ser.register(data);
    }

    @GetMapping("/show")
    public List<User> showdata()
    {
        return ser.show();
    }
    @PostMapping("/check")
    public String checkStatus(@RequestParam String email,@RequestParam String pass)
    {
        return ser.checkDetails(email, pass);
    }

    @PostMapping("/{userId}/bookings/flight")
    public Booking bookFlightForUser(@PathVariable Long userId, @RequestBody Map<String,Object> request)
    {
        Long flightId=Long.valueOf(request.get("flightId").toString());
        return bookingService.createFlightBooking(flightId,userId).orElse(null);
    }

    @PostMapping("/{userId}/bookings/hotel")
    public Booking bookHotelForUser(@PathVariable Long userId,@RequestBody Map<String,Object> request)
    {
        Long hotelId=Long.valueOf(request.get("hotelId").toString());
        int nights=Integer.parseInt(request.get("nights").toString());
        return bookingService.createHotelBooking(hotelId,userId, nights).orElse(null);
    }


    @GetMapping("/{userId}/bookings")
    public List<Booking> getBookingForUser(@PathVariable Long userId)
    {
        return bookingService.getBookingByuserId(userId);
    }
    
}
