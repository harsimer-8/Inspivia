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
