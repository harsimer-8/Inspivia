package com.inspivia.profile.repository;

import com.inspivia.profile.entity.MentorProfile;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MentorProfileRepository extends JpaRepository<MentorProfile, UUID> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT m FROM MentorProfile m WHERE m.userId = :userId")
    Optional<MentorProfile> findByIdWithLock(UUID userId);

    @Query("""
        SELECT DISTINCT m FROM MentorProfile m
        JOIN m.user u
        JOIN MentorApplication a ON a.mentor.userId = m.userId
        JOIN m.expertise e
        WHERE u.status = 'ACTIVE'
          AND a.status = 'APPROVED'
          AND m.acceptingMentees = true
          AND e.domain.id = :domainId
          AND EXISTS (SELECT 1 FROM MentorAvailability av WHERE av.mentor.userId = m.userId)
    """)
    List<MentorProfile> findEligibleForDomain(UUID domainId);

    @Query("""
        SELECT DISTINCT m FROM MentorProfile m
        JOIN m.user u
        JOIN MentorApplication a ON a.mentor.userId = m.userId
        WHERE u.status = 'ACTIVE' AND a.status = 'APPROVED'
    """)
    Page<MentorProfile> findApprovedMentors(Pageable pageable);
}
