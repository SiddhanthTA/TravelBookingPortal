package com.examly.springapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserDTO {
    private String name;
    private String email;
    // private String password; // optional (if user wants to change password)
    private String phoneNumber;
}
