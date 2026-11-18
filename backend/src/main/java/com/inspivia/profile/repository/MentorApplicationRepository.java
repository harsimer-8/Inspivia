package com.inspivia.profile.repository;

import com.inspivia.common.model.MentorApplicationStatus;
import com.inspivia.profile.entity.MentorApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MentorApplicationRepository extends JpaRepository<MentorApplication, UUID> {
    Optional<MentorApplication> findFirstByMentorUserIdOrderByCreatedAtDesc(UUID mentorUserId);
    Optional<MentorApplication> findByMentorUserIdAndStatus(UUID mentorUserId, MentorApplicationStatus status);
    Page<MentorApplication> findByStatus(MentorApplicationStatus status, Pageable pageable);
    long countByStatus(MentorApplicationStatus status);
}
