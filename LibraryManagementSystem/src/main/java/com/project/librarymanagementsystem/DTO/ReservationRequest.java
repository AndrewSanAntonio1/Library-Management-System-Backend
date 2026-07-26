package com.project.librarymanagementsystem.DTO;

import com.project.librarymanagementsystem.Enum.ReservationStatus;

import java.time.LocalDateTime;

public record ReservationRequest(
        Long memberId,
        Long bookId,
        LocalDateTime reservationDate,
        LocalDateTime expiryDate,
        ReservationStatus status
) {
}
