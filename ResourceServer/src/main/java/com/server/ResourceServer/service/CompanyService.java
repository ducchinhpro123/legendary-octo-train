package com.server.ResourceServer.service;

import com.server.ResourceServer.dto.CompanyDTO;
import com.server.ResourceServer.dto.CreateCompanyRequest;
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
public class CompanyService {
    
    @Autowired
    private CompanyRepository companyRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Create a new company
    public CompanyDTO createCompany(CreateCompanyRequest request) {
        if (companyRepository.existsByName(request.getName())) {
            throw new RuntimeException("Company already exists with name: " + request.getName());
        }
        
        Company company = new Company(
            request.getName(),
            request.getAddress(),
            request.getIndustry(),
            request.getCompanySize()
        );
        
        Company savedCompany = companyRepository.save(company);
        return convertToDTO(savedCompany);
    }
    
    // Get all companies
    public List<CompanyDTO> getAllCompanies() {
        return companyRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    // Get company by ID
    public CompanyDTO getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
        return convertToDTO(company);
    }
    
    // Get company by name
    public CompanyDTO getCompanyByName(String name) {
        Company company = companyRepository.findByName(name)
            .orElseThrow(() -> new RuntimeException("Company not found with name: " + name));
        return convertToDTO(company);
    }
    
    // Get companies by industry
    public Set<CompanyDTO> getCompaniesByIndustry(String industry) {
        return companyRepository.findByIndustry(industry).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toSet());
    }
    
    // Update company
    public CompanyDTO updateCompany(Long id, CreateCompanyRequest request) {
        Company company = companyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
        
        // Check if name is being changed and if it already exists
        if (!company.getName().equals(request.getName()) && 
            companyRepository.existsByName(request.getName())) {
            throw new RuntimeException("Company already exists with name: " + request.getName());
        }
        
        company.setName(request.getName());
        company.setAddress(request.getAddress());
        company.setIndustry(request.getIndustry());
        company.setCompanySize(request.getCompanySize());
        
        Company updatedCompany = companyRepository.save(company);
        return convertToDTO(updatedCompany);
    }
    
    // Delete company
    public void deleteCompany(Long id) {
        Company company = companyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
        
        // Remove company from all users before deleting
        for (User user : company.getUsers()) {
            user.getCompanies().remove(company);
        }
        company.getUsers().clear();
        
        companyRepository.delete(company);
    }
    
    // Add user to company
    public CompanyDTO addUserToCompany(Long companyId, Long userId) {
        Company company = companyRepository.findById(companyId)
            .orElseThrow(() -> new RuntimeException("Company not found with id: " + companyId));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.addCompany(company);
        userRepository.save(user);
        
        return convertToDTO(company);
    }
    
    // Remove user from company
    public CompanyDTO removeUserFromCompany(Long companyId, Long userId) {
        Company company = companyRepository.findById(companyId)
            .orElseThrow(() -> new RuntimeException("Company not found with id: " + companyId));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.removeCompany(company);
        userRepository.save(user);
        
        return convertToDTO(company);
    }
    
    // Get all companies by user
    public Set<CompanyDTO> getCompaniesByUser(Long userId) {
        return companyRepository.findCompaniesByUserId(userId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toSet());
    }
    
    // Convert Company entity to CompanyDTO
    private CompanyDTO convertToDTO(Company company) {
        Set<Long> userIds = company.getUsers().stream()
            .map(User::getId)
            .collect(Collectors.toSet());
        
        return new CompanyDTO(
            company.getId(),
            company.getName(),
            company.getAddress(),
            company.getIndustry(),
            company.getCompanySize(),
            company.getCreatedAt(),
            company.getUpdatedAt(),
            userIds
        );
    }
}
