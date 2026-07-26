package com.project.librarymanagementsystem.DTO;

import java.time.LocalDateTime;

public record BookResponse(
        Long id,
        String isbn,
        String title,
        String description,
        Integer publicationYear,
        Integer totalCopies,
        Integer availableCopies,
        Long authorId,
        Long categoryId,
        Long publisherId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
