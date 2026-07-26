package com.project.librarymanagementsystem.DTO;

public record ChangePasswordRequest(
        String email,
        String oldPassword,
        String newPassword
) {
}
