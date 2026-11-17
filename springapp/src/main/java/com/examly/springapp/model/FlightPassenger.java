package com.examly.springapp.model;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "flight_passengers")
public class FlightPassenger {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(nullable = false)
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String email;
    private String phoneNumber;
    @Column(length = 500)
    private String address;
    private String passengerType;
    private String seatPreference;
    private String dietaryPreference;
}