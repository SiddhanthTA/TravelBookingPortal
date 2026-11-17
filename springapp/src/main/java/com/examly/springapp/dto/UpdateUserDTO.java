package com.examly.springapp.dto;

import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserDTO {
    private String name;
    private String email;
    private String phoneNumber;
    private String profileImageUrl;
    private LocalDate dateOfBirth;
    private String gender;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String preferredTravelClass;
    private String preferredSeat;
    private String preferredHotelCategory;
    private String dietaryPreference;
}
