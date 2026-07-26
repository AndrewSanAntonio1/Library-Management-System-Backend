package com.project.librarymanagementsystem.Controller;

import com.project.librarymanagementsystem.DTO.FineRequest;
import com.project.librarymanagementsystem.DTO.FineResponse;
import com.project.librarymanagementsystem.DTO.MessageResponse;
import com.project.librarymanagementsystem.Service.FineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/fines")
public class FineController {
    private final FineService fineService;

    @PostMapping
    public ResponseEntity<FineResponse> createFine(@RequestBody FineRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fineService.createFine(request));
    }

    @GetMapping
    public ResponseEntity<List<FineResponse>> getAllFines() {
        return ResponseEntity.ok(fineService.getAllFines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FineResponse> getFineById(@PathVariable Long id) {
        return ResponseEntity.ok(fineService.getFineById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FineResponse> updateFine(@PathVariable Long id, @RequestBody FineRequest request) {
        return ResponseEntity.ok(fineService.updateFine(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteFine(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(fineService.deleteFine(id));
    }
}
