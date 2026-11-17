package com.examly.springapp.dto;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FlightCheckoutRequest {
    @NotNull
    private Long userId;
    @NotNull
    private Long flightId;
    private String bookingFor = "ME";
    private String contactEmail;
    private String contactPhone;
    @NotEmpty
    @Valid
    private List<PassengerRequest> passengers;
}