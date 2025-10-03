package com.server.ResourceServer.controller;

import com.server.ResourceServer.dto.CreateUserRequest;
import com.server.ResourceServer.dto.UserDTO;
import com.server.ResourceServer.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    // Create a new user
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody CreateUserRequest request) {
        try {
            UserDTO createdUser = userService.createUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    
    // Get all users
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        try {
            UserDTO user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    
    // Get user by username
    @GetMapping("/username/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        try {
            UserDTO user = userService.getUserByUsername(username);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    
    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody CreateUserRequest request) {
        try {
            UserDTO updatedUser = userService.updateUser(id, request);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    
    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    
    // Add user to company
    @PostMapping("/{userId}/companies/{companyId}")
    public ResponseEntity<UserDTO> addUserToCompany(@PathVariable Long userId, @PathVariable Long companyId) {
        try {
            UserDTO user = userService.addUserToCompany(userId, companyId);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    
    // Remove user from company
    @DeleteMapping("/{userId}/companies/{companyId}")
    public ResponseEntity<UserDTO> removeUserFromCompany(@PathVariable Long userId, @PathVariable Long companyId) {
        try {
            UserDTO user = userService.removeUserFromCompany(userId, companyId);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    
    // Get all users by company
    @GetMapping("/company/{companyId}")
    public ResponseEntity<Set<UserDTO>> getUsersByCompany(@PathVariable Long companyId) {
        Set<UserDTO> users = userService.getUsersByCompany(companyId);
        return ResponseEntity.ok(users);
    }
    
    // Sync current authenticated user from Authorization Server
    @PostMapping("/sync")
    public ResponseEntity<UserDTO> syncCurrentUser(Authentication authentication) {
        try {
            String username = authentication.getName();
            // Extract additional info from authentication if available
            // For now, using basic info
            UserDTO syncedUser = userService.syncUserFromAuthServer(
                username, 
                username + "@example.com", 
                "FirstName", 
                "LastName"
            );
            return ResponseEntity.ok(syncedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    
    // Get current user info (from auth server)
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUserInfo(Authentication authentication) {
        try {
            String username = authentication.getName();
            UserDTO user = userService.getUserByUsername(username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("authorities", authentication.getAuthorities());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // User doesn't exist in resource server DB yet
            Map<String, Object> response = new HashMap<>();
            response.put("username", authentication.getName());
            response.put("authorities", authentication.getAuthorities());
            response.put("message", "User not synced yet. Call /api/users/sync to create user.");
            
            return ResponseEntity.ok(response);
        }
    }
}
