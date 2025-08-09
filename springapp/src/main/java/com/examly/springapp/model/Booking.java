package com.examly.springapp.model;

import jakarta.persistence.Entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Booking {
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bookingType;
    private String bookingReference;
    private Long userId;
    private Long flightId;
    private Long hotelId;
    private LocalDateTime bookingDate;
    private double totalPrice;
    private String status;
    private int nights;

    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name="userId",insertable=false,updatable=false)
    // @JsonInclude(JsonInclude.Include.NON_NULL)
    // private User user;  

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @ManyToOne
    @JoinColumn(name = "flightId",insertable = false, updatable=false)
    private Flight flight;


    @JsonInclude(JsonInclude.Include.NON_NULL)
    @ManyToOne
    @JoinColumn(name="hotelId",insertable=false,updatable=false)
    private Hotel hotel;
}
