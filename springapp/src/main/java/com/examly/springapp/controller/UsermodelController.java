package com.examly.springapp.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.tags.Tag;
import com.examly.springapp.dto.ChangePasswordDTO;
import com.examly.springapp.dto.LoginRequest;
import jakarta.validation.Valid;
import com.examly.springapp.dto.UpdateUserDTO;
import com.examly.springapp.model.Booking;
import com.examly.springapp.model.User;
import com.examly.springapp.service.BookingService;
import com.examly.springapp.service.UserService;

@RestController
@Tag(name = "User registration & Authentication")
@RequestMapping("/Auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
public class UsermodelController {
    @Autowired UserService ser;
    @Autowired private BookingService bookingService;

    @Value("${app.upload-dir:uploads}")
    private String uploadDirectory;

    @PostMapping("/register")
    public String insertData(@RequestBody User data) {
        data.setRole(User.Role.CUSTOMER);
        return ser.register(data);
    }

    @GetMapping("/show")
    public List<User> showdata() { return ser.show(); }

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
        return deleted ? "User deleted successfully" : "User not found";
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = ser.findById(id).orElseThrow(() -> new RuntimeException("User not found with id " + id));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateUserDTO dto) {
        try {
            return ResponseEntity.ok(ser.updateUser(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(value = "/{id}/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadProfileImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) return ResponseEntity.badRequest().body("Choose an image to upload.");
            if (file.getSize() > 5L * 1024 * 1024) return ResponseEntity.badRequest().body("Image must be 5 MB or smaller.");

            String extension;
            String contentType = file.getContentType();
            if ("image/jpeg".equalsIgnoreCase(contentType)) extension = ".jpg";
            else if ("image/png".equalsIgnoreCase(contentType)) extension = ".png";
            else if ("image/webp".equalsIgnoreCase(contentType)) extension = ".webp";
            else return ResponseEntity.badRequest().body("Only JPG, PNG and WEBP images are accepted.");

            Path directory = Path.of(uploadDirectory, "profile-images").toAbsolutePath().normalize();
            Files.createDirectories(directory);
            String filename = UUID.randomUUID() + extension;
            Files.copy(file.getInputStream(), directory.resolve(filename));
            String imageUrl = "/uploads/profile-images/" + filename;
            ser.updateProfileImage(id, imageUrl);
            return ResponseEntity.ok(Map.of("profileImageUrl", imageUrl));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to store the profile picture.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<String> changePassword(@PathVariable Long id, @RequestBody ChangePasswordDTO dto) {
        ser.changePassword(id, dto.getOldPassword(), dto.getNewPassword());
        return ResponseEntity.ok("Password updated successfully");
    }
}
