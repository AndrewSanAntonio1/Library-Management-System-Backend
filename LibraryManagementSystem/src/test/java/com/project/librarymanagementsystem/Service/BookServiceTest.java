package com.project.librarymanagementsystem.Service;

import com.project.librarymanagementsystem.DTO.BookRequest;
import com.project.librarymanagementsystem.DTO.BookResponse;
import com.project.librarymanagementsystem.Entity.Author;
import com.project.librarymanagementsystem.Entity.Book;
import com.project.librarymanagementsystem.Entity.Category;
import com.project.librarymanagementsystem.Entity.Publisher;
import com.project.librarymanagementsystem.Mapper.BookMapper;
import com.project.librarymanagementsystem.Repository.AuthorRepository;
import com.project.librarymanagementsystem.Repository.BookRepository;
import com.project.librarymanagementsystem.Repository.CategoryRepository;
import com.project.librarymanagementsystem.Repository.PublisherRepository;
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
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private AuthorRepository authorRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private PublisherRepository publisherRepository;

    @Mock
    private BookMapper bookMapper;

    @InjectMocks
    private BookService bookService;

    private Book book;
    private Author author;
    private Category category;
    private Publisher publisher;
    private BookRequest bookRequest;
    private BookResponse bookResponse;

    @BeforeEach
    void setUp() {
        author = new Author();
        author.setId(1L);
        author.setName("Test Author");

        category = new Category();
        category.setId(1L);
        category.setName("Test Category");

        publisher = new Publisher();
        publisher.setId(1L);
        publisher.setName("Test Publisher");

        book = new Book();
        book.setId(1L);
        book.setIsbn("123-456-789");
        book.setTitle("Test Book");
        book.setAuthor(author);
        book.setCategory(category);
        book.setPublisher(publisher);

        bookRequest = new BookRequest("123-456-789", "Test Book", "Description", 2024, 10, 10, 1L, 1L, 1L);
        bookResponse = new BookResponse(1L, "123-456-789", "Test Book", "Description", 2024, 10, 10, 1L, 1L, 1L, null, null);
    }

    @Test
    void createBook_Success() {
        when(bookRepository.existsByIsbn(anyString())).thenReturn(false);
        when(authorRepository.findById(anyLong())).thenReturn(Optional.of(author));
        when(categoryRepository.findById(anyLong())).thenReturn(Optional.of(category));
        when(publisherRepository.findById(anyLong())).thenReturn(Optional.of(publisher));
        when(bookMapper.toEntity(any())).thenReturn(book);
        when(bookRepository.save(any())).thenReturn(book);
        when(bookMapper.toResponse(any())).thenReturn(bookResponse);

        BookResponse response = bookService.createBook(bookRequest);

        assertNotNull(response);
        assertEquals("Test Book", response.title());
        verify(bookRepository, times(1)).save(any(Book.class));
    }

    @Test
    void createBook_IsbnExists_ThrowsException() {
        when(bookRepository.existsByIsbn(anyString())).thenReturn(true);

        assertThrows(RuntimeException.class, () -> bookService.createBook(bookRequest));
        verify(bookRepository, never()).save(any());
    }

    @Test
    void getAllBooks_Success() {
        when(bookRepository.findAll()).thenReturn(Arrays.asList(book));
        when(bookMapper.toResponse(any())).thenReturn(bookResponse);

        List<BookResponse> responses = bookService.getAllBooks();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        verify(bookRepository, times(1)).findAll();
    }

    @Test
    void getBookById_Success() {
        when(bookRepository.findById(anyLong())).thenReturn(Optional.of(book));
        when(bookMapper.toResponse(any())).thenReturn(bookResponse);

        BookResponse response = bookService.getBookById(1L);

        assertNotNull(response);
        assertEquals("Test Book", response.title());
        verify(bookRepository, times(1)).findById(anyLong());
    }

    @Test
    void getBookById_NotFound_ThrowsException() {
        when(bookRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> bookService.getBookById(1L));
    }

    @Test
    void updateBook_Success() {
        when(bookRepository.findById(anyLong())).thenReturn(Optional.of(book));
        when(authorRepository.findById(anyLong())).thenReturn(Optional.of(author));
        when(categoryRepository.findById(anyLong())).thenReturn(Optional.of(category));
        when(publisherRepository.findById(anyLong())).thenReturn(Optional.of(publisher));
        when(bookRepository.save(any())).thenReturn(book);
        when(bookMapper.toResponse(any())).thenReturn(bookResponse);

        BookResponse response = bookService.updateBook(1L, bookRequest);

        assertNotNull(response);
        verify(bookRepository, times(1)).save(any(Book.class));
    }

    @Test
    void deleteBook_Success() {
        when(bookRepository.findById(anyLong())).thenReturn(Optional.of(book));
        doNothing().when(bookRepository).delete(any());

        bookService.deleteBook(1L);

        verify(bookRepository, times(1)).delete(any(Book.class));
    }
}
