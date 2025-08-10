package com.examly.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.Hotel;
import java.util.*;
import com.examly.springapp.repository.HotelRepository;

@Service
public class HotelService {
    

    @Autowired
    private HotelRepository hotelRepository;

    public List<Hotel> getAllHotels()
    {
        return hotelRepository.findAll();
    }

    public List<Hotel> searchHotels(String location,Integer rating,Double price)
    {
        if(location!=null && rating!=null && price!=null)
        {
            return hotelRepository.findByLocationAndRatingGreaterThanEqualAndPricePerNightLessThanEqual(location, rating, price);
        }
        else if(location!=null && rating!=null)
        {
            return hotelRepository.findByLocationAndRatingGreaterThanEqual(location, rating);
        }
        else if(location!=null && price!=null)
        {
            return hotelRepository.findByRatingGreaterThanEqualAndPricePerNightLessThanEqual(rating, price);
        }
        else if(location!=null)
        {
            return hotelRepository.findByLocation(location);
        }
        else if(rating!=null)
        {
            return hotelRepository.findByRatingGreaterThanEqual(rating);
        }
        else if(price!=null)
        {
            return hotelRepository.findByPricePerNightLessThanEqual(price);
        }
        else  
        {
            return hotelRepository.findAll();
        }
    }


    public Hotel addHotel(Hotel hotel)
    {
        return hotelRepository.save(hotel);
    }

    public Optional<Hotel> getHotelById(Long id)
    {
        return hotelRepository.findById(id);
    }

    public void deleteHotel(Long id)
    {
        hotelRepository.deleteById(id);
    }

    public Hotel updateHotel(Long id,Hotel updatedHotel)
    {
        return hotelRepository.findById(id).map(existing->
        {
            existing.setName(updatedHotel.getName());
            existing.setLocation(updatedHotel.getLocation());
            existing.setAddress(updatedHotel.getAddress());
            existing.setPricePerNight(updatedHotel.getPricePerNight());
            existing.setAvailableRooms(updatedHotel.getAvailableRooms());
            return hotelRepository.save(existing);
        }).orElse(null);
    }

}
