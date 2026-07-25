package com.project.librarymanagementsystem.Service;

import com.project.librarymanagementsystem.DTO.RegisterRequest;
import com.project.librarymanagementsystem.DTO.RegisterResponse;
import com.project.librarymanagementsystem.Entity.User;
import com.project.librarymanagementsystem.Enum.Role;
import com.project.librarymanagementsystem.Enum.UserStatus;
import com.project.librarymanagementsystem.Mapper.UserMapper;
import com.project.librarymanagementsystem.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public RegisterResponse register(RegisterRequest request) {
        if(userRepository.existsByUsername(request.username())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already exists");
        }

        User user = userMapper.toEntity(request);

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.MEMBER);
        user.setUserStatus(UserStatus.ACTIVE);
        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }

}
