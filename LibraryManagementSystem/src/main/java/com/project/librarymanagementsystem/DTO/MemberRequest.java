package com.project.librarymanagementsystem.DTO;

import java.time.LocalDateTime;

public record MemberRequest(
        Long userId,
        String membershipNumber,
        String address,
        LocalDateTime membershipStartDate,
        LocalDateTime membershipExpiryDate
) {
}
