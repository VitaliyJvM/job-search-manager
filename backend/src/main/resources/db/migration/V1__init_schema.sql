-- ============================================================
-- Job Search Manager — V1 Initial Schema
-- ============================================================

CREATE TABLE companies
(
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    industry   VARCHAR(255),
    location   VARCHAR(255),
    website    VARCHAR(255),
    notes      TEXT,
    priority   INTEGER,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE job_applications
(
    id                   BIGSERIAL PRIMARY KEY,
    company_id           BIGINT REFERENCES companies (id) ON DELETE SET NULL,
    job_title            VARCHAR(255) NOT NULL,
    job_description      TEXT,
    status               VARCHAR(50)  NOT NULL DEFAULT 'INTERESTED',
    salary_range         VARCHAR(100),
    source_url           TEXT,
    resume_version_used  VARCHAR(255),
    applied_at           DATE,
    next_follow_up_at    DATE,
    notes                TEXT,
    created_at           TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE contacts
(
    id                BIGSERIAL PRIMARY KEY,
    company_id        BIGINT REFERENCES companies (id) ON DELETE SET NULL,
    full_name         VARCHAR(255) NOT NULL,
    role_title        VARCHAR(255),
    linkedin_url      TEXT,
    email             VARCHAR(255),
    relationship_type VARCHAR(50),
    notes             TEXT,
    created_at        TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE conversations
(
    id                BIGSERIAL PRIMARY KEY,
    contact_id        BIGINT REFERENCES contacts (id) ON DELETE CASCADE,
    channel           VARCHAR(50),
    message_direction VARCHAR(20),
    message_text      TEXT,
    conversation_date DATE,
    next_follow_up_at DATE,
    ai_suggested_reply TEXT,
    created_at        TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE prompt_templates
(
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    type        VARCHAR(50),
    prompt_text TEXT         NOT NULL,
    is_default  BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE resume_documents
(
    id                BIGSERIAL PRIMARY KEY,
    name              VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    content_text      TEXT,
    file_path         TEXT,
    is_master         BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE tailored_resumes
(
    id                  BIGSERIAL PRIMARY KEY,
    job_application_id  BIGINT REFERENCES job_applications (id) ON DELETE SET NULL,
    master_resume_id    BIGINT REFERENCES resume_documents (id) ON DELETE SET NULL,
    prompt_template_id  BIGINT REFERENCES prompt_templates (id) ON DELETE SET NULL,
    generated_content   TEXT,
    change_summary      TEXT,
    gaps_or_warnings    TEXT,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Seed: Default resume-tailoring prompt template
-- ============================================================
INSERT INTO prompt_templates (name, type, prompt_text, is_default)
VALUES ('Default Resume Tailoring',
        'RESUME_TAILORING',
        'You are a professional resume writer. Your task is to tailor the provided master resume to match the given job description.

STRICT RULES — YOU MUST FOLLOW THESE WITHOUT EXCEPTION:
1. DO NOT fabricate any experience, technologies, achievements, dates, companies, education, certifications, or metrics.
2. ONLY use facts that are explicitly present in the master resume.
3. If the job description requires skills or experience NOT present in the master resume, list them in "gapsOrWarnings" — do NOT add them to the resume.
4. You MAY reorder, rephrase, and emphasise existing content to better match the job description.
5. You MAY adjust the summary/objective section to align with the role, using only existing facts.
6. Keep formatting clean and professional.

Return your response as valid JSON with EXACTLY these three fields:
{
  "tailoredResume": "The complete tailored resume in Markdown format",
  "changeSummary": "A Markdown bullet list of every change you made and why",
  "gapsOrWarnings": "A Markdown bullet list of requirements from the job description that are NOT covered by the master resume"
}',
        TRUE);
