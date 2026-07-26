package com.project.librarymanagementsystem.DTO;

import com.project.librarymanagementsystem.Enum.Role;
import com.project.librarymanagementsystem.Enum.UserStatus;

import java.time.LocalDateTime;

public record ProfileResponse(
        Long id,
        String username,
        String email,
        String firstname,
        String lastname,
        String phoneNumber,
        Role role,
        UserStatus status,
        LocalDateTime createdAt
) {
}
