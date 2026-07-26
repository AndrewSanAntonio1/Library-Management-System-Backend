package com.project.librarymanagementsystem.Controller;

import com.project.librarymanagementsystem.DTO.BorrowRecordRequest;
import com.project.librarymanagementsystem.DTO.BorrowRecordResponse;
import com.project.librarymanagementsystem.DTO.MessageResponse;
import com.project.librarymanagementsystem.Service.BorrowRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/borrow-records")
public class BorrowRecordController {
    private final BorrowRecordService borrowRecordService;

    @PostMapping
    public ResponseEntity<BorrowRecordResponse> createBorrowRecord(@RequestBody BorrowRecordRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(borrowRecordService.createBorrowRecord(request));
    }

    @GetMapping
    public ResponseEntity<List<BorrowRecordResponse>> getAllBorrowRecords() {
        return ResponseEntity.ok(borrowRecordService.getAllBorrowRecords());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BorrowRecordResponse> getBorrowRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(borrowRecordService.getBorrowRecordById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BorrowRecordResponse> updateBorrowRecord(@PathVariable Long id, @RequestBody BorrowRecordRequest request) {
        return ResponseEntity.ok(borrowRecordService.updateBorrowRecord(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteBorrowRecord(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(borrowRecordService.deleteBorrowRecord(id));
    }
}
