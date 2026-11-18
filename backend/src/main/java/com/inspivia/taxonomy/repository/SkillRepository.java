package com.inspivia.taxonomy.repository;

import com.inspivia.taxonomy.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SkillRepository extends JpaRepository<Skill, UUID> {
    Optional<Skill> findBySlug(String slug);
    List<Skill> findByDomainId(UUID domainId);
}
