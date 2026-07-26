package com.project.librarymanagementsystem.DTO;

import com.project.librarymanagementsystem.Enum.Role;

public record LoginResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresIn,
        String username,
        Role role
) {
}
