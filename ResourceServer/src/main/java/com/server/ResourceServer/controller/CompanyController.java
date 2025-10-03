package com.server.ResourceServer.controller;

import com.server.ResourceServer.dto.CompanyDTO;
import com.server.ResourceServer.dto.CreateCompanyRequest;
import com.server.ResourceServer.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/companies")
public class CompanyController {
    
    @Autowired
    private CompanyService companyService;
    
    // Create a new company
    @PostMapping
    public ResponseEntity<CompanyDTO> createCompany(@RequestBody CreateCompanyRequest request) {
        try {
            CompanyDTO createdCompany = companyService.createCompany(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCompany);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    
    // Get all companies
    @GetMapping
    public ResponseEntity<List<CompanyDTO>> getAllCompanies() {
        List<CompanyDTO> companies = companyService.getAllCompanies();
        return ResponseEntity.ok(companies);
    }
    
    // Get company by ID
    @GetMapping("/{id}")
    public ResponseEntity<CompanyDTO> getCompanyById(@PathVariable Long id) {
        try {
            CompanyDTO company = companyService.getCompanyById(id);
            return ResponseEntity.ok(company);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    
    // Get company by name
    @GetMapping("/name/{name}")
    public ResponseEntity<CompanyDTO> getCompanyByName(@PathVariable String name) {
        try {
            CompanyDTO company = companyService.getCompanyByName(name);
            return ResponseEntity.ok(company);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    
    // Get companies by industry
    @GetMapping("/industry/{industry}")
    public ResponseEntity<Set<CompanyDTO>> getCompaniesByIndustry(@PathVariable String industry) {
        Set<CompanyDTO> companies = companyService.getCompaniesByIndustry(industry);
        return ResponseEntity.ok(companies);
    }
    
    // Update company
    @PutMapping("/{id}")
    public ResponseEntity<CompanyDTO> updateCompany(@PathVariable Long id, @RequestBody CreateCompanyRequest request) {
        try {
            CompanyDTO updatedCompany = companyService.updateCompany(id, request);
            return ResponseEntity.ok(updatedCompany);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    
    // Delete company
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCompany(@PathVariable Long id) {
        try {
            companyService.deleteCompany(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Company deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    
    // Add user to company
    @PostMapping("/{companyId}/users/{userId}")
    public ResponseEntity<CompanyDTO> addUserToCompany(@PathVariable Long companyId, @PathVariable Long userId) {
        try {
            CompanyDTO company = companyService.addUserToCompany(companyId, userId);
            return ResponseEntity.ok(company);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    
    // Remove user from company
    @DeleteMapping("/{companyId}/users/{userId}")
    public ResponseEntity<CompanyDTO> removeUserFromCompany(@PathVariable Long companyId, @PathVariable Long userId) {
        try {
            CompanyDTO company = companyService.removeUserFromCompany(companyId, userId);
            return ResponseEntity.ok(company);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    
    // Get all companies by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<Set<CompanyDTO>> getCompaniesByUser(@PathVariable Long userId) {
        Set<CompanyDTO> companies = companyService.getCompaniesByUser(userId);
        return ResponseEntity.ok(companies);
    }
}
