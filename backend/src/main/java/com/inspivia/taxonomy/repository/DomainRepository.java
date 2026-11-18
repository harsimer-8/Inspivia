package com.inspivia.taxonomy.repository;

import com.inspivia.taxonomy.entity.Domain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DomainRepository extends JpaRepository<Domain, UUID> {
    Optional<Domain> findBySlug(String slug);
    List<Domain> findByActiveTrueOrderByNameAsc();
    boolean existsBySlug(String slug);
}
