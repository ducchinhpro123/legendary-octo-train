package com.server.ResourceServer.repository;

import com.server.ResourceServer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u JOIN FETCH u.companies WHERE u.id = :id")
    Optional<User> findByIdWithCompanies(@Param("id") Long id);
    
    @Query("SELECT u FROM User u JOIN u.companies c WHERE c.id = :companyId")
    Set<User> findUsersByCompanyId(@Param("companyId") Long companyId);
}
