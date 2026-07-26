package com.project.librarymanagementsystem.Controller;

import com.project.librarymanagementsystem.DTO.MessageResponse;
import com.project.librarymanagementsystem.DTO.PublisherRequest;
import com.project.librarymanagementsystem.DTO.PublisherResponse;
import com.project.librarymanagementsystem.Service.PublisherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/publishers")
public class PublisherController {
    private final PublisherService publisherService;

    @PostMapping
    public ResponseEntity<PublisherResponse> createPublisher(@RequestBody PublisherRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(publisherService.createPublisher(request));
    }

    @GetMapping
    public ResponseEntity<List<PublisherResponse>> getAllPublishers() {
        return ResponseEntity.ok(publisherService.getAllPublishers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublisherResponse> getPublisherById(@PathVariable Long id) {
        return ResponseEntity.ok(publisherService.getPublisherById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PublisherResponse> updatePublisher(@PathVariable Long id, @RequestBody PublisherRequest request) {
        return ResponseEntity.ok(publisherService.updatePublisher(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deletePublisher(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(publisherService.deletePublisher(id));
    }
}
