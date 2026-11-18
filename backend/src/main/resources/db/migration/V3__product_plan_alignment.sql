-- Aligns the schema with "Inspivia Complete Product and Development Plan v1.0".
-- Key change: mentors are ASSIGNED automatically (domain + availability + workload),
-- with a waitlist, admin override and audit trail.

-- ===== Student onboarding & portfolio =====
ALTER TABLE student_profiles
    ADD COLUMN experience_level VARCHAR(20) CHECK (experience_level IN ('BEGINNER','INTERMEDIATE','ADVANCED')),
    ADD COLUMN learning_style   VARCHAR(40),
    ADD COLUMN hours_per_week   SMALLINT CHECK (hours_per_week BETWEEN 1 AND 80),
    ADD COLUMN github_url       VARCHAR(300),
    ADD COLUMN linkedin_url     VARCHAR(300),
    ADD COLUMN portfolio_public BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN onboarding_completed_at TIMESTAMPTZ;

-- ===== Mentor assignment model =====
ALTER TABLE mentorships DROP CONSTRAINT mentorships_status_check;
ALTER TABLE mentorships ADD CONSTRAINT mentorships_status_check
    CHECK (status IN ('ACTIVE','COMPLETED','REASSIGNED','CANCELLED'));
DROP INDEX uq_mentorship_open_pair;
CREATE UNIQUE INDEX uq_mentorship_one_active_per_student ON mentorships (student_id) WHERE status = 'ACTIVE';
ALTER TABLE mentorships
    ADD COLUMN domain_id       UUID REFERENCES domains(id) ON DELETE SET NULL,
    ADD COLUMN origin          VARCHAR(20) NOT NULL DEFAULT 'AUTO' CHECK (origin IN ('AUTO','ADMIN')),
    ADD COLUMN reassigned_from UUID REFERENCES mentorships(id) ON DELETE SET NULL,
    ADD COLUMN reason          VARCHAR(1000);
CREATE INDEX idx_mentorships_domain ON mentorships (domain_id, status);

-- Students with no eligible mentor wait here; they are notified when matched.
CREATE TABLE match_waitlist (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID        NOT NULL REFERENCES student_profiles(user_id) ON DELETE CASCADE,
    domain_id  UUID        NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
    status     VARCHAR(20) NOT NULL CHECK (status IN ('WAITING','MATCHED','CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    matched_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX uq_waitlist_one_waiting ON match_waitlist (student_id) WHERE status = 'WAITING';
CREATE INDEX idx_waitlist_domain ON match_waitlist (domain_id, status, created_at);

-- Reassignment requests raised by students ("Students can request reassignment").
CREATE TABLE reassignment_requests (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentorship_id UUID         NOT NULL REFERENCES mentorships(id) ON DELETE CASCADE,
    requested_by  UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason        VARCHAR(1000) NOT NULL,
    status        VARCHAR(20)  NOT NULL CHECK (status IN ('OPEN','APPROVED','REJECTED')),
    resolved_by   UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at   TIMESTAMPTZ,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX uq_reassign_one_open ON reassignment_requests (mentorship_id) WHERE status = 'OPEN';

-- Mentor guidance shared with a student (notes, resources, feedback).
CREATE TABLE mentor_guidance (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentorship_id UUID         NOT NULL REFERENCES mentorships(id) ON DELETE CASCADE,
    author_id     UUID         NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    kind          VARCHAR(20)  NOT NULL CHECK (kind IN ('NOTE','RESOURCE','FEEDBACK')),
    body          VARCHAR(4000) NOT NULL,
    url           VARCHAR(500),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_guidance_mentorship ON mentor_guidance (mentorship_id, created_at DESC);

-- ===== Admin audit trail =====
CREATE TABLE audit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(60)  NOT NULL,
    entity_type VARCHAR(60)  NOT NULL,
    entity_id   UUID,
    detail      JSONB        NOT NULL DEFAULT '{}'::jsonb,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_entity ON audit_logs (entity_type, entity_id, created_at DESC);
CREATE INDEX idx_audit_actor  ON audit_logs (actor_id, created_at DESC);

-- ===== Feedback (required feature): replace V1 subject-based table with typed feedback =====
DROP TABLE feedback;
CREATE TABLE feedback (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id     UUID        NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    type          VARCHAR(20) NOT NULL CHECK (type IN ('MENTOR','LEARNING','PLATFORM','ISSUE')),
    mentorship_id UUID REFERENCES mentorships(id) ON DELETE SET NULL,
    rating        SMALLINT CHECK (rating BETWEEN 1 AND 5),
    helpfulness   SMALLINT CHECK (helpfulness BETWEEN 1 AND 5),
    comment       VARCHAR(4000) NOT NULL,
    anonymous     BOOLEAN     NOT NULL DEFAULT FALSE,  -- hides identity from the reviewed mentor, never from admins
    status        VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','IN_REVIEW','RESOLVED','DISMISSED')),
    reviewer_id   UUID REFERENCES users(id) ON DELETE SET NULL,
    review_note   VARCHAR(2000),
    reviewed_at   TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (type <> 'MENTOR' OR (mentorship_id IS NOT NULL AND rating IS NOT NULL))
);
CREATE INDEX idx_feedback_status ON feedback (status, type, created_at DESC);
CREATE INDEX idx_feedback_mentorship ON feedback (mentorship_id);

-- ===== Student-owned projects (distinct from the admin/mentor project catalogue) =====
CREATE TABLE student_projects (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id           UUID         NOT NULL REFERENCES student_profiles(user_id) ON DELETE CASCADE,
    catalogue_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    domain_id            UUID REFERENCES domains(id) ON DELETE SET NULL,
    title                VARCHAR(200) NOT NULL,
    description          VARCHAR(5000),
    status               VARCHAR(20)  NOT NULL CHECK (status IN ('PLANNED','IN_PROGRESS','COMPLETED')),
    repo_url             VARCHAR(500),
    deployment_url       VARCHAR(500),
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_student_projects_student ON student_projects (student_id, status);

-- ===== Resources, opportunities, bookmarks =====
CREATE TABLE resources (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(200) NOT NULL,
    description VARCHAR(2000),
    url         VARCHAR(500) NOT NULL,
    type        VARCHAR(20)  NOT NULL CHECK (type IN ('ARTICLE','VIDEO','COURSE','BOOK','DOCUMENTATION','OTHER')),
    domain_id   UUID REFERENCES domains(id) ON DELETE SET NULL,
    status      VARCHAR(20)  NOT NULL CHECK (status IN ('DRAFT','PUBLISHED','ARCHIVED')),
    created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_resources_filter ON resources (status, domain_id);

CREATE TABLE opportunities (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title        VARCHAR(200) NOT NULL,
    organization VARCHAR(160),
    type         VARCHAR(20)  NOT NULL CHECK (type IN ('INTERNSHIP','HACKATHON','COMPETITION','WORKSHOP','RESEARCH')),
    description  VARCHAR(5000),
    apply_url    VARCHAR(500),
    domain_id    UUID REFERENCES domains(id) ON DELETE SET NULL,
    location     VARCHAR(160),
    deadline     DATE,
    status       VARCHAR(20)  NOT NULL CHECK (status IN ('DRAFT','PUBLISHED','ARCHIVED')),
    created_by   UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_opportunities_filter ON opportunities (status, type, deadline);

CREATE TABLE bookmarks (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource_id    UUID REFERENCES resources(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (num_nonnulls(resource_id, opportunity_id) = 1)
);
CREATE UNIQUE INDEX uq_bookmark_resource    ON bookmarks (user_id, resource_id)    WHERE resource_id IS NOT NULL;
CREATE UNIQUE INDEX uq_bookmark_opportunity ON bookmarks (user_id, opportunity_id) WHERE opportunity_id IS NOT NULL;

-- ===== Teams (Release 7) =====
CREATE TABLE teams (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name               VARCHAR(120) NOT NULL,
    description        VARCHAR(2000),
    domain_id          UUID REFERENCES domains(id) ON DELETE SET NULL,
    owner_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    looking_for_members BOOLEAN NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE team_members (
    team_id   UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role      VARCHAR(10) NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('OWNER','MEMBER')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (team_id, user_id)
);

-- ===== Consent & public content =====
CREATE TABLE user_consents (
    user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    consent_type VARCHAR(40) NOT NULL CHECK (consent_type IN ('AI_CHAT_HISTORY')),
    granted      BOOLEAN     NOT NULL,
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, consent_type)
);

CREATE TABLE announcements (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title      VARCHAR(200)  NOT NULL,
    body       VARCHAR(5000) NOT NULL,
    published  BOOLEAN       NOT NULL DEFAULT FALSE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ   NOT NULL DEFAULT now()
);
