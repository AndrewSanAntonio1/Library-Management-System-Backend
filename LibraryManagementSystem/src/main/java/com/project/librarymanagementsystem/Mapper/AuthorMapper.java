package com.project.librarymanagementsystem.Mapper;

import com.project.librarymanagementsystem.DTO.AuthorRequest;
import com.project.librarymanagementsystem.DTO.AuthorResponse;
import com.project.librarymanagementsystem.Entity.Author;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuthorMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Author toEntity(AuthorRequest request);

    AuthorResponse toResponse(Author author);
}
