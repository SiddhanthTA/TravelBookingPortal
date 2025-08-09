package com.examly.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.*;
import java.util.List;
import java.util.Optional;

import com.examly.springapp.repository.BookingRepository;

@Service
public class AdminService {
    
    private final BookingRepository bookingRepository;

    private final BookingService bookingService;

    @Autowired
    public AdminService(BookingRepository bookingRepository,BookingService bookingService)
    {
        this.bookingRepository=bookingRepository;
        this.bookingService=bookingService;
    }


    public List<Booking> getAllBookings()
    {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long bookingId)
    {
        return bookingRepository.findById(bookingId);
    }

    public Optional<Booking> cancelBooking(Long bookingId)
    {
        return bookingService.cancelBooking(bookingId);
    }

    public Optional<Booking> createHotelBooking(Long hotelId, Long userId, int nights)
    {
        return bookingService.createHotelBooking(hotelId,userId, nights);
    }

    public Optional<Booking> createFlightBooking(Long flightId, Long userId)
    {
        return bookingService.createFlightBooking(flightId, userId);
    }
}
