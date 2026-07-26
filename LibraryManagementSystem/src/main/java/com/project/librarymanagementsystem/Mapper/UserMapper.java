package com.project.librarymanagementsystem.Mapper;


import com.project.librarymanagementsystem.DTO.RegisterRequest;
import com.project.librarymanagementsystem.DTO.RegisterResponse;
import com.project.librarymanagementsystem.Entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "phoneNumber", source = "phonenumber")
    @Mapping(target = "userStatus", ignore = true)
    @Mapping(target = "resetToken", ignore = true)
    @Mapping(target = "resetTokenExpiry", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toEntity(RegisterRequest request);

    @Mapping(target = "status", source = "userStatus")
    RegisterResponse toResponse(User user);

}
