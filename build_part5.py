import os

BASE_DIR = r"c:\Users\HP\Desktop\HeatShield-Prototype-main.worktrees\inspivia-backend\inspivia\backend\src\main\java\com\inspivia"

def write(rel_path, content):
    full_path = os.path.join(BASE_DIR, rel_path.replace("/", os.sep))
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Wrote {rel_path}")

# ==========================================
# MENTORSHIP
# ==========================================
write("mentorship/entity/Mentorship.java", """
package com.inspivia.mentorship.entity;

import com.inspivia.common.model.MentorshipOrigin;
import com.inspivia.common.model.MentorshipStatus;
import com.inspivia.profile.entity.MentorProfile;
import com.inspivia.profile.entity.StudentProfile;
import com.inspivia.taxonomy.entity.Domain;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "mentorships")
public class Mentorship {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mentor_id", nullable = false)
    private MentorProfile mentor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "domain_id")
    private Domain domain;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MentorshipStatus status = MentorshipStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MentorshipOrigin origin = MentorshipOrigin.AUTO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reassigned_from")
    private Mentorship reassignedFrom;

    @Column(length = 1000)
    private String reason;

    @Column(length = 1000)
    private String message;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "ended_at")
    private Instant endedAt;

    @Version
    private Long version = 0L;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Mentorship() {}

    public Mentorship(StudentProfile student, MentorProfile mentor, Domain domain, MentorshipOrigin origin) {
        this.student = student;
        this.mentor = mentor;
        this.domain = domain;
        this.origin = origin;
        this.status = MentorshipStatus.ACTIVE;
        this.startedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public StudentProfile getStudent() { return student; }
    public void setStudent(StudentProfile student) { this.student = student; }

    public MentorProfile getMentor() { return mentor; }
    public void setMentor(MentorProfile mentor) { this.mentor = mentor; }

    public Domain getDomain() { return domain; }
    public void setDomain(Domain domain) { this.domain = domain; }

    public MentorshipStatus getStatus() { return status; }
    public void setStatus(MentorshipStatus status) { this.status = status; }

    public MentorshipOrigin getOrigin() { return origin; }
    public void setOrigin(MentorshipOrigin origin) { this.origin = origin; }

    public Mentorship getReassignedFrom() { return reassignedFrom; }
    public void setReassignedFrom(Mentorship reassignedFrom) { this.reassignedFrom = reassignedFrom; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }

    public Instant getEndedAt() { return endedAt; }
    public void setEndedAt(Instant endedAt) { this.endedAt = endedAt; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
""")

write("mentorship/entity/MentorshipSession.java", """
package com.inspivia.mentorship.entity;

import com.inspivia.common.model.SessionStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "mentorship_sessions")
public class MentorshipSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mentorship_id", nullable = false)
    private Mentorship mentorship;

    @Column(name = "scheduled_at", nullable = false)
    private Instant scheduledAt;

    @Column(name = "duration_min", nullable = false)
    private short durationMin;

    @Column(name = "meeting_url", length = 500)
    private String meetingUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SessionStatus status = SessionStatus.SCHEDULED;

    @Column(length = 4000)
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public MentorshipSession() {}

    public MentorshipSession(Mentorship mentorship, Instant scheduledAt, short durationMin, String meetingUrl) {
        this.mentorship = mentorship;
        this.scheduledAt = scheduledAt;
        this.durationMin = durationMin;
        this.meetingUrl = meetingUrl;
        this.status = SessionStatus.SCHEDULED;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Mentorship getMentorship() { return mentorship; }
    public void setMentorship(Mentorship mentorship) { this.mentorship = mentorship; }

    public Instant getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(Instant scheduledAt) { this.scheduledAt = scheduledAt; }

    public short getDurationMin() { return durationMin; }
    public void setDurationMin(short durationMin) { this.durationMin = durationMin; }

    public String getMeetingUrl() { return meetingUrl; }
    public void setMeetingUrl(String meetingUrl) { this.meetingUrl = meetingUrl; }

    public SessionStatus getStatus() { return status; }
    public void setStatus(SessionStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
""")

write("mentorship/entity/MentorGuidance.java", """
package com.inspivia.mentorship.entity;

import com.inspivia.common.model.GuidanceKind;
import com.inspivia.identity.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "mentor_guidance")
public class MentorGuidance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mentorship_id", nullable = false)
    private Mentorship mentorship;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private GuidanceKind kind;

    @Column(nullable = false, length = 4000)
    private String body;

    @Column(length = 500)
    private String url;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public MentorGuidance() {}

    public MentorGuidance(Mentorship mentorship, User author, GuidanceKind kind, String body, String url) {
        this.mentorship = mentorship;
        this.author = author;
        this.kind = kind;
        this.body = body;
        this.url = url;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Mentorship getMentorship() { return mentorship; }
    public void setMentorship(Mentorship mentorship) { this.mentorship = mentorship; }

    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }

    public GuidanceKind getKind() { return kind; }
    public void setKind(GuidanceKind kind) { this.kind = kind; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public Instant getCreatedAt() { return createdAt; }
}
""")

write("mentorship/entity/MatchWaitlist.java", """
package com.inspivia.mentorship.entity;

import com.inspivia.common.model.WaitlistStatus;
import com.inspivia.profile.entity.StudentProfile;
import com.inspivia.taxonomy.entity.Domain;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "match_waitlist")
public class MatchWaitlist {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "domain_id", nullable = false)
    private Domain domain;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WaitlistStatus status = WaitlistStatus.WAITING;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "matched_at")
    private Instant matchedAt;

    public MatchWaitlist() {}

    public MatchWaitlist(StudentProfile student, Domain domain) {
        this.student = student;
        this.domain = domain;
        this.status = WaitlistStatus.WAITING;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public StudentProfile getStudent() { return student; }
    public void setStudent(StudentProfile student) { this.student = student; }

    public Domain getDomain() { return domain; }
    public void setDomain(Domain domain) { this.domain = domain; }

    public WaitlistStatus getStatus() { return status; }
    public void setStatus(WaitlistStatus status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getMatchedAt() { return matchedAt; }
    public void setMatchedAt(Instant matchedAt) { this.matchedAt = matchedAt; }
}
""")

write("mentorship/entity/ReassignmentRequest.java", """
package com.inspivia.mentorship.entity;

import com.inspivia.common.model.ReassignmentStatus;
import com.inspivia.identity.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "reassignment_requests")
public class ReassignmentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mentorship_id", nullable = false)
    private Mentorship mentorship;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "requested_by", nullable = false)
    private User requestedBy;

    @Column(nullable = false, length = 1000)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReassignmentStatus status = ReassignmentStatus.OPEN;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by")
    private User resolvedBy;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public ReassignmentRequest() {}

    public ReassignmentRequest(Mentorship mentorship, User requestedBy, String reason) {
        this.mentorship = mentorship;
        this.requestedBy = requestedBy;
        this.reason = reason;
        this.status = ReassignmentStatus.OPEN;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Mentorship getMentorship() { return mentorship; }
    public void setMentorship(Mentorship mentorship) { this.mentorship = mentorship; }

    public User getRequestedBy() { return requestedBy; }
    public void setRequestedBy(User requestedBy) { this.requestedBy = requestedBy; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public ReassignmentStatus getStatus() { return status; }
    public void setStatus(ReassignmentStatus status) { this.status = status; }

    public User getResolvedBy() { return resolvedBy; }
    public void setResolvedBy(User resolvedBy) { this.resolvedBy = resolvedBy; }

    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }

    public Instant getCreatedAt() { return createdAt; }
}
""")

write("mentorship/repository/MentorshipRepository.java", """
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
""")

write("mentorship/repository/MentorshipSessionRepository.java", """
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
""")

write("mentorship/repository/MentorGuidanceRepository.java", """
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
""")

write("mentorship/repository/MatchWaitlistRepository.java", """
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
""")

write("mentorship/repository/ReassignmentRequestRepository.java", """
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
""")

print("Part 5 complete.")
