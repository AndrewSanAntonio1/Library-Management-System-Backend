package com.project.librarymanagementsystem.Service;

import com.project.librarymanagementsystem.DTO.AuthorRequest;
import com.project.librarymanagementsystem.DTO.AuthorResponse;
import com.project.librarymanagementsystem.Entity.Author;
import com.project.librarymanagementsystem.Mapper.AuthorMapper;
import com.project.librarymanagementsystem.Repository.AuthorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthorServiceTest {

    @Mock
    private AuthorRepository authorRepository;

    @Mock
    private AuthorMapper authorMapper;

    @InjectMocks
    private AuthorService authorService;

    private Author author;
    private AuthorRequest authorRequest;
    private AuthorResponse authorResponse;

    @BeforeEach
    void setUp() {
        author = new Author();
        author.setId(1L);
        author.setName("Test Author");
        author.setBiography("Biography");
        author.setNationality("USA");

        authorRequest = new AuthorRequest("Test Author", "Biography", "USA");
        authorResponse = new AuthorResponse(1L, "Test Author", "Biography", "USA", null, null);
    }

    @Test
    void createAuthor_Success() {
        when(authorMapper.toEntity(any())).thenReturn(author);
        when(authorRepository.save(any())).thenReturn(author);
        when(authorMapper.toResponse(any())).thenReturn(authorResponse);

        AuthorResponse response = authorService.createAuthor(authorRequest);

        assertNotNull(response);
        assertEquals("Test Author", response.name());
        verify(authorRepository, times(1)).save(any(Author.class));
    }

    @Test
    void getAllAuthors_Success() {
        when(authorRepository.findAll()).thenReturn(Arrays.asList(author));
        when(authorMapper.toResponse(any())).thenReturn(authorResponse);

        List<AuthorResponse> responses = authorService.getAllAuthors();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        verify(authorRepository, times(1)).findAll();
    }

    @Test
    void getAuthorById_Success() {
        when(authorRepository.findById(anyLong())).thenReturn(Optional.of(author));
        when(authorMapper.toResponse(any())).thenReturn(authorResponse);

        AuthorResponse response = authorService.getAuthorById(1L);

        assertNotNull(response);
        assertEquals("Test Author", response.name());
    }

    @Test
    void getAuthorById_NotFound_ThrowsException() {
        when(authorRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authorService.getAuthorById(1L));
    }

    @Test
    void updateAuthor_Success() {
        when(authorRepository.findById(anyLong())).thenReturn(Optional.of(author));
        when(authorRepository.save(any())).thenReturn(author);
        when(authorMapper.toResponse(any())).thenReturn(authorResponse);

        AuthorResponse response = authorService.updateAuthor(1L, authorRequest);

        assertNotNull(response);
        verify(authorRepository, times(1)).save(any(Author.class));
    }

    @Test
    void deleteAuthor_Success() {
        when(authorRepository.findById(anyLong())).thenReturn(Optional.of(author));
        doNothing().when(authorRepository).delete(any());

        authorService.deleteAuthor(1L);

        verify(authorRepository, times(1)).delete(any(Author.class));
    }
}
