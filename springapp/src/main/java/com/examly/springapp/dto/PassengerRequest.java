package com.examly.springapp.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PassengerRequest {
    @NotBlank
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String email;
    private String phoneNumber;
    private String passengerType = "ADULT";
}