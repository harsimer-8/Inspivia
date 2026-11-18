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
