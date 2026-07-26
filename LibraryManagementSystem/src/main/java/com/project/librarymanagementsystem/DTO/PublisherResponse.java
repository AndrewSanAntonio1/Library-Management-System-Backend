package com.project.librarymanagementsystem.DTO;

import java.time.LocalDateTime;

public record PublisherResponse(
        Long id,
        String name,
        String address,
        String phoneNumber,
        String email,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
