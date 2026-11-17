package com.examly.springapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Hotel {

    public Hotel(Long id, String name, String location, String address, int rating, double pricePerNight, int availableRooms) {
        this.id = id; this.name = name; this.location = location; this.address = address;
        this.rating = rating; this.pricePerNight = pricePerNight; this.availableRooms = availableRooms;
    }

    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;
    private String address;
    private int rating;
    private double pricePerNight;
    private int availableRooms;
    private String hotelType;
    private boolean wifi;
    private boolean breakfastIncluded;
    private boolean swimmingPool;
    private boolean gym;
    private boolean nearMainAreas;
    @Column(length = 1000)
    private String imageUrl;
}
