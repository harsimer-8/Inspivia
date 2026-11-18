-- INSPIVIA core schema. UUID primary keys, timestamptz audit columns.
-- gen_random_uuid() is built in from PostgreSQL 13.

-- ===== Identity =====
CREATE TABLE users (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email             VARCHAR(254) NOT NULL,
    password_hash     VARCHAR(100) NOT NULL,
    full_name         VARCHAR(120) NOT NULL,
    role              VARCHAR(20)  NOT NULL CHECK (role IN ('STUDENT','MENTOR','ADMIN')),
    status            VARCHAR(30)  NOT NULL CHECK (status IN ('PENDING_VERIFICATION','ACTIVE','SUSPENDED','REJECTED')),
    email_verified_at TIMESTAMPTZ,
    last_login_at     TIMESTAMPTZ,
    version           BIGINT       NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX uq_users_email_lower ON users (lower(email));
CREATE INDEX idx_users_role_status ON users (role, status);

CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  CHAR(64)    NOT NULL UNIQUE,
    family_id   UUID        NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked_at  TIMESTAMPTZ,
    replaced_by UUID REFERENCES refresh_tokens(id) ON DELETE SET NULL,
    user_agent  VARCHAR(255),
    ip_address  VARCHAR(45),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_family ON refresh_tokens (family_id);

CREATE TABLE email_verification_tokens (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash CHAR(64)    NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at    TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_email_verif_user ON email_verification_tokens (user_id);

CREATE TABLE password_reset_tokens (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash CHAR(64)    NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at    TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_pwd_reset_user ON password_reset_tokens (user_id);

-- ===== Taxonomy =====
CREATE TABLE domains (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        VARCHAR(80)  NOT NULL UNIQUE,
    name        VARCHAR(120) NOT NULL,
    description VARCHAR(500),
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE skills (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug       VARCHAR(80)  NOT NULL UNIQUE,
    name       VARCHAR(120) NOT NULL,
    domain_id  UUID REFERENCES domains(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_skills_domain ON skills (domain_id);

-- ===== Profiles =====
CREATE TABLE student_profiles (
    user_id            UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    college            VARCHAR(200) NOT NULL,
    degree             VARCHAR(120) NOT NULL,
    current_year       SMALLINT     NOT NULL CHECK (current_year BETWEEN 1 AND 8),
    career_goals       VARCHAR(2000),
    selected_domain_id UUID REFERENCES domains(id) ON DELETE SET NULL,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE student_interests (
    student_id UUID NOT NULL REFERENCES student_profiles(user_id) ON DELETE CASCADE,
    domain_id  UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
    PRIMARY KEY (student_id, domain_id)
);

CREATE TABLE mentor_profiles (
    user_id            UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    professional_title VARCHAR(120) NOT NULL,
    organization       VARCHAR(160) NOT NULL,
    years_experience   SMALLINT     NOT NULL CHECK (years_experience >= 0),
    bio                VARCHAR(2000),
    linkedin_url       VARCHAR(300),
    max_mentees        SMALLINT     NOT NULL DEFAULT 5 CHECK (max_mentees BETWEEN 1 AND 50),
    accepting_mentees  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE mentor_applications (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_user_id UUID        NOT NULL REFERENCES mentor_profiles(user_id) ON DELETE CASCADE,
    status         VARCHAR(20) NOT NULL CHECK (status IN ('PENDING','APPROVED','REJECTED')),
    reviewed_by    UUID REFERENCES users(id) ON DELETE SET NULL,
    review_note    VARCHAR(1000),
    reviewed_at    TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX uq_mentor_app_one_pending ON mentor_applications (mentor_user_id) WHERE status = 'PENDING';
CREATE INDEX idx_mentor_app_status ON mentor_applications (status, created_at);

CREATE TABLE user_skills (
    user_id  UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID        NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    level    VARCHAR(20) NOT NULL DEFAULT 'BEGINNER' CHECK (level IN ('BEGINNER','INTERMEDIATE','ADVANCED')),
    PRIMARY KEY (user_id, skill_id)
);
CREATE INDEX idx_user_skills_skill ON user_skills (skill_id);

CREATE TABLE mentor_expertise (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES mentor_profiles(user_id) ON DELETE CASCADE,
    domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
    skill_id  UUID REFERENCES skills(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX uq_mentor_expertise ON mentor_expertise (mentor_id, domain_id, COALESCE(skill_id, '00000000-0000-0000-0000-000000000000'::uuid));
CREATE INDEX idx_mentor_expertise_domain ON mentor_expertise (domain_id);

CREATE TABLE mentor_availability (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id   UUID        NOT NULL REFERENCES mentor_profiles(user_id) ON DELETE CASCADE,
    day_of_week SMALLINT    NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    start_time  TIME        NOT NULL,
    end_time    TIME        NOT NULL,
    timezone    VARCHAR(50) NOT NULL,
    CHECK (start_time < end_time)
);
CREATE INDEX idx_mentor_availability_mentor ON mentor_availability (mentor_id);

-- ===== Mentorship =====
CREATE TABLE mentorships (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID        NOT NULL REFERENCES student_profiles(user_id) ON DELETE RESTRICT,
    mentor_id  UUID        NOT NULL REFERENCES mentor_profiles(user_id)  ON DELETE RESTRICT,
    status     VARCHAR(20) NOT NULL CHECK (status IN ('REQUESTED','ACTIVE','DECLINED','COMPLETED','CANCELLED')),
    message    VARCHAR(1000),
    started_at TIMESTAMPTZ,
    ended_at   TIMESTAMPTZ,
    version    BIGINT      NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX uq_mentorship_open_pair ON mentorships (student_id, mentor_id) WHERE status IN ('REQUESTED','ACTIVE');
CREATE INDEX idx_mentorships_mentor_status ON mentorships (mentor_id, status);
CREATE INDEX idx_mentorships_student_status ON mentorships (student_id, status);

CREATE TABLE mentorship_sessions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentorship_id UUID        NOT NULL REFERENCES mentorships(id) ON DELETE RESTRICT,
    scheduled_at  TIMESTAMPTZ NOT NULL,
    duration_min  SMALLINT    NOT NULL CHECK (duration_min BETWEEN 15 AND 240),
    meeting_url   VARCHAR(500),
    status        VARCHAR(20) NOT NULL CHECK (status IN ('SCHEDULED','COMPLETED','CANCELLED','NO_SHOW')),
    notes         VARCHAR(4000),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_sessions_mentorship ON mentorship_sessions (mentorship_id, scheduled_at);

-- ===== Projects =====
CREATE TABLE projects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        VARCHAR(160) NOT NULL UNIQUE,
    title       VARCHAR(200) NOT NULL,
    description VARCHAR(5000) NOT NULL,
    domain_id   UUID REFERENCES domains(id) ON DELETE SET NULL,
    difficulty  VARCHAR(20)  NOT NULL CHECK (difficulty IN ('BEGINNER','INTERMEDIATE','ADVANCED')),
    status      VARCHAR(20)  NOT NULL CHECK (status IN ('DRAFT','PUBLISHED','ARCHIVED')),
    est_hours   SMALLINT CHECK (est_hours > 0),
    created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_projects_filter ON projects (status, domain_id, difficulty);

CREATE TABLE project_technologies (
    project_id UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name       VARCHAR(80) NOT NULL,
    PRIMARY KEY (project_id, name)
);

CREATE TABLE project_milestones (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  UUID         NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    position    SMALLINT     NOT NULL CHECK (position > 0),
    title       VARCHAR(200) NOT NULL,
    description VARCHAR(2000),
    UNIQUE (project_id, position)
);

CREATE TABLE project_tasks (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    milestone_id UUID         NOT NULL REFERENCES project_milestones(id) ON DELETE CASCADE,
    position     SMALLINT     NOT NULL CHECK (position > 0),
    title        VARCHAR(200) NOT NULL,
    description  VARCHAR(2000),
    UNIQUE (milestone_id, position)
);

CREATE TABLE project_enrollments (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id   UUID        NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
    student_id   UUID        NOT NULL REFERENCES student_profiles(user_id) ON DELETE CASCADE,
    status       VARCHAR(20) NOT NULL CHECK (status IN ('ACTIVE','COMPLETED','DROPPED')),
    enrolled_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    UNIQUE (project_id, student_id)
);
CREATE INDEX idx_enrollments_student ON project_enrollments (student_id, status);

CREATE TABLE task_submissions (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id        UUID        NOT NULL REFERENCES project_tasks(id) ON DELETE CASCADE,
    enrollment_id  UUID        NOT NULL REFERENCES project_enrollments(id) ON DELETE CASCADE,
    content        VARCHAR(5000),
    link_url       VARCHAR(500),
    status         VARCHAR(20) NOT NULL CHECK (status IN ('SUBMITTED','CHANGES_REQUESTED','APPROVED')),
    reviewer_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    review_comment VARCHAR(2000),
    submitted_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_at    TIMESTAMPTZ,
    CHECK (content IS NOT NULL OR link_url IS NOT NULL)
);
CREATE INDEX idx_submissions_enrollment ON task_submissions (enrollment_id, task_id);

-- ===== Roadmaps (content generated by the AI service, stored and owned here) =====
CREATE TABLE roadmaps (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id   UUID         NOT NULL REFERENCES student_profiles(user_id) ON DELETE CASCADE,
    domain_id    UUID REFERENCES domains(id) ON DELETE SET NULL,
    title        VARCHAR(200) NOT NULL,
    summary      VARCHAR(2000),
    status       VARCHAR(20)  NOT NULL CHECK (status IN ('ACTIVE','ARCHIVED')),
    source       VARCHAR(20)  NOT NULL CHECK (source IN ('AI','MENTOR','MANUAL')),
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_roadmaps_student ON roadmaps (student_id, status, created_at DESC);

CREATE TABLE roadmap_steps (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id   UUID         NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
    position     SMALLINT     NOT NULL CHECK (position > 0),
    title        VARCHAR(200) NOT NULL,
    description  VARCHAR(2000),
    resources    JSONB        NOT NULL DEFAULT '[]'::jsonb,
    est_weeks    SMALLINT CHECK (est_weeks > 0),
    status       VARCHAR(20)  NOT NULL DEFAULT 'TODO' CHECK (status IN ('TODO','IN_PROGRESS','DONE')),
    completed_at TIMESTAMPTZ,
    UNIQUE (roadmap_id, position)
);

-- ===== Feedback =====
CREATE TABLE feedback (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentorship_id UUID REFERENCES mentorships(id) ON DELETE CASCADE,
    session_id    UUID REFERENCES mentorship_sessions(id) ON DELETE CASCADE,
    project_id    UUID REFERENCES projects(id) ON DELETE CASCADE,
    author_id     UUID        NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    direction     VARCHAR(30) NOT NULL CHECK (direction IN ('STUDENT_TO_MENTOR','MENTOR_TO_STUDENT','MENTOR_REVIEW')),
    rating        SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment       VARCHAR(2000),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (num_nonnulls(mentorship_id, session_id, project_id) = 1)
);
CREATE UNIQUE INDEX uq_feedback_mentorship ON feedback (mentorship_id, author_id, direction) WHERE mentorship_id IS NOT NULL;
CREATE UNIQUE INDEX uq_feedback_session    ON feedback (session_id, author_id, direction)    WHERE session_id IS NOT NULL;
CREATE UNIQUE INDEX uq_feedback_project    ON feedback (project_id, author_id, direction)    WHERE project_id IS NOT NULL;

-- ===== Platform =====
CREATE TABLE contact_inquiries (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(120)  NOT NULL,
    email       VARCHAR(254)  NOT NULL,
    category    VARCHAR(30)   NOT NULL CHECK (category IN ('GENERAL','STUDENT_SUPPORT','MENTOR_ONBOARDING','PARTNERSHIP','TECHNICAL_ISSUE','FEEDBACK')),
    message     VARCHAR(5000) NOT NULL,
    status      VARCHAR(20)   NOT NULL CHECK (status IN ('NEW','IN_PROGRESS','RESOLVED','SPAM')),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    admin_note  VARCHAR(2000),
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);
CREATE INDEX idx_inquiries_status ON contact_inquiries (status, created_at DESC);

CREATE TABLE notifications (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type       VARCHAR(40)  NOT NULL,
    title      VARCHAR(200) NOT NULL,
    body       VARCHAR(1000),
    read_at    TIMESTAMPTZ,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_notifications_user ON notifications (user_id, read_at, created_at DESC);

CREATE TABLE ai_conversations (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title      VARCHAR(200),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_conv_user ON ai_conversations (user_id, updated_at DESC);

CREATE TABLE ai_messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID        NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('USER','ASSISTANT')),
    content         TEXT        NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_msg_conv ON ai_messages (conversation_id, created_at);
