package com.project.librarymanagementsystem.Service;

import com.project.librarymanagementsystem.DTO.*;
import com.project.librarymanagementsystem.Entity.User;
import com.project.librarymanagementsystem.Enum.Role;
import com.project.librarymanagementsystem.Enum.UserStatus;
import com.project.librarymanagementsystem.Mapper.UserMapper;
import com.project.librarymanagementsystem.Repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private User user;
    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("encodedPassword");
        user.setRole(Role.MEMBER);
        user.setUserStatus(UserStatus.ACTIVE);

        registerRequest = new RegisterRequest(
                "testuser",
                "test@example.com",
                "password123",
                "John",
                "Doe",
                "1234567890"
        );
    }

    @Test
    void register_Success() {
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userMapper.toEntity(any())).thenReturn(user);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any())).thenReturn(user);
        when(userMapper.toResponse(any())).thenReturn(new RegisterResponse(1L, "testuser", "test@example.com", "John", "Doe", Role.MEMBER, UserStatus.ACTIVE, null));

        RegisterResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("testuser", response.username());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_UsernameExists_ThrowsException() {
        when(userRepository.existsByUsername(anyString())).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any());
    }

    @Test
    void register_EmailExists_ThrowsException() {
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_Success() {
        LoginRequest loginRequest = new LoginRequest("test@example.com", "password123");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtService.generateAccessToken(any())).thenReturn("accessToken");
        when(jwtService.generateRefreshToken(any())).thenReturn("refreshToken");
        when(jwtService.getTokenType()).thenReturn("Bearer");
        when(jwtService.getAccessTokenExpiresIn()).thenReturn(3600000L);

        LoginResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("accessToken", response.accessToken());
        assertEquals("Bearer", response.tokenType());
        verify(userRepository, times(1)).findByEmail(anyString());
    }

    @Test
    void login_InvalidEmail_ThrowsException() {
        LoginRequest loginRequest = new LoginRequest("invalid@example.com", "password123");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authService.login(loginRequest));
    }

    @Test
    void login_InvalidPassword_ThrowsException() {
        LoginRequest loginRequest = new LoginRequest("test@example.com", "wrongpassword");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        assertThrows(RuntimeException.class, () -> authService.login(loginRequest));
    }

    @Test
    void changePassword_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(passwordEncoder.encode(anyString())).thenReturn("newEncodedPassword");
        when(userRepository.save(any())).thenReturn(user);

        MessageResponse response = authService.changePassword("test@example.com", "oldPassword", "newPassword");

        assertNotNull(response);
        assertEquals("Password changed successfully", response.message());
        verify(userRepository, times(1)).save(any(User.class));
    }
}
