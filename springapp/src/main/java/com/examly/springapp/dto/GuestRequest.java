package com.examly.springapp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GuestRequest {
    @NotBlank
    private String fullName;
    private String gender;
    private String email;
    private String phoneNumber;
    private String address;
    private Integer roomNumber;
}