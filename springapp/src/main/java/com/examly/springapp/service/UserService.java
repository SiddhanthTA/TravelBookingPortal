package com.examly.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.User;
import java.util.List;
import java.util.Optional;

import com.examly.springapp.repository.UserRepo;


@Service
public class UserService {
    @Autowired
    PasswordEncoder encoder;

    @Autowired
    UserRepo repo;

    public String register(User value)
    {
        if(value==null||value.getEmail()==null||value.getPassword()==null)
        {
            return "Invalid data";
        }
        if(repo.existsByEmail(value.getEmail()))
        {
            return "Email already exists!";
        }
        value.setPassword(encoder.encode(value.getPassword()));
        {
            if(value.getRole()==null)
            {
                value.setRole(User.Role.CUSTOMER);
            }
            repo.save(value);
            return "User Registered";
        }
    }

    public List<User> show()
    {
        return repo.findAll();
    }

    public String checkDetails(String email,String password)
    {
        if(email==null||password==null)
        return "Wrong Email or Password....";

        User user=repo.findByEmail(email);
        if(user==null)
        return "Wrong Email or Password....";

        boolean result=encoder.matches(password,user.getPassword());

        if(result)
        {
            return "Logged in successfully....";
        }
        return "Wrong Email or Password....";
    }

    public Optional<User> findById(Long id)
    {
        return repo.findById(id);
    }

    public Optional<User> findByEmail(String email)
    {
        return repo.findOptionalByEmail(email);
    }
}
