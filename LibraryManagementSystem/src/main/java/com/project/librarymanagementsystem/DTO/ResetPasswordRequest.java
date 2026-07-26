package com.project.librarymanagementsystem.DTO;

public record ResetPasswordRequest(
        String email,
        String resetToken,
        String newPassword
) {
}
