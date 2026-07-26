package com.project.librarymanagementsystem.Mapper;

import com.project.librarymanagementsystem.DTO.MemberRequest;
import com.project.librarymanagementsystem.DTO.MemberResponse;
import com.project.librarymanagementsystem.Entity.Member;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MemberMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Member toEntity(MemberRequest request);

    @Mapping(target = "userId", source = "user.id")
    MemberResponse toResponse(Member member);
}
