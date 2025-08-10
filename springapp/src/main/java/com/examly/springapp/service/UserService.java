package com.examly.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.User;
import java.util.*;
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
                return "Role is required";
            }
            repo.save(value);
            return "User Registered";
        }
    }

    public List<User> show()
    {
        return repo.findAll();
    }

    public Map<String,Object> checkDetails(String email,String password)
    {
        Map<String,Object> response=new HashMap<>();
        if(email==null||password==null)
        {
            response.put("status","failure");
            response.put("message","Wrong email or password");
            response.put("role","");
            return response;
        
        }

        User user=repo.findByEmail(email);
        if(user==null)
        {
            response.put("status","failure");
            response.put("message","Wrong email or password");
            response.put("role","");
            return response;

        }

        boolean result=encoder.matches(password,user.getPassword());

        if(result)
        {
            response.put("status","success");
            response.put("message","Logged in successfully");
            response.put("role",user.getRole().name());
            response.put("id",user.getId());
        }
        else  
        {
            
            response.put("status","failure");
            response.put("message","Wrong email or password");
            response.put("role","");
        }
        return response;
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
