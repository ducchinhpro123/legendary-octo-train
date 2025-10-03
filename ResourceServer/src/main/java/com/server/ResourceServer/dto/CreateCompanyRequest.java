package com.server.ResourceServer.dto;

public class CreateCompanyRequest {
    private String name;
    private String address;
    private String industry;
    private String companySize;
    
    // Constructors
    public CreateCompanyRequest() {}
    
    public CreateCompanyRequest(String name, String address, String industry, String companySize) {
        this.name = name;
        this.address = address;
        this.industry = industry;
        this.companySize = companySize;
    }
    
    // Getters and Setters
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
}
