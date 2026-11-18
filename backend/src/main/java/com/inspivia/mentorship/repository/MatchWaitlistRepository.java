package com.inspivia.mentorship.repository;

import com.inspivia.common.model.WaitlistStatus;
import com.inspivia.mentorship.entity.MatchWaitlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MatchWaitlistRepository extends JpaRepository<MatchWaitlist, UUID> {
    Optional<MatchWaitlist> findByStudentUserIdAndStatus(UUID studentId, WaitlistStatus status);
    List<MatchWaitlist> findByStatusOrderByCreatedAtAsc(WaitlistStatus status);
    Page<MatchWaitlist> findByStatus(WaitlistStatus status, Pageable pageable);
    long countByStatus(WaitlistStatus status);
}
