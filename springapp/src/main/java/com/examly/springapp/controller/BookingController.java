package com.examly.springapp.controller;

import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;

import com.examly.springapp.dto.FlightCheckoutRequest;
import com.examly.springapp.dto.HotelCheckoutRequest;
import com.examly.springapp.dto.PaymentRequest;
import com.examly.springapp.model.Booking;
import com.examly.springapp.service.BookingService;
import com.examly.springapp.repository.UserRepo;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @Autowired
    private BookingService bookingService;
    @Autowired private UserRepo userRepo;

    private Long authenticatedUserId(Authentication authentication) {
        return userRepo.findOptionalByEmail(authentication.getName()).orElseThrow().getId();
    }

    @PostMapping("/flight/checkout")
    public ResponseEntity<Booking> createFlightCheckout(@Valid @RequestBody FlightCheckoutRequest request, Authentication authentication) {
        request.setUserId(authenticatedUserId(authentication));
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createFlightCheckout(request));
    }

    @PostMapping("/hotel/checkout")
    public ResponseEntity<Booking> createHotelCheckout(@Valid @RequestBody HotelCheckoutRequest request, Authentication authentication) {
        request.setUserId(authenticatedUserId(authentication));
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createHotelCheckout(request));
    }

    @PreAuthorize("@bookingAccess.isOwnerOrAdmin(#bookingId, authentication)")
    @PostMapping("/{bookingId}/pay")
    public ResponseEntity<Booking> simulatePayment(
            @PathVariable Long bookingId,
            @Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(bookingService.simulatePayment(bookingId, request.getPaymentMethod()));
    }

    // Legacy endpoints retained while the React client migrates to the checkout flow.
    @PostMapping("/flight")
    public Booking bookFlight(@RequestBody Map<String, Object> request, Authentication authentication) {
        Long flightId = Long.valueOf(request.get("flightId").toString());
        Long userId = authenticatedUserId(authentication);
        return bookingService.createFlightBooking(flightId, userId).orElse(null);
    }

    @PostMapping("/hotel")
    public Booking bookHotel(@RequestBody Map<String, Object> request, Authentication authentication) {
        Long hotelId = Long.valueOf(request.get("hotelId").toString());
        Long userId = Long.valueOf(request.get("userId").toString());
        int nights = Integer.parseInt(request.get("nights").toString());
        return bookingService.createHotelBooking(hotelId, userId, nights).orElse(null);
    }

    @GetMapping
    public List<Booking> getAllBooking() {
        return bookingService.getAllBookings();
    }

    @PreAuthorize("@bookingAccess.isOwnerOrAdmin(#id, authentication)")
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("@bookingAccess.isOwnerOrAdmin(#id, authentication)")
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id) {
        return bookingService.cancelBooking(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.CONFLICT).build());
    }
}
