package com.inspivia.profile.repository;

import com.inspivia.profile.entity.MentorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MentorAvailabilityRepository extends JpaRepository<MentorAvailability, UUID> {
    List<MentorAvailability> findByMentorUserId(UUID mentorId);
    void deleteByMentorUserId(UUID mentorId);
}
