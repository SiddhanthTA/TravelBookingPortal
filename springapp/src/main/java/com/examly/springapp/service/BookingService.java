package com.examly.springapp.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
            FlightPassenger passenger = new FlightPassenger();
            passenger.setBooking(booking);
            passenger.setFullName(passengerRequest.getFullName().trim());
            passenger.setDateOfBirth(passengerRequest.getDateOfBirth());
            passenger.setGender(passengerRequest.getGender());
            passenger.setEmail(passengerRequest.getEmail());
            passenger.setPhoneNumber(passengerRequest.getPhoneNumber());
            passenger.setAddress(passengerRequest.getAddress());
            passenger.setPassengerType(passengerRequest.getPassengerType());
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
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Check-out must be after check-in");
        }
        if (request.getRooms() < 1 || request.getGuests().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one room and one guest are required");
        }
        validateBookingFor(request.getBookingFor());

        int nights = (int) ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        Booking booking = new Booking();
        booking.setBookingType("HOTEL");
        booking.setBookingReference("HT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setUserId(accountHolder.getId());
        booking.setHotelId(hotel.getId());
        booking.setHotel(hotel);
        booking.setBookingDate(LocalDateTime.now());
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setNights(nights);
        booking.setRooms(request.getRooms());
        booking.setGuestCount(request.getGuests().size());
        booking.setTotalPrice(hotel.getPricePerNight() * nights * request.getRooms());
        booking.setStatus("PENDING_PAYMENT");
        booking.setPaymentStatus("PENDING");
        booking.setBookingFor(normalizeBookingFor(request.getBookingFor()));

        for (GuestRequest guestRequest : request.getGuests()) {
            HotelGuest guest = new HotelGuest();
            guest.setBooking(booking);
            guest.setFullName(guestRequest.getFullName().trim());
            guest.setGender(guestRequest.getGender());
            guest.setEmail(guestRequest.getEmail());
            guest.setPhoneNumber(guestRequest.getPhoneNumber());
            guest.setAddress(guestRequest.getAddress());
            guest.setRoomNumber(guestRequest.getRoomNumber());
            booking.getGuests().add(guest);
        }
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
