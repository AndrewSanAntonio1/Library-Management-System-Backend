package com.project.librarymanagementsystem.Mapper;

import com.project.librarymanagementsystem.DTO.PublisherRequest;
import com.project.librarymanagementsystem.DTO.PublisherResponse;
import com.project.librarymanagementsystem.Entity.Publisher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PublisherMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Publisher toEntity(PublisherRequest request);

    PublisherResponse toResponse(Publisher publisher);
}
