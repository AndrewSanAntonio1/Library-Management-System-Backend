package com.project.librarymanagementsystem.DTO;

import com.project.librarymanagementsystem.Enum.FineStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FineRequest(
        Long memberId,
        BigDecimal amount,
        String reason,
        FineStatus status,
        LocalDateTime paymentDate
) {
}
