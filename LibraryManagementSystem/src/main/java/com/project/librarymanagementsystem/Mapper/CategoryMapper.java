package com.project.librarymanagementsystem.Mapper;

import com.project.librarymanagementsystem.DTO.CategoryRequest;
import com.project.librarymanagementsystem.DTO.CategoryResponse;
import com.project.librarymanagementsystem.Entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Category toEntity(CategoryRequest request);

    CategoryResponse toResponse(Category category);
}
