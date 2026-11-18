package com.inspivia.mentorship.repository;

import com.inspivia.common.model.ReassignmentStatus;
import com.inspivia.mentorship.entity.ReassignmentRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReassignmentRequestRepository extends JpaRepository<ReassignmentRequest, UUID> {
    Optional<ReassignmentRequest> findByMentorshipIdAndStatus(UUID mentorshipId, ReassignmentStatus status);
    Page<ReassignmentRequest> findByStatus(ReassignmentStatus status, Pageable pageable);
    long countByStatus(ReassignmentStatus status);
}
