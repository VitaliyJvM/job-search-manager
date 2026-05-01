# Job Search Manager

A production-quality single-user web application to manage your entire job search:

- **AI-powered resume tailoring** via OpenAI (no fabrication — only facts from your master resume)
- **Companies, Applications, Contacts, Conversations** — full CRUD
- **Prompt Library** — reusable AI prompt templates
- **Follow-up tracking** — overdue dates highlighted in the UI

---

## Tech Stack

| Layer          | Technology                                             |
| -------------- | ------------------------------------------------------ |
| Backend        | Java 25 · Spring Boot 3.3.5 · Spring Data JPA · Flyway |
| Database       | PostgreSQL 16                                          |
| AI             | OpenAI `gpt-4o` (JSON mode)                            |
| File Parsing   | Apache PDFBox 3.0 · Apache POI 5.3                     |
| Frontend       | React 18 · TypeScript · Vite · React Router v6 · Axios |
| Infrastructure | Docker Compose                                         |

---

## Prerequisites

- Java 25 (e.g. via [SDKMAN](https://sdkman.io/): `sdk install java 25-tem`)
- Node.js 20+ & npm
- Docker Desktop (for PostgreSQL)
- An OpenAI API key

---

## Quick Start

### 1. Configure environment

Create a `.env` file in the `backend/` directory. An `.env.example` is provided for reference:

```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
# Optional overrides:
# OPENAI_MODEL=gpt-4o
# POSTGRES_USER=jobsearch
# POSTGRES_PASSWORD=jobsearch
# UPLOAD_DIR=./uploads
```

> **Never commit your API key.** `.env` is already in `.gitignore`.

### 2. Install Frontend Dependencies (First Time Only)

```bash
cd frontend
npm install
cd ..
```

### 3. Start the Application

You can start the entire stack (PostgreSQL, Backend, and Frontend) simultaneously using the provided `Makefile`:

```bash
make start
```

The services will start in the background:
- PostgreSQL will run via Docker
- The API starts on **http://localhost:8080**. Flyway will apply the migration automatically.
- The UI starts on **http://localhost:5173** and proxies `/api` calls to the backend.

To view the live logs from both the backend and frontend, run:

```bash
make logs
```

### 4. Stop the Application

When you are done, you can gracefully stop all services (including the database) by running:

```bash
make stop
```

---

## Usage Guide

### Uploading your master resume

1. Go to **Resume Tailoring** → choose "Upload File" or "Paste Text"
2. Mark it as **Master Resume**
3. Supported formats: **PDF, DOCX, TXT**

### Tailoring a resume

1. Select your master resume
2. Either link a job application (with a saved job description) or paste one directly
3. Choose a prompt template (the default no-fabrication prompt is pre-loaded)
4. Click **Generate Tailored Resume**
5. Review the Tailored Resume, Change Summary, and Gaps/Warnings tabs

### Managing your pipeline

- **Companies** — track companies with priority and notes
- **Applications** — record each application, filter by status, track follow-up dates
- **Contacts** — link recruiters/engineers to companies
- **Conversations** — log every LinkedIn message, email, or call as a timeline

---

## API Endpoints

| Resource      | Base Path                                               |
| ------------- | ------------------------------------------------------- |
| Dashboard     | `GET /api/dashboard/stats`                              |
| Companies     | `/api/companies`                                        |
| Applications  | `/api/applications?status=APPLIED`                      |
| Contacts      | `/api/contacts?companyId=1`                             |
| Conversations | `/api/conversations?contactId=1`                        |
| Prompts       | `/api/prompts`                                          |
| Resumes       | `/api/resumes/upload` (multipart) · `/api/resumes/text` |
| Tailoring     | `POST /api/tailored-resumes/generate`                   |

---

## Project Structure

```
job-search-manager/
├── backend/                  ← Spring Boot 3 API
│   ├── build.gradle
│   ├── Dockerfile
│   └── src/main/
│       ├── java/com/jobsearch/manager/
│       │   ├── controller/
│       │   ├── service/
│       │   ├── repository/
│       │   ├── entity/
│       │   ├── dto/
│       │   ├── mapper/
│       │   ├── config/
│       │   └── exception/
│       └── resources/
│           ├── application.yml
│           └── db/migration/V1__init_schema.sql
├── frontend/                 ← React + TypeScript SPA
│   ├── package.json
│   └── src/
│       ├── api/
│       ├── components/
│       ├── pages/
│       ├── router/
│       └── types/
├── docker-compose.yml
└── README.md
```

---

## Docker (full stack)

To run everything in Docker:

```bash
# Build backend image
cd backend && docker build -t jobsearch-backend .

# Then update docker-compose.yml to include the backend service
docker compose up -d
```

---

## Environment Variables Reference

| Variable            | Default      | Description                         |
| ------------------- | ------------ | ----------------------------------- |
| `OPENAI_API_KEY`    | **required** | Your OpenAI secret key              |
| `OPENAI_MODEL`      | `gpt-4o`     | OpenAI model to use                 |
| `OPENAI_MAX_TOKENS` | `4096`       | Max tokens per generation           |
| `POSTGRES_USER`     | `jobsearch`  | DB username                         |
| `POSTGRES_PASSWORD` | `jobsearch`  | DB password                         |
| `UPLOAD_DIR`        | `./uploads`  | Directory for uploaded resume files |

---

## Security Notes

- No authentication is implemented (single-user local app)
- Never expose the backend port to the internet without auth
- The OpenAI API key is read from an environment variable and **never logged**

---

## License

MIT
