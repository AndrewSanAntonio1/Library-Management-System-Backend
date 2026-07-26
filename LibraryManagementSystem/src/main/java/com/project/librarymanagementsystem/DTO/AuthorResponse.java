package com.project.librarymanagementsystem.DTO;

import java.time.LocalDateTime;

public record AuthorResponse(
        Long id,
        String name,
        String biography,
        String nationality,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
