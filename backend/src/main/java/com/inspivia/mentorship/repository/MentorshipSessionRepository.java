package com.inspivia.mentorship.repository;

import com.inspivia.mentorship.entity.MentorshipSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MentorshipSessionRepository extends JpaRepository<MentorshipSession, UUID> {
    List<MentorshipSession> findByMentorshipIdOrderByScheduledAtDesc(UUID mentorshipId);
}
