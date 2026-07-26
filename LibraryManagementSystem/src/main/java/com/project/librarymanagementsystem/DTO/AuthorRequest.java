package com.project.librarymanagementsystem.DTO;

public record AuthorRequest(
        String name,
        String biography,
        String nationality
) {
}
