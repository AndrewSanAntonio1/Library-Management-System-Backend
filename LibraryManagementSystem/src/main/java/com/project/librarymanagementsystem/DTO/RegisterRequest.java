package com.project.librarymanagementsystem.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;


public record RegisterRequest(
        @NotBlank(message = "Username is required!")
        String username,

        @NotBlank(message = "Email is required!")
        @Email(message = "Invalid email format")
        String email,

        @Size(min = 8, message = "Password is required!")
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
