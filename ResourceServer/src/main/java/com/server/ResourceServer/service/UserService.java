package com.server.ResourceServer.service;

import com.server.ResourceServer.dto.CreateUserRequest;
import com.server.ResourceServer.dto.UserDTO;
import com.server.ResourceServer.model.Company;
import com.server.ResourceServer.model.User;
import com.server.ResourceServer.repository.CompanyRepository;
import com.server.ResourceServer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CompanyRepository companyRepository;
    
    // Create a new user
    public UserDTO createUser(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists: " + request.getUsername());
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }
        
        User user = new User(
            request.getUsername(),
            request.getEmail(),
            request.getFirstName(),
            request.getLastName()
        );
        
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }
    
    // Get all users
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    // Get user by ID
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return convertToDTO(user);
    }
    
    // Get user by username
    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        return convertToDTO(user);
    }
    
    // Update user
    public UserDTO updateUser(Long id, CreateUserRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        // Check if username is being changed and if it already exists
        if (!user.getUsername().equals(request.getUsername()) && 
            userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists: " + request.getUsername());
        }
        
        // Check if email is being changed and if it already exists
        if (!user.getEmail().equals(request.getEmail()) && 
            userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }
        
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }
    
    // Delete user
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        // Remove user from all companies before deleting
        for (Company company : user.getCompanies()) {
            company.getUsers().remove(user);
        }
        user.getCompanies().clear();
        
        userRepository.delete(user);
    }
    
    // Add user to company
    public UserDTO addUserToCompany(Long userId, Long companyId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Company company = companyRepository.findById(companyId)
            .orElseThrow(() -> new RuntimeException("Company not found with id: " + companyId));
        
        user.addCompany(company);
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }
    
    // Remove user from company
    public UserDTO removeUserFromCompany(Long userId, Long companyId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Company company = companyRepository.findById(companyId)
            .orElseThrow(() -> new RuntimeException("Company not found with id: " + companyId));
        
        user.removeCompany(company);
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }
    
    // Get all users by company
    public Set<UserDTO> getUsersByCompany(Long companyId) {
        return userRepository.findUsersByCompanyId(companyId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toSet());
    }
    
    // Sync user from Authorization Server
    public UserDTO syncUserFromAuthServer(String username, String email, String firstName, String lastName) {
        // Check if user already exists
        if (userRepository.existsByUsername(username)) {
            User existingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Update existing user information
            existingUser.setEmail(email);
            existingUser.setFirstName(firstName);
            existingUser.setLastName(lastName);
            
            User updatedUser = userRepository.save(existingUser);
            return convertToDTO(updatedUser);
        } else {
            // Create new user
            User newUser = new User(username, email, firstName, lastName);
            User savedUser = userRepository.save(newUser);
            return convertToDTO(savedUser);
        }
    }
    
    // Convert User entity to UserDTO
    private UserDTO convertToDTO(User user) {
        Set<Long> companyIds = user.getCompanies().stream()
            .map(Company::getId)
            .collect(Collectors.toSet());
        
        return new UserDTO(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getCreatedAt(),
            user.getUpdatedAt(),
            companyIds
        );
    }
}
