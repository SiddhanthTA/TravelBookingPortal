package com.examly.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.examly.springapp.dto.ChangePasswordDTO;
import com.examly.springapp.dto.LoginRequest;
import jakarta.validation.Valid;
import com.examly.springapp.dto.UpdateUserDTO;
import com.examly.springapp.model.Booking;
import com.examly.springapp.model.User;
import com.examly.springapp.service.BookingService;
import com.examly.springapp.service.UserService;
import java.util.*;

// import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@Tag(name = "User registration & Authentication")
@RequestMapping("/Auth")
public class UsermodelController {

    @Autowired
    UserService ser;

    @Autowired
    private BookingService bookingService;

    @PostMapping("/register")
    public String insertData(@RequestBody User data) {
        data.setRole(User.Role.CUSTOMER);
        return ser.register(data);
    }

    @GetMapping("/show")
    public List<User> showdata() {
        return ser.show();
    }

    @PostMapping("/check")
    public Map<String, Object> checkStatus(@Valid @RequestBody LoginRequest request) {
        return ser.checkDetails(request.getEmail(), request.getPassword());
    }

    @PostMapping("/{userId}/bookings/flight")
    public Booking bookFlightForUser(@PathVariable Long userId, @RequestBody Map<String, Object> request) {
        Long flightId = Long.valueOf(request.get("flightId").toString());
        return bookingService.createFlightBooking(flightId, userId).orElse(null);
    }

    @PostMapping("/{userId}/bookings/hotel")
    public Booking bookHotelForUser(@PathVariable Long userId, @RequestBody Map<String, Object> request) {
        Long hotelId = Long.valueOf(request.get("hotelId").toString());
        int nights = Integer.parseInt(request.get("nights").toString());
        return bookingService.createHotelBooking(hotelId, userId, nights).orElse(null);
    }

    @GetMapping("/{userId}/bookings")
    public List<Booking> getBookingForUser(@PathVariable Long userId) {
        return bookingService.getBookingByuserId(userId);
    }

    @PostMapping("/adminRegistration")
    public String insertAdmin(@RequestBody User data) {
        data.setRole(User.Role.ADMIN);
        return ser.register(data);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        boolean deleted = ser.deleteUser(id);
        return deleted ? "User deleted successfully " : "User not found";
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = ser.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));
        return ResponseEntity.ok(user);
    }

    // Update user profile
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateUserDTO dto) {
        try {
            User updatedUser = ser.updateUser(id, dto);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<String> changePassword(
            @PathVariable Long id,
            @RequestBody ChangePasswordDTO dto) {
        ser.changePassword(id, dto.getOldPassword(), dto.getNewPassword());
        return ResponseEntity.ok("Password updated successfully");
    }

}
