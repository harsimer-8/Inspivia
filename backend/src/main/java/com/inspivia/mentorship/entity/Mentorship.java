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
