package com.examly.springapp.security;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.examly.springapp.repository.BookingRepository;

@Component("bookingAccess")
public class BookingAccess {
    private final BookingRepository bookingRepository;

    public BookingAccess(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public boolean isOwnerOrAdmin(Long bookingId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) return false;
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) return true;
        return bookingRepository.findById(bookingId)
                .map(booking -> booking.getUserId() != null
                        && bookingRepository.findUserEmailByBookingId(bookingId)
                                .map(authentication.getName()::equals).orElse(false))
                .orElse(false);
    }
}