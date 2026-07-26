package com.project.librarymanagementsystem.Service;

import com.project.librarymanagementsystem.DTO.AuthorRequest;
import com.project.librarymanagementsystem.DTO.AuthorResponse;
import com.project.librarymanagementsystem.DTO.MessageResponse;
import com.project.librarymanagementsystem.Entity.Author;
import com.project.librarymanagementsystem.Mapper.AuthorMapper;
import com.project.librarymanagementsystem.Repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthorService {
    private final AuthorRepository authorRepository;
    private final AuthorMapper authorMapper;

    public AuthorResponse createAuthor(AuthorRequest request) {
        Author author = authorMapper.toEntity(request);
        Author savedAuthor = authorRepository.save(author);
        return authorMapper.toResponse(savedAuthor);
    }

    public List<AuthorResponse> getAllAuthors() {
        return authorRepository.findAll().stream()
                .map(authorMapper::toResponse)
                .collect(Collectors.toList());
    }

    public AuthorResponse getAuthorById(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found"));
        return authorMapper.toResponse(author);
    }

    public AuthorResponse updateAuthor(Long id, AuthorRequest request) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found"));

        author.setName(request.name());
        author.setBiography(request.biography());
        author.setNationality(request.nationality());

        Author updatedAuthor = authorRepository.save(author);
        return authorMapper.toResponse(updatedAuthor);
    }

    public MessageResponse deleteAuthor(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found"));

        authorRepository.delete(author);
        return new MessageResponse("Author deleted successfully");
    }
}
