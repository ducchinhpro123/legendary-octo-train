package com.server.ResourceServer.repository;

import com.server.ResourceServer.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    
    Optional<Company> findByName(String name);
    
    boolean existsByName(String name);
    
    Set<Company> findByIndustry(String industry);
    
    @Query("SELECT c FROM Company c JOIN FETCH c.users WHERE c.id = :id")
    Optional<Company> findByIdWithUsers(@Param("id") Long id);
    
    @Query("SELECT c FROM Company c JOIN c.users u WHERE u.id = :userId")
    Set<Company> findCompaniesByUserId(@Param("userId") Long userId);
}
