package com.project.librarymanagementsystem.DTO;

public record BookRequest(
        String isbn,
        String title,
        String description,
        Integer publicationYear,
        Integer totalCopies,
        Integer availableCopies,
        Long authorId,
        Long categoryId,
        Long publisherId
) {
}
