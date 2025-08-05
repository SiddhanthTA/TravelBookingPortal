package com.examly.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;
// import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.service.HotelService;
import com.examly.springapp.model.*;
import java.util.*;

@RestController
@RequestMapping("/hotels")
@CrossOrigin(origins="*")
public class HotelController {
    @Autowired
    private HotelService hotelService;

    @GetMapping
    public List<Hotel> getAllHotels()
    {
        return hotelService.getAllHotels();
    } 

    @PostMapping
    public Hotel addHotel(@RequestBody Hotel hotel)
    {
        return hotelService.addHotel(hotel);
    }

    @GetMapping("/{id}")
    public Hotel getHotelById(@PathVariable Long id)
    {
        return hotelService.getHotelById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Hotel updateHotel(@PathVariable Long id,@RequestBody Hotel hotel)
    {
        return hotelService.updateHotel(id,hotel);
    }
}
