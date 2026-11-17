package com.examly.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.examly.springapp.dto.UpdateUserDTO;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    PasswordEncoder encoder;

    @Autowired
    UserRepo repo;

    public String register(User value) {
        if (value == null || value.getEmail() == null || value.getEmail().isBlank()
                || value.getPassword() == null || value.getPassword().isBlank()) {
            return "Invalid data";
        }
        if (repo.existsByEmail(value.getEmail().trim())) {
            return "Email already exists!";
        }
        if (value.getRole() == null) {
            value.setRole(User.Role.CUSTOMER);
        }
        value.setEmail(value.getEmail().trim().toLowerCase());
        value.setPassword(encoder.encode(value.getPassword()));
        repo.save(value);
        return "User Registered";
    }

    public List<User> show() {
        // User.password is WRITE_ONLY for JSON serialization.
        return repo.findAll();
    }

    public Map<String, Object> checkDetails(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        User user = (email == null || password == null) ? null : repo.findByEmail(email.trim());

        if (user != null && encoder.matches(password, user.getPassword())) {
            response.put("status", "success");
            response.put("message", "Logged in successfully");
            response.put("role", user.getRole().name());
            response.put("id", user.getId());
        } else {
            response.put("status", "failure");
            response.put("message", "Wrong email or password");
            response.put("role", "");
        }
        return response;
    }

    public Optional<User> findById(Long id) {
        return repo.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return repo.findOptionalByEmail(email);
    }

    public boolean deleteUser(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }

    public User updateUser(Long id, UpdateUserDTO dto) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            String normalizedEmail = dto.getEmail().trim().toLowerCase();
            User existing = repo.findByEmail(normalizedEmail);
            if (existing != null && !existing.getId().equals(id)) {
                throw new RuntimeException("That email address is already in use");
            }
            user.setEmail(normalizedEmail);
        }

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPhoneNumber() != null) user.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getProfileImageUrl() != null) user.setProfileImageUrl(dto.getProfileImageUrl());
        if (dto.getDateOfBirth() != null) user.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getGender() != null) user.setGender(dto.getGender());
        if (dto.getHometown() != null) user.setHometown(dto.getHometown());
        if (dto.getAddressLine1() != null) user.setAddressLine1(dto.getAddressLine1());
        if (dto.getAddressLine2() != null) user.setAddressLine2(dto.getAddressLine2());
        if (dto.getCity() != null) user.setCity(dto.getCity());
        if (dto.getState() != null) user.setState(dto.getState());
        if (dto.getCountry() != null) user.setCountry(dto.getCountry());
        if (dto.getPostalCode() != null) user.setPostalCode(dto.getPostalCode());
        if (dto.getPreferredTravelClass() != null) user.setPreferredTravelClass(dto.getPreferredTravelClass());
        if (dto.getPreferredSeat() != null) user.setPreferredSeat(dto.getPreferredSeat());
        if (dto.getPreferredHotelCategory() != null) user.setPreferredHotelCategory(dto.getPreferredHotelCategory());
        if (dto.getDietaryPreference() != null) user.setDietaryPreference(dto.getDietaryPreference());
        if (dto.getPreferredCurrency() != null) user.setPreferredCurrency(dto.getPreferredCurrency());

        return repo.save(user);
    }

    public void changePassword(Long id, String oldPassword, String newPassword) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (oldPassword == null || !encoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }
        if (newPassword == null || newPassword.length() < 8) {
            throw new RuntimeException("New password must contain at least 8 characters");
        }

        user.setPassword(encoder.encode(newPassword));
        repo.save(user);
    }
}
