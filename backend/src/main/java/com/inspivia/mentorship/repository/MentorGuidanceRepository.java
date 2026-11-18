package com.inspivia.mentorship.repository;

import com.inspivia.mentorship.entity.MentorGuidance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MentorGuidanceRepository extends JpaRepository<MentorGuidance, UUID> {
    List<MentorGuidance> findByMentorshipIdOrderByCreatedAtDesc(UUID mentorshipId);
}
