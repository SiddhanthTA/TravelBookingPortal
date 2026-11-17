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
                                        new Flight(0, "6E202", "IndiGo", "Bengaluru", "Hyderabad",
                                                        LocalDateTime.now().plusDays(1),
                                                        LocalDateTime.now().plusDays(1).plusHours(1), 3000, 80),
                                        new Flight(0, "SG303", "SpiceJet", "Chennai", "Kolkata",
                                                        LocalDateTime.now().plusDays(2),
                                                        LocalDateTime.now().plusDays(2).plusHours(3), 4500, 120),
                                        new Flight(0, "AI404", "Air India", "Pune", "Delhi",
                                                        LocalDateTime.now().plusDays(3),
                                                        LocalDateTime.now().plusDays(3).plusHours(2), 5500, 90),
                                        new Flight(0, "QP505", "Akasa Air", "Mumbai", "Goa",
                                                        LocalDateTime.now().plusDays(1),
                                                        LocalDateTime.now().plusDays(1).plusHours(1), 2500, 70)));
                }


                // Expand the demo domestic network without duplicating flights on later restarts.
                String[][] routes = {
                    {"Delhi","Mumbai","Pune","Jaipur","Lucknow","Bengaluru"},
                    {"Mumbai","Delhi","Goa","Ahmedabad","Hyderabad","Chennai"},
                    {"Bengaluru","Delhi","Mumbai","Chennai","Hyderabad","Kochi"},
                    {"Chennai","Delhi","Mumbai","Bengaluru","Kolkata","Coimbatore"},
                    {"Kolkata","Delhi","Mumbai","Bengaluru","Guwahati","Bhubaneswar"},
                    {"Hyderabad","Delhi","Mumbai","Bengaluru","Chennai","Pune"}
                };
                String[] airlines = {"IndiGo","Air India","Akasa Air","SpiceJet","Air India Express"};
                String[] prefixes = {"6E","AI","QP","SG","IX"};
                int routeIndex = 0;
                for (String[] cityRoutes : routes) {
                    for (int destinationIndex = 1; destinationIndex < cityRoutes.length; destinationIndex++) {
                        String origin = cityRoutes[0];
                        String destination = cityRoutes[destinationIndex];
                        String flightNumber = prefixes[routeIndex % prefixes.length] + (510 + routeIndex);
                        if (!flightRepository.existsByFlightNumber(flightNumber)) {
                            LocalDateTime departure = LocalDateTime.now().plusDays(2 + routeIndex % 20)
                                    .withHour(6 + routeIndex % 13).withMinute((routeIndex % 2) * 30).withSecond(0).withNano(0);
                            int durationHours = 1 + (routeIndex % 3);
                            int durationMinutes = (routeIndex % 2) * 30;
                            int seats = routeIndex % 9 == 0 ? 0 : routeIndex % 7 == 0 ? 7 : 35 + routeIndex % 80;
                            double price = 2800 + (routeIndex % 8) * 425;
                            flightRepository.save(new Flight(0, flightNumber, airlines[routeIndex % airlines.length],
                                    origin, destination, departure,
                                    departure.plusHours(durationHours).plusMinutes(durationMinutes), price, seats));
                        }
                        routeIndex++;
                    }
                }

                if (hotelRepository.count() == 0) {
                        hotelRepository.saveAll(Arrays.asList(
                                        new Hotel(null, "The Grand", "Mumbai", "123 Marine Drive", 5, 8000, 50),
                                        new Hotel(null, "Palm Resort", "Goa", "456 Beach Road", 4, 5000, 30),
                                        new Hotel(null, "City Inn", "Delhi", "789 Connaught Place", 3, 3000, 70),
                                        new Hotel(null, "Lakeview Hotel", "Udaipur", "321 Lake Road", 5, 9000, 20),
                                        new Hotel(null, "Mountain Retreat", "Manali", "654 Hilltop", 4, 6000, 25)));
                }


                // Curated demo catalogue: real property names and cities, with representative hotel photography.
                String[][] hotelCatalog = {
                    {"The Leela Palace","Delhi","5","12500"},{"Taj Palace","Delhi","5","11000"},{"The Imperial","Delhi","5","14500"},{"ITC Maurya","Delhi","5","10500"},{"The Lalit New Delhi","Delhi","5","8500"},
                    {"The Taj Mahal Palace","Mumbai","5","16000"},{"The Oberoi Mumbai","Mumbai","5","15000"},{"Trident Nariman Point","Mumbai","5","10500"},{"ITC Maratha","Mumbai","5","9000"},{"JW Marriott Mumbai Juhu","Mumbai","5","12000"},
                    {"Taj West End","Bengaluru","5","11500"},{"ITC Gardenia","Bengaluru","5","10000"},{"The Leela Palace Bengaluru","Bengaluru","5","13500"},{"Shangri-La Bengaluru","Bengaluru","5","9500"},{"The Oberoi Bengaluru","Bengaluru","5","10500"},
                    {"Taj Coromandel","Chennai","5","10500"},{"ITC Grand Chola","Chennai","5","12000"},{"The Leela Palace Chennai","Chennai","5","9500"},{"The Park Chennai","Chennai","4","6500"},{"Radisson Blu Hotel Chennai City Centre","Chennai","5","7200"},
                    {"The Oberoi Grand","Kolkata","5","9500"},{"ITC Royal Bengal","Kolkata","5","11000"},{"Taj Bengal","Kolkata","5","9000"},{"The LaLiT Great Eastern Kolkata","Kolkata","5","7800"},{"Hyatt Regency Kolkata","Kolkata","5","7200"},
                    {"Taj Falaknuma Palace","Hyderabad","5","22000"},{"ITC Kohenur","Hyderabad","5","11500"},{"Park Hyatt Hyderabad","Hyderabad","5","10500"},{"Trident Hyderabad","Hyderabad","5","9000"},{"Novotel Hyderabad Convention Centre","Hyderabad","5","7500"},
                    {"Vivanta Coimbatore","Coimbatore","4","6500"},{"The Residency Towers Coimbatore","Coimbatore","5","7200"},{"Welcomhotel by ITC Hotels, Race Course","Coimbatore","5","8000"},{"Zone by The Park Coimbatore","Coimbatore","4","4800"},{" ibis Coimbatore City Centre","Coimbatore","3","3900"}
                };
                String[] propertyPhotos = {
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=1000&auto=format&fit=crop&q=80"
                };
                int hotelIndex = 0;
                for (String[] data : hotelCatalog) {
                    Hotel property = hotelRepository.findAll().stream()
                            .filter(existing -> existing.getName().equalsIgnoreCase(data[0])).findFirst().orElse(null);
                    if (property == null) {
                        property = new Hotel(null, data[0], data[1], "Central area, " + data[1],
                                Integer.parseInt(data[2]), Double.parseDouble(data[3]), 24 + (hotelIndex % 35));
                    }
                    property.setHotelType(data[2] + " Star");
                    property.setWifi(true);
                    property.setBreakfastIncluded(hotelIndex % 4 != 1);
                    property.setSwimmingPool(Integer.parseInt(data[2]) >= 4 && hotelIndex % 3 != 0);
                    property.setGym(Integer.parseInt(data[2]) >= 4);
                    property.setNearMainAreas(hotelIndex % 5 != 0);
                    property.setImageUrl(propertyPhotos[hotelIndex % propertyPhotos.length]);
                    hotelRepository.save(property);
                    hotelIndex++;
                }
                // Ensure the original starter properties also display meaningful amenity metadata.
                for (Hotel property : hotelRepository.findAll()) {
                    if (property.getHotelType() == null) property.setHotelType(property.getRating() + " Star");
                    if (property.getImageUrl() == null) property.setImageUrl(propertyPhotos[Math.floorMod(property.getName().hashCode(), propertyPhotos.length)]);
                    if (property.getAddress() == null || property.getAddress().isBlank()) property.setAddress("Central area, " + property.getLocation());
                    hotelRepository.save(property);
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
