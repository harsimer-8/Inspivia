package com.inspivia.profile.entity;

import com.inspivia.identity.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "mentor_profiles")
public class MentorProfile {

    @Id
    private UUID userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "professional_title", nullable = false, length = 120)
    private String professionalTitle;

    @Column(nullable = false, length = 160)
    private String organization;

    @Column(name = "years_experience", nullable = false)
    private short yearsExperience;

    @Column(length = 2000)
    private String bio;

    @Column(name = "linkedin_url", length = 300)
    private String linkedinUrl;

    @Column(name = "max_mentees", nullable = false)
    private short maxMentees = 5;

    @Column(name = "accepting_mentees", nullable = false)
    private boolean acceptingMentees = true;

    @OneToMany(mappedBy = "mentor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MentorExpertise> expertise = new ArrayList<>();

    @OneToMany(mappedBy = "mentor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MentorAvailability> availability = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public MentorProfile() {}

    public MentorProfile(User user, String professionalTitle, String organization, short yearsExperience) {
        this.user = user;
        this.userId = user.getId();
        this.professionalTitle = professionalTitle;
        this.organization = organization;
        this.yearsExperience = yearsExperience;
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; this.userId = user != null ? user.getId() : null; }

    public String getProfessionalTitle() { return professionalTitle; }
    public void setProfessionalTitle(String professionalTitle) { this.professionalTitle = professionalTitle; }

    public String getOrganization() { return organization; }
    public void setOrganization(String organization) { this.organization = organization; }

    public short getYearsExperience() { return yearsExperience; }
    public void setYearsExperience(short yearsExperience) { this.yearsExperience = yearsExperience; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public short getMaxMentees() { return maxMentees; }
    public void setMaxMentees(short maxMentees) { this.maxMentees = maxMentees; }

    public boolean isAcceptingMentees() { return acceptingMentees; }
    public void setAcceptingMentees(boolean acceptingMentees) { this.acceptingMentees = acceptingMentees; }

    public List<MentorExpertise> getExpertise() { return expertise; }
    public void setExpertise(List<MentorExpertise> expertise) { this.expertise = expertise; }

    public List<MentorAvailability> getAvailability() { return availability; }
    public void setAvailability(List<MentorAvailability> availability) { this.availability = availability; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
