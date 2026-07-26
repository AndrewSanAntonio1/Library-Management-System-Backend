package com.project.librarymanagementsystem.DTO;

import com.project.librarymanagementsystem.Enum.BorrowStatus;

import java.time.LocalDateTime;

public record BorrowRecordResponse(
        Long id,
        Long memberId,
        Long bookId,
        LocalDateTime borrowDate,
        LocalDateTime dueDate,
        LocalDateTime returnDate,
        BorrowStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
