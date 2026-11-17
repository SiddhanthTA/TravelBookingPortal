package com.examly.springapp.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.examly.springapp.dto.FlightCheckoutRequest;
import com.examly.springapp.dto.GuestRequest;
import com.examly.springapp.dto.HotelCheckoutRequest;
import com.examly.springapp.dto.PassengerRequest;
import com.examly.springapp.model.Booking;
import com.examly.springapp.model.Flight;
import com.examly.springapp.model.FlightPassenger;
import com.examly.springapp.model.Hotel;
import com.examly.springapp.model.HotelGuest;
import com.examly.springapp.model.Payment;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.BookingRepository;
import com.examly.springapp.repository.FlightRepository;
import com.examly.springapp.repository.HotelRepository;
import com.examly.springapp.repository.PaymentRepository;
import com.examly.springapp.repository.UserRepo;

@Service
public class BookingService {
    @Autowired private BookingRepository bookingRepository;
    @Autowired private FlightRepository flightRepository;
    @Autowired private HotelRepository hotelRepository;
    @Autowired private UserRepo userRepo;
    @Autowired private PaymentRepository paymentRepository;

    // New two-stage checkout: create a pending booking first, confirm only after simulated payment.
    @Transactional
    public Booking createFlightCheckout(FlightCheckoutRequest request) {
        User accountHolder = userRepo.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found"));
        Flight flight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Flight not found"));

        if (flight.getDepartureTime().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This flight has already departed");
        }

        int passengerCount = request.getPassengers().size();
        if (passengerCount < 1 || flight.getAvailableSeats() < passengerCount) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Not enough seats are available for this passenger count");
        }
        validateBookingFor(request.getBookingFor());

        Booking booking = new Booking();
        booking.setBookingType("FLIGHT");
        booking.setBookingReference("FL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setUserId(accountHolder.getId());
        booking.setFlightId(flight.getId());
        booking.setFlight(flight);
        booking.setBookingDate(LocalDateTime.now());
        booking.setDepartureDate(flight.getDepartureTime().toLocalDate());
        booking.setTotalPrice(flight.getPrice() * passengerCount);
        booking.setStatus("PENDING_PAYMENT");
        booking.setPaymentStatus("PENDING");
        booking.setBookingFor(normalizeBookingFor(request.getBookingFor()));
        booking.setPassengerCount(passengerCount);

        for (PassengerRequest passengerRequest : request.getPassengers()) {
            validatePassenger(passengerRequest);
            FlightPassenger passenger = new FlightPassenger();
            passenger.setBooking(booking);
            passenger.setFullName(passengerRequest.getFullName().trim());
            passenger.setDateOfBirth(passengerRequest.getDateOfBirth());
            passenger.setGender(passengerRequest.getGender());
            passenger.setEmail(passengerRequest.getEmail());
            passenger.setPhoneNumber(passengerRequest.getPhoneNumber());
            passenger.setAddress(passengerRequest.getAddress());
            passenger.setPassengerType(derivePassengerType(passengerRequest.getDateOfBirth()));
            passenger.setSeatPreference(normalizePreference(passengerRequest.getSeatPreference(), List.of("Window", "Aisle", "Middle", "No preference"), "seat preference"));
            passenger.setDietaryPreference(normalizePreference(passengerRequest.getDietaryPreference(), List.of("No preference", "Vegetarian", "Non-vegetarian", "Vegan", "Jain"), "dietary preference"));
            booking.getPassengers().add(passenger);
        }
        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking createHotelCheckout(HotelCheckoutRequest request) {
        User accountHolder = userRepo.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found"));
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hotel not found"));

        if (request.getCheckInDate() == null || request.getCheckOutDate() == null
                || !request.getCheckOutDate().isAfter(request.getCheckInDate())
                || request.getCheckInDate().isBefore(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose valid check-in and check-out dates.");
        }
        if (request.getRooms() < 1 || request.getRooms() > 10)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose between 1 and 10 rooms.");
        if (request.getGuests() == null || request.getGuests().isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Primary guest details are required.");
        validateBookingFor(request.getBookingFor());

        GuestRequest primaryGuest = request.getGuests().get(0);
        if (primaryGuest.getFullName() == null
                || !primaryGuest.getFullName().trim().matches("[\\p{L}][\\p{L} .'-]{1,79}"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid primary guest name.");
        if (primaryGuest.getEmail() != null && !primaryGuest.getEmail().isBlank()
                && !primaryGuest.getEmail().matches("(?i)^[A-Z0-9._%+-]+@(gmail|yahoo)\\.com$"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid Gmail or Yahoo email address.");
        if (primaryGuest.getPhoneNumber() != null && !primaryGuest.getPhoneNumber().isBlank()
                && !primaryGuest.getPhoneNumber().matches("^[6-9][0-9]{9}$"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid 10-digit Indian mobile number.");
        if (primaryGuest.getAddress() != null && primaryGuest.getAddress().length() > 255)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Address must be 255 characters or fewer.");

        LocalTime checkInTime = request.getCheckInTime() == null ? LocalTime.of(14, 0) : request.getCheckInTime();
        LocalTime checkOutTime = request.getCheckOutTime() == null ? LocalTime.of(11, 0) : request.getCheckOutTime();
        if (checkInTime.isBefore(LocalTime.of(12, 0)) || checkInTime.isAfter(LocalTime.of(23, 0)))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Check-in time must be between 12:00 PM and 11:00 PM.");
        if (checkOutTime.isBefore(LocalTime.of(5, 0)) || checkOutTime.isAfter(LocalTime.of(12, 0)))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Check-out time must be between 5:00 AM and 12:00 PM.");

        int nights = (int) ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        double accommodationPrice = hotel.getPricePerNight() * nights * request.getRooms();
        List<String> selected = request.getAdditionalFacilities() == null
                ? List.of() : request.getAdditionalFacilities().stream().distinct().toList();
        double facilityCharges = 0;
        List<String> invoiceLines = new java.util.ArrayList<>();
        for (String facility : selected) {
            double charge;
            String description;
            switch (facility) {
                case "GYM_ACCESS" -> {
                    charge = 400.0 * nights * request.getRooms();
                    description = "Gym access";
                }
                case "DINNER_PACKAGE" -> {
                    charge = 850.0 * nights;
                    description = "Dinner package";
                }
                case "SPA_SESSION" -> {
                    charge = 1800.0;
                    description = "Spa session";
                }
                case "AIRPORT_TRANSFER" -> {
                    charge = 1200.0;
                    description = "Airport transfer";
                }
                default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more selected facilities are invalid.");
            }
            facilityCharges += charge;
            invoiceLines.add(description + ": ₹" + String.format(java.util.Locale.ROOT, "%.2f", charge));
        }

        Booking booking = new Booking();
        booking.setBookingType("HOTEL");
        booking.setBookingReference("HT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setUserId(accountHolder.getId());
        booking.setHotelId(hotel.getId());
        booking.setHotel(hotel);
        booking.setBookingDate(LocalDateTime.now());
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setCheckInTime(checkInTime);
        booking.setCheckOutTime(checkOutTime);
        booking.setNights(nights);
        booking.setRooms(request.getRooms());
        booking.setGuestCount(1);
        booking.setPrimaryGuestName(primaryGuest.getFullName().trim());
        booking.setAccommodationPrice(accommodationPrice);
        booking.setFacilityCharges(facilityCharges);
        booking.setFacilityDetails(invoiceLines.isEmpty() ? "No paid add-ons" : String.join("; ", invoiceLines));
        booking.setTotalPrice(accommodationPrice + facilityCharges);
        booking.setStatus("PENDING_PAYMENT");
        booking.setPaymentStatus("PENDING");
        booking.setBookingFor(normalizeBookingFor(request.getBookingFor()));

        HotelGuest guest = new HotelGuest();
        guest.setBooking(booking);
        guest.setFullName(primaryGuest.getFullName().trim());
        guest.setGender(primaryGuest.getGender());
        guest.setEmail(primaryGuest.getEmail());
        guest.setPhoneNumber(primaryGuest.getPhoneNumber());
        guest.setAddress(primaryGuest.getAddress());
        guest.setRoomNumber(1);
        booking.getGuests().add(guest);
        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking simulatePayment(Long bookingId, String paymentMethod) {
        if (paymentMethod == null || !List.of("UPI", "CARD", "NET_BANKING").contains(paymentMethod.toUpperCase())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose UPI, CARD or NET_BANKING");
        }

        Booking booking = bookingRepository.findByIdForUpdate(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
        if (!"PENDING_PAYMENT".equals(booking.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This booking is not awaiting payment");
        }

        // Inventory is checked and committed only when the demo payment succeeds.
        if ("FLIGHT".equals(booking.getBookingType())) {
            Flight flight = flightRepository.findByIdForUpdate(booking.getFlightId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Flight not found"));
            if (flight.getAvailableSeats() < booking.getPassengerCount()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Seats are no longer available. Please search again.");
            }
            flight.setAvailableSeats(flight.getAvailableSeats() - booking.getPassengerCount());
            flightRepository.save(flight);
        } else if ("HOTEL".equals(booking.getBookingType())) {
            Hotel hotel = hotelRepository.findByIdForUpdate(booking.getHotelId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hotel not found"));
            // availableRooms is the hotel's total room inventory. Overlapping confirmed stays are counted by date.
            long occupied = bookingRepository.countOverlappingHotelRooms(
                    hotel.getId(), booking.getCheckOutDate(), booking.getCheckInDate());
            if (hotel.getAvailableRooms() - occupied < booking.getRooms()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Not enough rooms are available for those dates.");
            }
        }

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setPaymentReference("PAY-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase());
        payment.setPaymentMethod(paymentMethod.toUpperCase());
        payment.setAmount(booking.getTotalPrice());
        payment.setStatus("SUCCESS");
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        booking.setPaymentStatus("SUCCESS");
        booking.setStatus("CONFIRMED");
        return bookingRepository.save(booking);
    }


    private void validatePassenger(PassengerRequest passenger) {
        if (passenger.getFullName() == null || !passenger.getFullName().trim().matches("[\\p{L}][\\p{L} .'-]{1,79}"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid passenger name (2–80 characters).");
        if (passenger.getDateOfBirth() == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passenger date of birth is required.");
        int age = Period.between(passenger.getDateOfBirth(), LocalDate.now()).getYears();
        if (age < 0 || age > 100) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid passenger date of birth.");
        if (passenger.getGender() == null || !List.of("Female", "Male", "Non-binary", "Prefer not to say").contains(passenger.getGender()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a valid passenger gender.");
        if (passenger.getEmail() == null || !passenger.getEmail().matches("(?i)^[A-Z0-9._%+-]+@(gmail|yahoo)\\.com$"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid Gmail or Yahoo passenger email.");
        if (passenger.getPhoneNumber() == null || !passenger.getPhoneNumber().matches("^[6-9][0-9]{9}$"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid 10-digit Indian mobile number.");
        if (passenger.getAddress() != null && passenger.getAddress().length() > 255)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passenger address must be 255 characters or fewer.");
    }

    private String normalizePreference(String value, List<String> allowed, String label) {
        if (value == null || value.isBlank()) return "No preference";
        if (!allowed.contains(value)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a valid " + label + ".");
        return value;
    }

    private String derivePassengerType(LocalDate dateOfBirth) {
        int age = Period.between(dateOfBirth, LocalDate.now()).getYears();
        if (age < 2) return "INFANT";
        if (age < 18) return "CHILD";
        if (age < 55) return "ADULT";
        return "SENIOR";
    }

    private void validateBookingFor(String bookingFor) {
        if (bookingFor != null && !bookingFor.isBlank()
                && !List.of("ME", "OTHERS").contains(bookingFor.toUpperCase())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "bookingFor must be ME or OTHERS");
        }
    }

    private String normalizeBookingFor(String bookingFor) {
        return bookingFor == null || bookingFor.isBlank() ? "ME" : bookingFor.toUpperCase();
    }

    // Legacy endpoints retained temporarily so the existing UI and tests remain compatible during migration.
    public Optional<Booking> createFlightBooking(Long flightId, Long userId) {
        Optional<Flight> flightOpt = flightRepository.findById(flightId);
        if (flightOpt.isPresent()) {
            Flight flight = flightOpt.get();
            if (flight.getAvailableSeats() > 0) {
                flight.setAvailableSeats(flight.getAvailableSeats() - 1);
                flightRepository.save(flight);
                Booking booking = new Booking();
                booking.setBookingType("FLIGHT");
                booking.setFlightId(flightId);
                booking.setHotelId(null);
                booking.setFlight(flight);
                booking.setUserId(userId);
                booking.setBookingReference("FL-" + UUID.randomUUID().toString().substring(0, 6));
                booking.setBookingDate(LocalDateTime.now());
                booking.setTotalPrice(flight.getPrice());
                booking.setStatus("CONFIRMED");
                booking.setPaymentStatus("SUCCESS");
                booking.setPassengerCount(1);
                return Optional.of(bookingRepository.save(booking));
            }
        }
        return Optional.empty();
    }

    public Optional<Booking> createHotelBooking(Long hotelId, Long userId, int nights) {
        Optional<Hotel> hotelOpt = hotelRepository.findById(hotelId);
        if (hotelOpt.isPresent() && nights > 0) {
            Hotel hotel = hotelOpt.get();
            if (hotel.getAvailableRooms() > 0) {
                hotel.setAvailableRooms(hotel.getAvailableRooms() - 1);
                hotelRepository.save(hotel);
                Booking booking = new Booking();
                booking.setBookingType("HOTEL");
                booking.setHotelId(hotelId);
                booking.setFlightId(null);
                booking.setHotel(hotel);
                booking.setUserId(userId);
                booking.setBookingReference("HT-" + UUID.randomUUID().toString().substring(0, 6));
                booking.setBookingDate(LocalDateTime.now());
                booking.setTotalPrice(hotel.getPricePerNight() * nights);
                booking.setStatus("CONFIRMED");
                booking.setPaymentStatus("SUCCESS");
                booking.setNights(nights);
                booking.setRooms(1);
                return Optional.of(bookingRepository.save(booking));
            }
        }
        return Optional.empty();
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    @Transactional
    public Optional<Booking> cancelBooking(Long id) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            if (!"CANCELLED".equals(booking.getStatus())) {
                if ("FLIGHT".equals(booking.getBookingType()) && "CONFIRMED".equals(booking.getStatus())) {
                    flightRepository.findById(booking.getFlightId()).ifPresent(flight -> {
                        flight.setAvailableSeats(flight.getAvailableSeats() + Math.max(1, booking.getPassengerCount()));
                        flightRepository.save(flight);
                    });
                } else if ("HOTEL".equals(booking.getBookingType()) && "CONFIRMED".equals(booking.getStatus())
                        && booking.getCheckInDate() == null) {
                    hotelRepository.findById(booking.getHotelId()).ifPresent(hotel -> {
                        hotel.setAvailableRooms(hotel.getAvailableRooms() + 1);
                        hotelRepository.save(hotel);
                    });
                }
                booking.setStatus("CANCELLED");
                if ("SUCCESS".equals(booking.getPaymentStatus())) {
                    booking.setPaymentStatus("REFUND_PENDING");
                }
                return Optional.of(bookingRepository.save(booking));
            }
        }
        return Optional.empty();
    }

    public List<Booking> getBookingByuserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
}
