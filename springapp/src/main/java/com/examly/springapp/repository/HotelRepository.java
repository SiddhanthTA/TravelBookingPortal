package com.examly.springapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examly.springapp.model.Hotel;

public interface HotelRepository extends JpaRepository<Hotel,Long>
{
    List<Hotel> findByLocation(String location);
    List<Hotel> findByRatingGreaterThanEqual(int rating);
    List<Hotel> findByPricePerNightLessThanEqual(double price);
    List<Hotel> findByLocationAndRatingGreaterThanEqualAndPricePerNightLessThanEqual(String location,Integer rating, Double price);
    List<Hotel> findByLocationAndRatingGreaterThanEqual(String location,Integer rating);
    List<Hotel> findByLocationAndPricePerNightLessThanEqual(String location,Double price);
    List<Hotel> findByRatingGreaterThanEqualAndPricePerNightLessThanEqual(Integer rating,Double price);
}