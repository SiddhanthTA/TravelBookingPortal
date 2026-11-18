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

public class HotelController {
    @Autowired
    private HotelService hotelService;

    @GetMapping
    public List<Hotel> getAllHotels()
    {
        return hotelService.getAllHotels();
    } 

    @GetMapping("/search")
    public List<Hotel> searchHotels(@RequestParam(required = false) String location,
            @RequestParam(required=false) Integer rating, @RequestParam(required=false) Double price,
            @RequestParam(required=false) Boolean wifi, @RequestParam(required=false) Boolean breakfast,
            @RequestParam(required=false) Boolean pool, @RequestParam(required=false) Boolean gym,
            @RequestParam(required=false) Boolean nearMainAreas) {
        return hotelService.searchHotels(location, rating, price, wifi, breakfast, pool, gym, nearMainAreas);
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

    @DeleteMapping("/{id}")
    public void deleteHotel(@PathVariable Long id)
    {
        hotelService.deleteHotel(id);
    }
}
