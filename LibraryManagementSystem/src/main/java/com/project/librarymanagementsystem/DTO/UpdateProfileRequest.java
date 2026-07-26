package com.project.librarymanagementsystem.DTO;

public record UpdateProfileRequest(
        String firstname,
        String lastname,
        String phoneNumber
) {
}
