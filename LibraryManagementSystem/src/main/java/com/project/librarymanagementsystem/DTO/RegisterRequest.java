package com.project.librarymanagementsystem.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;


public record RegisterRequest(
        @NotBlank(message = "Username is required!")
        String username,

        @NotBlank(message = "Email is required!")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters long")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
                message = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
        String password,

        @NotBlank(message = "Firstname is required!")
        String firstname,

        @NotBlank(message = "Lastname is required!")
        String lastname,

        @NotBlank(message = "Phonenumber is required!")
        @Pattern(regexp = "^09\\d{9}$" , message = "Invalid Philippine phonenumber.")
        String phonenumber
) {

}
