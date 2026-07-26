package com.project.librarymanagementsystem.Mapper;

import com.project.librarymanagementsystem.DTO.BorrowRecordRequest;
import com.project.librarymanagementsystem.DTO.BorrowRecordResponse;
import com.project.librarymanagementsystem.Entity.BorrowRecord;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BorrowRecordMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "member", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    BorrowRecord toEntity(BorrowRecordRequest request);

    @Mapping(target = "memberId", source = "member.id")
    @Mapping(target = "bookId", source = "book.id")
    BorrowRecordResponse toResponse(BorrowRecord borrowRecord);
}
