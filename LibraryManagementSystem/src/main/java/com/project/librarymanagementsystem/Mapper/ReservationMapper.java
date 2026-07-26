package com.project.librarymanagementsystem.Mapper;

import com.project.librarymanagementsystem.DTO.ReservationRequest;
import com.project.librarymanagementsystem.DTO.ReservationResponse;
import com.project.librarymanagementsystem.Entity.Reservation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReservationMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "member", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Reservation toEntity(ReservationRequest request);

    @Mapping(target = "memberId", source = "member.id")
    @Mapping(target = "bookId", source = "book.id")
    ReservationResponse toResponse(Reservation reservation);
}
