package com.project.librarymanagementsystem.Controller;

import com.project.librarymanagementsystem.DTO.ChangePasswordRequest;
import com.project.librarymanagementsystem.DTO.ForgotPasswordRequest;
import com.project.librarymanagementsystem.DTO.LoginRequest;
import com.project.librarymanagementsystem.DTO.LoginResponse;
import com.project.librarymanagementsystem.DTO.MessageResponse;
import com.project.librarymanagementsystem.DTO.ProfileResponse;
import com.project.librarymanagementsystem.DTO.RefreshTokenRequest;
import com.project.librarymanagementsystem.DTO.RegisterRequest;
import com.project.librarymanagementsystem.DTO.RegisterResponse;
import com.project.librarymanagementsystem.DTO.ResetPasswordRequest;
import com.project.librarymanagementsystem.DTO.UpdateProfileRequest;
import com.project.librarymanagementsystem.Service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest register){
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(register));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest login){
        return ResponseEntity.ok(authService.login(login));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<LoginResponse> refreshToken(@RequestBody RefreshTokenRequest request){
        return ResponseEntity.ok(authService.refreshToken(request.refreshToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(@RequestBody RefreshTokenRequest request){
        return ResponseEntity.ok(authService.logout(request.refreshToken()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@RequestBody ForgotPasswordRequest request){
        return ResponseEntity.ok(authService.forgotPassword(request.email()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@RequestBody ResetPasswordRequest request){
        return ResponseEntity.ok(authService.resetPassword(request.email(), request.resetToken(), request.newPassword()));
    }

    @PostMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(@RequestBody ChangePasswordRequest request){
        return ResponseEntity.ok(authService.changePassword(request.email(), request.oldPassword(), request.newPassword()));
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile(@RequestParam String email){
        return ResponseEntity.ok(authService.getProfile(email));
    }

    @PutMapping("/profile")
    public ResponseEntity<ProfileResponse> updateProfile(@RequestParam String email, @RequestBody UpdateProfileRequest request){
        return ResponseEntity.ok(authService.updateProfile(email, request));
    }

    @DeleteMapping("/account")
    public ResponseEntity<MessageResponse> deleteAccount(@RequestParam String email){
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(authService.deleteAccount(email));
    }

}
