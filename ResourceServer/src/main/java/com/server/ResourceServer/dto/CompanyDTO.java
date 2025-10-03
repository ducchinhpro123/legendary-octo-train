package com.server.ResourceServer.dto;

import java.time.LocalDateTime;
import java.util.Set;

public class CompanyDTO {
    private Long id;
    private String name;
    private String address;
    private String industry;
    private String companySize;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<Long> userIds;
    
    // Constructors
    public CompanyDTO() {}
    
    public CompanyDTO(Long id, String name, String address, String industry, String companySize,
                      LocalDateTime createdAt, LocalDateTime updatedAt, Set<Long> userIds) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.industry = industry;
        this.companySize = companySize;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.userIds = userIds;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getIndustry() {
        return industry;
    }
    
    public void setIndustry(String industry) {
        this.industry = industry;
    }
    
    public String getCompanySize() {
        return companySize;
    }
    
    public void setCompanySize(String companySize) {
        this.companySize = companySize;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Set<Long> getUserIds() {
        return userIds;
    }
    
    public void setUserIds(Set<Long> userIds) {
        this.userIds = userIds;
    }
}
