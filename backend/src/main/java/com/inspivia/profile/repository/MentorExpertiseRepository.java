package com.inspivia.profile.repository;

import com.inspivia.profile.entity.MentorExpertise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MentorExpertiseRepository extends JpaRepository<MentorExpertise, UUID> {
    List<MentorExpertise> findByMentorUserId(UUID mentorId);
    void deleteByMentorUserId(UUID mentorId);
}
