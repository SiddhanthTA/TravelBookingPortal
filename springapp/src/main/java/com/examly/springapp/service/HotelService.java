package com.examly.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.Hotel;
import com.examly.springapp.repository.HotelRepository;

import java.util.List;
import java.util.Optional;

@Service
public class HotelService {
    @Autowired
    private HotelRepository hotelRepository;

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public List<Hotel> searchHotels(String location, Integer rating, Double price) {
        return searchHotels(location, rating, price, null, null, null, null, null);
    }

    public List<Hotel> searchHotels(String location, Integer rating, Double price,
            Boolean wifi, Boolean breakfast, Boolean pool, Boolean gym, Boolean nearMainAreas) {
        return hotelRepository.findAll().stream()
                .filter(h -> location == null || location.isBlank()
                        || contains(h.getName(), location) || contains(h.getLocation(), location)
                        || contains(h.getAddress(), location))
                .filter(h -> rating == null || h.getRating() >= rating)
                .filter(h -> price == null || h.getPricePerNight() <= price)
                .filter(h -> wifi == null || !wifi || h.isWifi())
                .filter(h -> breakfast == null || !breakfast || h.isBreakfastIncluded())
                .filter(h -> pool == null || !pool || h.isSwimmingPool())
                .filter(h -> gym == null || !gym || h.isGym())
                .filter(h -> nearMainAreas == null || !nearMainAreas || h.isNearMainAreas())
                .sorted(java.util.Comparator.comparingInt(Hotel::getRating).reversed())
                .toList();
    }

    private boolean contains(String value, String query) {
        return value != null && value.toLowerCase(java.util.Locale.ROOT)
                .contains(query.trim().toLowerCase(java.util.Locale.ROOT));
    }

    public Hotel addHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    public Optional<Hotel> getHotelById(Long id) {
        return hotelRepository.findById(id);
    }

    public void deleteHotel(Long id) {
        hotelRepository.deleteById(id);
    }

    public Hotel updateHotel(Long id, Hotel updatedHotel) {
        return hotelRepository.findById(id).map(existing -> {
            existing.setName(updatedHotel.getName());
            existing.setLocation(updatedHotel.getLocation());
            existing.setAddress(updatedHotel.getAddress());
            existing.setRating(updatedHotel.getRating());
            existing.setPricePerNight(updatedHotel.getPricePerNight());
            existing.setAvailableRooms(updatedHotel.getAvailableRooms());
            existing.setHotelType(updatedHotel.getHotelType());
            existing.setWifi(updatedHotel.isWifi());
            existing.setBreakfastIncluded(updatedHotel.isBreakfastIncluded());
            existing.setSwimmingPool(updatedHotel.isSwimmingPool());
            existing.setGym(updatedHotel.isGym());
            existing.setNearMainAreas(updatedHotel.isNearMainAreas());
            existing.setImageUrl(updatedHotel.getImageUrl());
            return hotelRepository.save(existing);
        }).orElse(null);
    }
}
