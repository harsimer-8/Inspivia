package com.inspivia.profile.entity;

import com.inspivia.common.model.SkillLevel;
import com.inspivia.identity.entity.User;
import com.inspivia.taxonomy.entity.Domain;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    private UUID userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 200)
    private String college;

    @Column(nullable = false, length = 120)
    private String degree;

    @Column(name = "current_year", nullable = false)
    private short currentYear;

    @Column(name = "career_goals", length = 2000)
    private String careerGoals;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_domain_id")
    private Domain selectedDomain;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level", length = 20)
    private SkillLevel experienceLevel;

    @Column(name = "learning_style", length = 40)
    private String learningStyle;

    @Column(name = "hours_per_week")
    private Short hoursPerWeek;

    @Column(name = "github_url", length = 300)
    private String githubUrl;

    @Column(name = "linkedin_url", length = 300)
    private String linkedinUrl;

    @Column(name = "portfolio_public", nullable = false)
    private boolean portfolioPublic = false;

    @Column(name = "onboarding_completed_at")
    private Instant onboardingCompletedAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "student_interests",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "domain_id")
    )
    private Set<Domain> interests = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public StudentProfile() {}

    public StudentProfile(User user, String college, String degree, short currentYear) {
        this.user = user;
        this.userId = user.getId();
        this.college = college;
        this.degree = degree;
        this.currentYear = currentYear;
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; this.userId = user != null ? user.getId() : null; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public short getCurrentYear() { return currentYear; }
    public void setCurrentYear(short currentYear) { this.currentYear = currentYear; }

    public String getCareerGoals() { return careerGoals; }
    public void setCareerGoals(String careerGoals) { this.careerGoals = careerGoals; }

    public Domain getSelectedDomain() { return selectedDomain; }
    public void setSelectedDomain(Domain selectedDomain) { this.selectedDomain = selectedDomain; }

    public SkillLevel getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(SkillLevel experienceLevel) { this.experienceLevel = experienceLevel; }

    public String getLearningStyle() { return learningStyle; }
    public void setLearningStyle(String learningStyle) { this.learningStyle = learningStyle; }

    public Short getHoursPerWeek() { return hoursPerWeek; }
    public void setHoursPerWeek(Short hoursPerWeek) { this.hoursPerWeek = hoursPerWeek; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public boolean isPortfolioPublic() { return portfolioPublic; }
    public void setPortfolioPublic(boolean portfolioPublic) { this.portfolioPublic = portfolioPublic; }

    public Instant getOnboardingCompletedAt() { return onboardingCompletedAt; }
    public void setOnboardingCompletedAt(Instant onboardingCompletedAt) { this.onboardingCompletedAt = onboardingCompletedAt; }

    public Set<Domain> getInterests() { return interests; }
    public void setInterests(Set<Domain> interests) { this.interests = interests; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
