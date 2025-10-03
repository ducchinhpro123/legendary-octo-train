package com.server.AuthorizationServer.controller;

import java.util.HashMap;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.AuthorizationServer.dto.LoginRequest;
import com.server.AuthorizationServer.dto.MessageResponse;
import com.server.AuthorizationServer.dto.SignupRequest;
import com.server.AuthorizationServer.models.User;
import com.server.AuthorizationServer.repository.UserRepository;

import java.util.logging.Logger;

@RestController
@RequestMapping("/api/auth")
// @CrossOrigin(origins = "http://localhost:5173/**")
public class AuthController {

    private final Logger logger = Logger.getLogger(AuthController.class.getName());
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    // @PostMapping("/login")
    // public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
    // }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {

        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                passwordEncoder.encode(signUpRequest.getPassword()),
                "ADMIN");

        userRepository.save(user);
        logger.info("Register a new user with username: " + user.getUsername());

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    // @PostMapping("/logout")
    // public ResponseEntity<Map<String, String>> logout(
    //         @RequestBody Map<String, String> request,
    //         HttpServletRequest httpRequest) {
    // }
}
