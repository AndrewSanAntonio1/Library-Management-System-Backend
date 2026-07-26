package com.project.librarymanagementsystem.Service;

import com.project.librarymanagementsystem.DTO.BookRequest;
import com.project.librarymanagementsystem.DTO.BookResponse;
import com.project.librarymanagementsystem.DTO.MessageResponse;
import com.project.librarymanagementsystem.Entity.Author;
import com.project.librarymanagementsystem.Entity.Book;
import com.project.librarymanagementsystem.Entity.Category;
import com.project.librarymanagementsystem.Entity.Publisher;
import com.project.librarymanagementsystem.Mapper.BookMapper;
import com.project.librarymanagementsystem.Repository.AuthorRepository;
import com.project.librarymanagementsystem.Repository.BookRepository;
import com.project.librarymanagementsystem.Repository.CategoryRepository;
import com.project.librarymanagementsystem.Repository.PublisherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final PublisherRepository publisherRepository;
    private final BookMapper bookMapper;

    public BookResponse createBook(BookRequest request) {
        if (bookRepository.existsByIsbn(request.isbn())) {
            throw new RuntimeException("Book with ISBN already exists");
        }

        Author author = authorRepository.findById(request.authorId())
                .orElseThrow(() -> new RuntimeException("Author not found"));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Publisher publisher = publisherRepository.findById(request.publisherId())
                .orElseThrow(() -> new RuntimeException("Publisher not found"));

        Book book = bookMapper.toEntity(request);
        book.setAuthor(author);
        book.setCategory(category);
        book.setPublisher(publisher);

        Book savedBook = bookRepository.save(book);
        return bookMapper.toResponse(savedBook);
    }

    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(bookMapper::toResponse)
                .collect(Collectors.toList());
    }

    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        return bookMapper.toResponse(book);
    }

    public BookResponse updateBook(Long id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Author author = authorRepository.findById(request.authorId())
                .orElseThrow(() -> new RuntimeException("Author not found"));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Publisher publisher = publisherRepository.findById(request.publisherId())
                .orElseThrow(() -> new RuntimeException("Publisher not found"));

        book.setIsbn(request.isbn());
        book.setTitle(request.title());
        book.setDescription(request.description());
        book.setPublicationYear(request.publicationYear());
        book.setTotalCopies(request.totalCopies());
        book.setAvailableCopies(request.availableCopies());
        book.setAuthor(author);
        book.setCategory(category);
        book.setPublisher(publisher);

        Book updatedBook = bookRepository.save(book);
        return bookMapper.toResponse(updatedBook);
    }

    public MessageResponse deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        bookRepository.delete(book);
        return new MessageResponse("Book deleted successfully");
    }
}
