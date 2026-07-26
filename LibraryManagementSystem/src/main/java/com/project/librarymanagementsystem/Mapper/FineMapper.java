package com.project.librarymanagementsystem.Mapper;

import com.project.librarymanagementsystem.DTO.FineRequest;
import com.project.librarymanagementsystem.DTO.FineResponse;
import com.project.librarymanagementsystem.Entity.Fine;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FineMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "member", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Fine toEntity(FineRequest request);

    @Mapping(target = "memberId", source = "member.id")
    FineResponse toResponse(Fine fine);
}
