package com.inspivia.mentorship.repository;

import com.inspivia.common.model.MentorshipStatus;
import com.inspivia.mentorship.entity.Mentorship;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MentorshipRepository extends JpaRepository<Mentorship, UUID> {
    Optional<Mentorship> findFirstByStudentUserIdAndStatus(UUID studentId, MentorshipStatus status);
    List<Mentorship> findByStudentUserId(UUID studentId);
    List<Mentorship> findByMentorUserId(UUID mentorId);
    List<Mentorship> findByMentorUserIdAndStatus(UUID mentorId, MentorshipStatus status);
    long countByMentorUserIdAndStatus(UUID mentorId, MentorshipStatus status);
    Page<Mentorship> findByStatus(MentorshipStatus status, Pageable pageable);

    @Query("SELECT COUNT(m) FROM Mentorship m WHERE m.status = 'ACTIVE'")
    long countActiveMentorships();
}
