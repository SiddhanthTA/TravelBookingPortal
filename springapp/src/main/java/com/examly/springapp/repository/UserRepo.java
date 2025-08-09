package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.User;
import java.util.Optional;


@Repository
public interface UserRepo extends JpaRepository<User,Long> {

    User findByEmail(String email);
    Optional<User> findOptionalByEmail(String email);
    boolean existsByEmail(String email);
    
}
