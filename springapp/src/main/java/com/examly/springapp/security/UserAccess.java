package com.examly.springapp.security;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.examly.springapp.repository.UserRepo;

@Component("userAccess")
public class UserAccess {
    private final UserRepo userRepo;

    public UserAccess(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public boolean isSelfOrAdmin(Long userId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) return false;
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) return true;
        return userRepo.findByEmail(authentication.getName()) != null
                && userRepo.findByEmail(authentication.getName()).getId().equals(userId);
    }
}