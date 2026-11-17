package com.examly.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.examly.springapp.dto.UpdateUserDTO;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepo;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class UserService {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Z0-9._%+-]+@(gmail|yahoo)\\.com$", Pattern.CASE_INSENSITIVE);
    private static final Pattern PHONE_PATTERN = Pattern.compile("^[6-9][0-9]{9}$");
    private static final Pattern POSTAL_PATTERN = Pattern.compile("^[0-9]{6}$");
    private static final Pattern NAME_PATTERN = Pattern.compile("^[\\p{L}][\\p{L} .'-]*$");

    @Autowired PasswordEncoder encoder;
    @Autowired UserRepo repo;

    public String register(User value) {
        if (value == null || value.getEmail() == null || value.getEmail().isBlank()
                || value.getPassword() == null || value.getPassword().isBlank()) return "Invalid data";
        if (repo.existsByEmail(value.getEmail().trim())) return "Email already exists!";
        if (value.getRole() == null) value.setRole(User.Role.CUSTOMER);
        value.setEmail(value.getEmail().trim().toLowerCase());
        value.setPassword(encoder.encode(value.getPassword()));
        repo.save(value);
        return "User Registered";
    }

    public List<User> show() { return repo.findAll(); }

    public Map<String, Object> checkDetails(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        User user = (email == null || password == null) ? null : repo.findByEmail(email.trim());
        if (user != null && encoder.matches(password, user.getPassword())) {
            response.put("status", "success"); response.put("message", "Logged in successfully");
            response.put("role", user.getRole().name()); response.put("id", user.getId());
        } else {
            response.put("status", "failure"); response.put("message", "Wrong email or password"); response.put("role", "");
        }
        return response;
    }

    public Optional<User> findById(Long id) { return repo.findById(id); }
    public Optional<User> findByEmail(String email) { return repo.findOptionalByEmail(email); }
    public boolean deleteUser(Long id) {
        if (!repo.existsById(id)) return false;
        repo.deleteById(id); return true;
    }

    public User updateUser(Long id, UpdateUserDTO dto) {
        User user = repo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        if (dto.getName() == null || !NAME_PATTERN.matcher(dto.getName().trim()).matches()
                || dto.getName().trim().length() < 2 || dto.getName().trim().length() > 80)
            throw new IllegalArgumentException("Full name must contain 2–80 valid characters.");
        if (dto.getEmail() == null || dto.getEmail().trim().length() < 6 || dto.getEmail().trim().length() > 254
                || !EMAIL_PATTERN.matcher(dto.getEmail().trim()).matches())
            throw new IllegalArgumentException("Use a valid Gmail or Yahoo email address.");
        String normalizedEmail = dto.getEmail().trim().toLowerCase();
        User existing = repo.findByEmail(normalizedEmail);
        if (existing != null && !existing.getId().equals(id))
            throw new IllegalArgumentException("That email address is already in use.");
        if (dto.getPhoneNumber() == null || !PHONE_PATTERN.matcher(dto.getPhoneNumber()).matches())
            throw new IllegalArgumentException("Enter a valid 10-digit Indian mobile number starting with 6–9.");
        if (dto.getDateOfBirth() != null) {
            LocalDate today = LocalDate.now();
            if (dto.getDateOfBirth().isAfter(today) || dto.getDateOfBirth().isBefore(today.minusYears(100)))
                throw new IllegalArgumentException("Date of birth must be within the last 100 years and cannot be in the future.");
        }
        if (dto.getPostalCode() != null && !dto.getPostalCode().isBlank()
                && !POSTAL_PATTERN.matcher(dto.getPostalCode()).matches())
            throw new IllegalArgumentException("Postal code must contain exactly 6 digits.");
        if (dto.getGender() != null && !dto.getGender().isBlank()
                && !List.of("Female", "Male", "Non-binary", "Prefer not to say").contains(dto.getGender()))
            throw new IllegalArgumentException("Choose a valid gender option.");
        if (dto.getCity() != null && !dto.getCity().isBlank()
                && (dto.getState() == null || dto.getState().isBlank()))
            throw new IllegalArgumentException("Select a state before entering a city.");
        if (dto.getAddressLine1() != null && dto.getAddressLine1().length() > 255)
            throw new IllegalArgumentException("Address line 1 must be 255 characters or fewer.");
        if (dto.getAddressLine2() != null && dto.getAddressLine2().length() > 255)
            throw new IllegalArgumentException("Address line 2 must be 255 characters or fewer.");

        user.setName(dto.getName().trim());
        user.setEmail(normalizedEmail);
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setDateOfBirth(dto.getDateOfBirth());
        user.setGender(dto.getGender());
        user.setAddressLine1(dto.getAddressLine1());
        user.setAddressLine2(dto.getAddressLine2());
        user.setState(dto.getState());
        user.setCity(dto.getCity());
        user.setCountry("India");
        user.setPostalCode(dto.getPostalCode());
        user.setPreferredTravelClass(dto.getPreferredTravelClass());
        user.setPreferredSeat(dto.getPreferredSeat());
        user.setPreferredHotelCategory(dto.getPreferredHotelCategory());
        user.setDietaryPreference(dto.getDietaryPreference());
        if (dto.getProfileImageUrl() != null) user.setProfileImageUrl(dto.getProfileImageUrl());
        return repo.save(user);
    }

    public User updateProfileImage(Long id, String imageUrl) {
        User user = repo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setProfileImageUrl(imageUrl);
        return repo.save(user);
    }

    public void changePassword(Long id, String oldPassword, String newPassword) {
        User user = repo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        if (oldPassword == null || !encoder.matches(oldPassword, user.getPassword()))
            throw new RuntimeException("Old password is incorrect");
        if (newPassword == null || newPassword.length() < 8)
            throw new RuntimeException("New password must contain at least 8 characters");
        user.setPassword(encoder.encode(newPassword)); repo.save(user);
    }
}
