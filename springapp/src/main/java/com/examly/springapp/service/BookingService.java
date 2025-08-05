package com.examly.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.Booking;
import com.examly.springapp.model.*;
import com.examly.springapp.repository.BookingRepository;
import com.examly.springapp.repository.FlightRepository;
import com.examly.springapp.repository.HotelRepository;

import java.time.LocalDateTime;
import java.util.*;


@Service
public class BookingService {
    

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    public Optional<Booking> createFlightBooking(Long FlightId,Long userId)
    {
        Optional<Flight> flightOpt=flightRepository.findById(FlightId);
        if(flightOpt.isPresent())
        {
            Flight flight=flightOpt.get();
            if(flight.getAvailableSeats()>0)
            {
                flight.setAvailableSeats(flight.getAvailableSeats()-1);
                flightRepository.save(flight);


                Booking booking=new Booking();
                booking.setBookingType("FLIGHT");
                booking.setFlightId(FlightId);
                booking.setUserId(userId);
                booking.setBookingReference("FL-"+UUID.randomUUID().toString().substring(0,6));
                booking.setBookingDate(LocalDateTime.now());
                booking.setTotalPrice(flight.getPrice());
                booking.setStatus("CONFIRMED");
                return Optional.of(bookingRepository.save(booking));
            }
        }
        return Optional.empty();
    }
    public Optional<Booking> createHotelBooking(Long hotelId,Long userId,int nights)
    {
        Optional<Hotel> hotelOpt=hotelRepository.findById(hotelId);
        if(hotelOpt.isPresent())
        {
            Hotel hotel=hotelOpt.get();
            if(hotel.getAvailableRooms()>0)
            {
                hotel.setAvailableRooms(hotel.getAvailableRooms()-1);
                hotelRepository.save(hotel);


                Booking booking=new Booking();
                booking.setBookingType("HOTEL");
                booking.setFlightId(hotelId);
                booking.setUserId(userId);
                booking.setBookingReference("HT-"+UUID.randomUUID().toString().substring(0,6));
                booking.setBookingDate(LocalDateTime.now());
                booking.setTotalPrice(hotel.getPricePerNight()*nights);
                booking.setStatus("CONFIRMED");
                return Optional.of(bookingRepository.save(booking));
            }
        }
        return Optional.empty();
    }
    
   

    public List<Booking> getAllBookings()
    {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id)
    {
        return bookingRepository.findById(id);   
    }

    public Optional<Booking> cancelBooking(Long id)
    {
        Optional<Booking> bookingOpt=bookingRepository.findById(id);
        if(bookingOpt.isPresent())
        {
            Booking booking=bookingOpt.get();
            if(!booking.getStatus().equals("CANCELLED"))
            {
                booking.setStatus("CANCELLED");
                
                if(booking.getBookingType().equals("FLIGHT"))
                {
                    flightRepository.findById(booking.getFlightId()).ifPresent(flight->
                    {
                        flight.setAvailableSeats(flight.getAvailableSeats()+1);
                        flightRepository.save(flight);
                    });
                }
            
            else if(booking.getBookingType().equals("HOTEL"))
            {
                hotelRepository.findById(booking.getFlightId()).ifPresent(hotel-> {
                    hotel.setAvailableRooms(hotel.getAvailableRooms()+1);
                    hotelRepository.save(hotel);
                });
            }
            return Optional.of(bookingRepository.save(booking));
            }
            return Optional.empty();
        
        }
        return Optional.empty();
    }
}
