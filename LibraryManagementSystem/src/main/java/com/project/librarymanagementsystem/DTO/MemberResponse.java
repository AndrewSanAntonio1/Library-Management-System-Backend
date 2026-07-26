package com.project.librarymanagementsystem.DTO;

import java.time.LocalDateTime;

public record MemberResponse(
        Long id,
        Long userId,
        String membershipNumber,
        String address,
        LocalDateTime membershipStartDate,
        LocalDateTime membershipExpiryDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
