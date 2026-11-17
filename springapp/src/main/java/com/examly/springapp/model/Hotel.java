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
