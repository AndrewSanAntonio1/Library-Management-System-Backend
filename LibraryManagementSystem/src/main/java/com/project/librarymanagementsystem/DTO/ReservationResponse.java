package com.project.librarymanagementsystem.DTO;

import com.project.librarymanagementsystem.Enum.ReservationStatus;

import java.time.LocalDateTime;

public record ReservationResponse(
        Long id,
        Long memberId,
        Long bookId,
        LocalDateTime reservationDate,
        LocalDateTime expiryDate,
        ReservationStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
