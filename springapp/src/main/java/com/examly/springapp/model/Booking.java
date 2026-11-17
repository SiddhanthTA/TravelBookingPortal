package com.examly.springapp.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bookings")
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

    // Account holder and traveler/guest are deliberately separate.
    private String bookingFor;
    private String paymentStatus;
    private LocalDate departureDate;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int rooms;
    private int passengerCount;
    private int guestCount;
    private String primaryGuestName;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private double accommodationPrice;
    private double facilityCharges;
    @Column(length = 2000)
    private String facilityDetails;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @ManyToOne
    @JoinColumn(name = "flightId", insertable = false, updatable = false)
    private Flight flight;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @ManyToOne
    @JoinColumn(name = "hotelId", insertable = false, updatable = false)
    private Hotel hotel;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FlightPassenger> passengers = new ArrayList<>();

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HotelGuest> guests = new ArrayList<>();
}
