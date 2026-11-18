package com.examly.springapp.security;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import com.examly.springapp.repository.BookingRepository;
import com.examly.springapp.repository.UserRepo;
@Component("bookingAccess")
public class BookingAccess {
 private final BookingRepository bookingRepository; private final UserRepo userRepo;
 public BookingAccess(BookingRepository bookingRepository, UserRepo userRepo){this.bookingRepository=bookingRepository;this.userRepo=userRepo;}
 public boolean isOwnerOrAdmin(Long bookingId, Authentication authentication){
  if(authentication==null||!authentication.isAuthenticated())return false;
  if(authentication.getAuthorities().stream().anyMatch(a->a.getAuthority().equals("ROLE_ADMIN")))return true;
  var user=userRepo.findByEmail(authentication.getName()); if(user==null)return false;
  return bookingRepository.findById(bookingId).map(b->user.getId().equals(b.getUserId())).orElse(false);
 }
}