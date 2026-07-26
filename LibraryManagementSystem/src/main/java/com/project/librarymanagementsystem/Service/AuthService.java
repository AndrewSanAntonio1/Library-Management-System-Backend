package com.project.librarymanagementsystem.Service;

import com.project.librarymanagementsystem.DTO.*;
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
    private final JwtService jwtService;

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

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        if (user.getUserStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("User account is not active");
        }

        String accessToken = jwtService.generateAccessToken(
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getEmail())
                        .password(user.getPassword())
                        .roles(user.getRole().name())
                        .build()
        );

        String refreshToken = jwtService.generateRefreshToken(
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getEmail())
                        .password(user.getPassword())
                        .roles(user.getRole().name())
                        .build()
        );

        return new LoginResponse(
                accessToken,
                refreshToken,
                jwtService.getTokenType(),
                jwtService.getAccessTokenExpiresIn(),
                user.getUsername(),
                user.getRole()
        );
    }

    public LoginResponse refreshToken(String refreshToken) {
        String email = jwtService.extractUsername(refreshToken);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!jwtService.isTokenValid(refreshToken, 
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getEmail())
                        .password(user.getPassword())
                        .roles(user.getRole().name())
                        .build())) {
            throw new RuntimeException("Invalid refresh token");
        }

        String newAccessToken = jwtService.generateAccessToken(
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getEmail())
                        .password(user.getPassword())
                        .roles(user.getRole().name())
                        .build()
        );

        String newRefreshToken = jwtService.generateRefreshToken(
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getEmail())
                        .password(user.getPassword())
                        .roles(user.getRole().name())
                        .build()
        );

        return new LoginResponse(
                newAccessToken,
                newRefreshToken,
                jwtService.getTokenType(),
                jwtService.getAccessTokenExpiresIn(),
                user.getUsername(),
                user.getRole()
        );
    }

    public MessageResponse logout(String token) {
        return new MessageResponse("Logged out successfully");
    }

    public MessageResponse forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String resetToken = java.util.UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(java.time.LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        return new MessageResponse("Password reset token sent to email");
    }

    public MessageResponse resetPassword(String email, String resetToken, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getResetToken() == null || !user.getResetToken().equals(resetToken)) {
            throw new RuntimeException("Invalid reset token");
        }

        if (user.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return new MessageResponse("Password reset successfully");
    }

    public MessageResponse changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return new MessageResponse("Password changed successfully");
    }

}
