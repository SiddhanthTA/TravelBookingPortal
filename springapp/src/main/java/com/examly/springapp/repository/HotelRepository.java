package com.examly.springapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examly.springapp.model.Hotel;

public interface HotelRepository extends JpaRepository<Hotel,Long>
{
    List<Hotel> findByLocation(String location);
    List<Hotel> findByRatingGreaterThanEqual(int rating);
    List<Hotel> findByPricePerNightLessThanEqual(double price);

}