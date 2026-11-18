package com.inspivia.taxonomy.repository;

import com.inspivia.taxonomy.entity.UserSkill;
import com.inspivia.taxonomy.entity.UserSkillId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, UserSkillId> {
    List<UserSkill> findByUserId(UUID userId);
    void deleteByUserId(UUID userId);
}
