package com.examly.springapp.dto;

import java.time.LocalDate;
import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HotelCheckoutRequest {
    @NotNull
    private Long userId;
    @NotNull
    private Long hotelId;
    @NotNull
    private LocalDate checkInDate;
    @NotNull
    private LocalDate checkOutDate;
    @Min(1)
    private int rooms = 1;
    private String bookingFor = "ME";
    @NotEmpty
    @Valid
    private List<GuestRequest> guests;
}