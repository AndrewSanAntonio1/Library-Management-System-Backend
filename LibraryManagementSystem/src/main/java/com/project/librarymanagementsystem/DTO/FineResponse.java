package com.project.librarymanagementsystem.DTO;

import com.project.librarymanagementsystem.Enum.FineStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FineResponse(
        Long id,
        Long memberId,
        BigDecimal amount,
        String reason,
        FineStatus status,
        LocalDateTime paymentDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
