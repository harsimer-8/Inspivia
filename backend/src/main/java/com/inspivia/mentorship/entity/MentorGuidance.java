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
