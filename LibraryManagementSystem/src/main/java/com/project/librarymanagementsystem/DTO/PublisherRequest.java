package com.project.librarymanagementsystem.DTO;

public record PublisherRequest(
        String name,
        String address,
        String phoneNumber,
        String email
) {
}
