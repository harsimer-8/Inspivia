import os

BASE_DIR = r"c:\Users\HP\Desktop\HeatShield-Prototype-main.worktrees\inspivia-backend\inspivia\backend\src\main\java\com\inspivia"

def write(rel_path, content):
    full_path = os.path.join(BASE_DIR, rel_path.replace("/", os.sep))
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Wrote {rel_path}")

# ==========================================
# TAXONOMY
# ==========================================
write("taxonomy/entity/Domain.java", """
package com.inspivia.taxonomy.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "domains")
public class Domain {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 80)
    private String slug;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Domain() {}

    public Domain(String slug, String name, String description) {
        this.slug = slug;
        this.name = name;
        this.description = description;
        this.active = true;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
""")

write("taxonomy/entity/Skill.java", """
package com.inspivia.taxonomy.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 80)
    private String slug;

    @Column(nullable = false, length = 120)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "domain_id")
    private Domain domain;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Skill() {}

    public Skill(String slug, String name, Domain domain) {
        this.slug = slug;
        this.name = name;
        this.domain = domain;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Domain getDomain() { return domain; }
    public void setDomain(Domain domain) { this.domain = domain; }

    public Instant getCreatedAt() { return createdAt; }
}
""")

write("taxonomy/entity/UserSkillId.java", """
package com.inspivia.taxonomy.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class UserSkillId implements Serializable {
    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "skill_id")
    private UUID skillId;

    public UserSkillId() {}

    public UserSkillId(UUID userId, UUID skillId) {
        this.userId = userId;
        this.skillId = skillId;
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public UUID getSkillId() { return skillId; }
    public void setSkillId(UUID skillId) { this.skillId = skillId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserSkillId that = (UserSkillId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(skillId, that.skillId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, skillId);
    }
}
""")

write("taxonomy/entity/UserSkill.java", """
package com.inspivia.taxonomy.entity;

import com.inspivia.common.model.SkillLevel;
import com.inspivia.identity.entity.User;
import jakarta.persistence.*;

@Entity
@Table(name = "user_skills")
public class UserSkill {

    @EmbeddedId
    private UserSkillId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("skillId")
    @JoinColumn(name = "skill_id")
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SkillLevel level = SkillLevel.BEGINNER;

    public UserSkill() {}

    public UserSkill(User user, Skill skill, SkillLevel level) {
        this.id = new UserSkillId(user.getId(), skill.getId());
        this.user = user;
        this.skill = skill;
        this.level = level != null ? level : SkillLevel.BEGINNER;
    }

    public UserSkillId getId() { return id; }
    public void setId(UserSkillId id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Skill getSkill() { return skill; }
    public void setSkill(Skill skill) { this.skill = skill; }

    public SkillLevel getLevel() { return level; }
    public void setLevel(SkillLevel level) { this.level = level; }
}
""")

write("taxonomy/repository/DomainRepository.java", """
package com.inspivia.taxonomy.repository;

import com.inspivia.taxonomy.entity.Domain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DomainRepository extends JpaRepository<Domain, UUID> {
    Optional<Domain> findBySlug(String slug);
    List<Domain> findByActiveTrueOrderByNameAsc();
    boolean existsBySlug(String slug);
}
""")

write("taxonomy/repository/SkillRepository.java", """
package com.inspivia.taxonomy.repository;

import com.inspivia.taxonomy.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SkillRepository extends JpaRepository<Skill, UUID> {
    Optional<Skill> findBySlug(String slug);
    List<Skill> findByDomainId(UUID domainId);
}
""")

write("taxonomy/repository/UserSkillRepository.java", """
package com.inspivia.taxonomy.repository;

import com.inspivia.taxonomy.entity.UserSkill;
import com.inspivia.taxonomy.entity.UserSkillId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, UserSkillId> {
    List<UserSkill> findByUserId(UUID userId);
    void deleteByUserId(UUID userId);
}
""")

# ==========================================
# PROFILES
# ==========================================
write("profile/entity/StudentProfile.java", """
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
""")

write("profile/entity/MentorProfile.java", """
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
""")

write("profile/entity/MentorApplication.java", """
package com.inspivia.profile.entity;

import com.inspivia.common.model.MentorApplicationStatus;
import com.inspivia.identity.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "mentor_applications")
public class MentorApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mentor_user_id", nullable = false)
    private MentorProfile mentor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MentorApplicationStatus status = MentorApplicationStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    @Column(name = "review_note", length = 1000)
    private String reviewNote;

    @Column(name = "reviewed_at")
    private Instant reviewedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public MentorApplication() {}

    public MentorApplication(MentorProfile mentor) {
        this.mentor = mentor;
        this.status = MentorApplicationStatus.PENDING;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public MentorProfile getMentor() { return mentor; }
    public void setMentor(MentorProfile mentor) { this.mentor = mentor; }

    public MentorApplicationStatus getStatus() { return status; }
    public void setStatus(MentorApplicationStatus status) { this.status = status; }

    public User getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(User reviewedBy) { this.reviewedBy = reviewedBy; }

    public String getReviewNote() { return reviewNote; }
    public void setReviewNote(String reviewNote) { this.reviewNote = reviewNote; }

    public Instant getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(Instant reviewedAt) { this.reviewedAt = reviewedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
""")

write("profile/entity/MentorExpertise.java", """
package com.inspivia.profile.entity;

import com.inspivia.taxonomy.entity.Domain;
import com.inspivia.taxonomy.entity.Skill;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "mentor_expertise")
public class MentorExpertise {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mentor_id", nullable = false)
    private MentorProfile mentor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "domain_id", nullable = false)
    private Domain domain;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id")
    private Skill skill;

    public MentorExpertise() {}

    public MentorExpertise(MentorProfile mentor, Domain domain, Skill skill) {
        this.mentor = mentor;
        this.domain = domain;
        this.skill = skill;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public MentorProfile getMentor() { return mentor; }
    public void setMentor(MentorProfile mentor) { this.mentor = mentor; }

    public Domain getDomain() { return domain; }
    public void setDomain(Domain domain) { this.domain = domain; }

    public Skill getSkill() { return skill; }
    public void setSkill(Skill skill) { this.skill = skill; }
}
""")

write("profile/entity/MentorAvailability.java", """
package com.inspivia.profile.entity;

import jakarta.persistence.*;

import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "mentor_availability")
public class MentorAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mentor_id", nullable = false)
    private MentorProfile mentor;

    @Column(name = "day_of_week", nullable = false)
    private short dayOfWeek; // 1-7

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(nullable = false, length = 50)
    private String timezone;

    public MentorAvailability() {}

    public MentorAvailability(MentorProfile mentor, short dayOfWeek, LocalTime startTime, LocalTime endTime, String timezone) {
        this.mentor = mentor;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.timezone = timezone;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public MentorProfile getMentor() { return mentor; }
    public void setMentor(MentorProfile mentor) { this.mentor = mentor; }

    public short getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(short dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }
}
""")

write("profile/repository/StudentProfileRepository.java", """
package com.inspivia.profile.repository;

import com.inspivia.profile.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, UUID> {
}
""")

write("profile/repository/MentorProfileRepository.java", """
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

    @Query(\"\"\"
        SELECT DISTINCT m FROM MentorProfile m
        JOIN m.user u
        JOIN MentorApplication a ON a.mentor.userId = m.userId
        JOIN m.expertise e
        WHERE u.status = 'ACTIVE'
          AND a.status = 'APPROVED'
          AND m.acceptingMentees = true
          AND e.domain.id = :domainId
          AND EXISTS (SELECT 1 FROM MentorAvailability av WHERE av.mentor.userId = m.userId)
    \"\"\")
    List<MentorProfile> findEligibleForDomain(UUID domainId);

    @Query(\"\"\"
        SELECT DISTINCT m FROM MentorProfile m
        JOIN m.user u
        JOIN MentorApplication a ON a.mentor.userId = m.userId
        WHERE u.status = 'ACTIVE' AND a.status = 'APPROVED'
    \"\"\")
    Page<MentorProfile> findApprovedMentors(Pageable pageable);
}
""")

write("profile/repository/MentorApplicationRepository.java", """
package com.inspivia.profile.repository;

import com.inspivia.common.model.MentorApplicationStatus;
import com.inspivia.profile.entity.MentorApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MentorApplicationRepository extends JpaRepository<MentorApplication, UUID> {
    Optional<MentorApplication> findFirstByMentorUserIdOrderByCreatedAtDesc(UUID mentorUserId);
    Optional<MentorApplication> findByMentorUserIdAndStatus(UUID mentorUserId, MentorApplicationStatus status);
    Page<MentorApplication> findByStatus(MentorApplicationStatus status, Pageable pageable);
    long countByStatus(MentorApplicationStatus status);
}
""")

write("profile/repository/MentorExpertiseRepository.java", """
package com.inspivia.profile.repository;

import com.inspivia.profile.entity.MentorExpertise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MentorExpertiseRepository extends JpaRepository<MentorExpertise, UUID> {
    List<MentorExpertise> findByMentorUserId(UUID mentorId);
    void deleteByMentorUserId(UUID mentorId);
}
""")

write("profile/repository/MentorAvailabilityRepository.java", """
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
""")

print("Part 4 complete.")
