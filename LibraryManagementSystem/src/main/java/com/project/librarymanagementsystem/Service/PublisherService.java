package com.project.librarymanagementsystem.Service;

import com.project.librarymanagementsystem.DTO.MessageResponse;
import com.project.librarymanagementsystem.DTO.PublisherRequest;
import com.project.librarymanagementsystem.DTO.PublisherResponse;
import com.project.librarymanagementsystem.Entity.Publisher;
import com.project.librarymanagementsystem.Mapper.PublisherMapper;
import com.project.librarymanagementsystem.Repository.PublisherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PublisherService {
    private final PublisherRepository publisherRepository;
    private final PublisherMapper publisherMapper;

    public PublisherResponse createPublisher(PublisherRequest request) {
        Publisher publisher = publisherMapper.toEntity(request);
        Publisher savedPublisher = publisherRepository.save(publisher);
        return publisherMapper.toResponse(savedPublisher);
    }

    public List<PublisherResponse> getAllPublishers() {
        return publisherRepository.findAll().stream()
                .map(publisherMapper::toResponse)
                .collect(Collectors.toList());
    }

    public PublisherResponse getPublisherById(Long id) {
        Publisher publisher = publisherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publisher not found"));
        return publisherMapper.toResponse(publisher);
    }

    public PublisherResponse updatePublisher(Long id, PublisherRequest request) {
        Publisher publisher = publisherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publisher not found"));

        publisher.setName(request.name());
        publisher.setAddress(request.address());
        publisher.setPhoneNumber(request.phoneNumber());
        publisher.setEmail(request.email());

        Publisher updatedPublisher = publisherRepository.save(publisher);
        return publisherMapper.toResponse(updatedPublisher);
    }

    public MessageResponse deletePublisher(Long id) {
        Publisher publisher = publisherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publisher not found"));

        publisherRepository.delete(publisher);
        return new MessageResponse("Publisher deleted successfully");
    }
}
