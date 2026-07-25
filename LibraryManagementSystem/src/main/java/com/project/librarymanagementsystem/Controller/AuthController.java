package com.project.librarymanagementsystem.Controller;

import com.project.librarymanagementsystem.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;


}
