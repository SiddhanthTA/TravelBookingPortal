package com.examly.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.examly.springapp.model.Hotel;
import com.examly.springapp.repository.HotelRepository;
import java.util.List;
import java.util.Optional;

@Service
public class HotelService {
    @Autowired private HotelRepository hotelRepository;
    public List<Hotel> getAllHotels(){return hotelRepository.findAll();}
    public List<Hotel> searchHotels(String location,Integer rating,Double price){return searchHotels(location,rating,price,null,null,null,null,null);}
    public List<Hotel> searchHotels(String location,Integer rating,Double price,Boolean wifi,Boolean breakfast,Boolean pool,Boolean gym,Boolean nearMainAreas){
        return hotelRepository.findAll().stream()
            .filter(h->location==null||location.isBlank()||contains(h.getName(),location)||contains(h.getLocation(),location)||contains(h.getAddress(),location))
            .filter(h->rating==null||h.getRating()>=rating).filter(h->price==null||h.getPricePerNight()<=price)
            .filter(h->wifi==null||!wifi||h.isWifi()).filter(h->breakfast==null||!breakfast||h.isBreakfastIncluded())
            .filter(h->pool==null||!pool||h.isSwimmingPool()).filter(h->gym==null||!gym||h.isGym())
            .filter(h->nearMainAreas==null||!nearMainAreas||h.isNearMainAreas())
            .sorted(java.util.Comparator.comparingInt(Hotel::getRating).reversed()).toList();
    }
    private boolean contains(String value,String query){return value!=null&&value.toLowerCase(java.util.Locale.ROOT).contains(query.trim().toLowerCase(java.util.Locale.ROOT));}
    public Hotel addHotel(Hotel hotel){validate(hotel);return hotelRepository.save(hotel);}
    public Optional<Hotel> getHotelById(Long id){return hotelRepository.findById(id);}
    public void deleteHotel(Long id){hotelRepository.deleteById(id);}
    public Hotel updateHotel(Long id,Hotel updatedHotel){
        validate(updatedHotel);
        return hotelRepository.findById(id).map(existing->{
            existing.setName(updatedHotel.getName().trim());existing.setLocation(updatedHotel.getLocation().trim());existing.setAddress(updatedHotel.getAddress().trim());
            existing.setRating(updatedHotel.getRating());existing.setPricePerNight(updatedHotel.getPricePerNight());existing.setAvailableRooms(updatedHotel.getAvailableRooms());
            existing.setHotelType(updatedHotel.getHotelType());existing.setWifi(updatedHotel.isWifi());existing.setBreakfastIncluded(updatedHotel.isBreakfastIncluded());
            existing.setSwimmingPool(updatedHotel.isSwimmingPool());existing.setGym(updatedHotel.isGym());existing.setNearMainAreas(updatedHotel.isNearMainAreas());existing.setImageUrl(updatedHotel.getImageUrl());
            return hotelRepository.save(existing);
        }).orElse(null);
    }
    private void validate(Hotel h){
        if(h==null)throw bad("Hotel details are required.");
        if(h.getName()==null||h.getName().trim().length()<2||h.getName().trim().length()>100)throw bad("Hotel name must be 2–100 characters.");
        if(h.getLocation()==null||h.getLocation().trim().length()<2||h.getLocation().trim().length()>80)throw bad("Location must be 2–80 characters.");
        if(h.getAddress()==null||h.getAddress().trim().length()<5||h.getAddress().trim().length()>255)throw bad("Address must be 5–255 characters.");
        if(h.getRating()<1||h.getRating()>5)throw bad("Hotel rating must be between 1 and 5.");
        if(!Double.isFinite(h.getPricePerNight())||h.getPricePerNight()<=0)throw bad("Price per night must be greater than zero.");
        if(h.getAvailableRooms()<0||h.getAvailableRooms()>10000)throw bad("Available rooms must be between 0 and 10,000.");
        if(h.getImageUrl()!=null&&!h.getImageUrl().isBlank()&&!h.getImageUrl().matches("(?i)^https?://.+"))throw bad("Image URL must start with http:// or https://.");
    }
    private ResponseStatusException bad(String message){return new ResponseStatusException(HttpStatus.BAD_REQUEST,message);}
}