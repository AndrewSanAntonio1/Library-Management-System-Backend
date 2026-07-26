package com.project.librarymanagementsystem.Mapper;

import com.project.librarymanagementsystem.DTO.BookRequest;
import com.project.librarymanagementsystem.DTO.BookResponse;
import com.project.librarymanagementsystem.Entity.Book;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "author", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "publisher", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Book toEntity(BookRequest request);

    @Mapping(target = "authorId", source = "author.id")
    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "publisherId", source = "publisher.id")
    BookResponse toResponse(Book book);
}
