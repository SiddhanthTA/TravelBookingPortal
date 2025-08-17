package com.examly.springapp.config;

import com.examly.springapp.model.Flight;
import com.examly.springapp.model.Hotel;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.FlightRepository;
import com.examly.springapp.repository.HotelRepository;
import com.examly.springapp.repository.UserRepo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

        private final FlightRepository flightRepository;
        private final HotelRepository hotelRepository;
        private final UserRepo userRepo;
        private final PasswordEncoder passwordEncoder;

        public DataInitializer(FlightRepository flightRepository, HotelRepository hotelRepository, UserRepo userRepo,
                        PasswordEncoder passwordEncoder) {
                this.flightRepository = flightRepository;
                this.hotelRepository = hotelRepository;
                this.userRepo = userRepo;
                this.passwordEncoder = passwordEncoder;
        }

        @Override
        public void run(String... args) {
                if (flightRepository.count() == 0) {
                        flightRepository.saveAll(Arrays.asList(
                                        new Flight(0, "AI101", "Air India", "Delhi", "Mumbai",
                                                        LocalDateTime.now().plusDays(1),
                                                        LocalDateTime.now().plusDays(1).plusHours(2), 5000, 100),
                                        new Flight(0, "6E202", "IndiGo", "Bangalore", "Hyderabad",
                                                        LocalDateTime.now().plusDays(1),
                                                        LocalDateTime.now().plusDays(1).plusHours(1), 3000, 80),
                                        new Flight(0, "SG303", "SpiceJet", "Chennai", "Kolkata",
                                                        LocalDateTime.now().plusDays(2),
                                                        LocalDateTime.now().plusDays(2).plusHours(3), 4500, 120),
                                        new Flight(0, "UK404", "Vistara", "Pune", "Delhi",
                                                        LocalDateTime.now().plusDays(3),
                                                        LocalDateTime.now().plusDays(3).plusHours(2), 5500, 90),
                                        new Flight(0, "G8505", "GoAir", "Mumbai", "Goa",
                                                        LocalDateTime.now().plusDays(1),
                                                        LocalDateTime.now().plusDays(1).plusHours(1), 2500, 70)));
                }

                if (hotelRepository.count() == 0) {
                        hotelRepository.saveAll(Arrays.asList(
                                        new Hotel(null, "The Grand", "Mumbai", "123 Marine Drive", 5, 8000, 50),
                                        new Hotel(null, "Palm Resort", "Goa", "456 Beach Road", 4, 5000, 30),
                                        new Hotel(null, "City Inn", "Delhi", "789 Connaught Place", 3, 3000, 70),
                                        new Hotel(null, "Lakeview Hotel", "Udaipur", "321 Lake Road", 5, 9000, 20),
                                        new Hotel(null, "Mountain Retreat", "Manali", "654 Hilltop", 4, 6000, 25)));
                }

                if (!userRepo.existsByEmail("admin1@gmail.com")) {
                        User admin1 = User.builder()
                                        .name("Admin One")
                                        .email("admin1@gmail.com")
                                        .password(passwordEncoder.encode("admin"))
                                        .role(User.Role.ADMIN)
                                        .build();
                        userRepo.save(admin1);
                }

                if (!userRepo.existsByEmail("admin2@gmail.com"))
                {
                        User admin2 = User.builder()
                                        .name("Admin Two")
                                        .email("admin2@gmail.com")
                                        .password(passwordEncoder.encode("admin"))
                                        .role(User.Role.ADMIN)
                                        .build();
                        userRepo.save(admin2);
                }

                if (!userRepo.existsByEmail("admin3@gmail.com")) {
                        User admin3 = User.builder()
                                        .name("Admin Three")
                                        .email("admin3@gmail.com")
                                        .password(passwordEncoder.encode("admin"))
                                        .role(User.Role.ADMIN)
                                        .build();
                        userRepo.save(admin3);
                }

        }

}
