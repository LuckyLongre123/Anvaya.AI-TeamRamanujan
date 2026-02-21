# Anvaya.AI — Intelligent BRD Generation Platform

> **Team Ramanujan** · Hackathon Submission

Anvaya.AI is an end-to-end **AI-powered Business Requirements Document (BRD) generation platform**. It ingests raw project artifacts — uploaded files, stakeholder messaging — extracts structured facts, detects and resolves contradictions, and synthesises a polished, reviewable BRD using Google Gemini, all orchestrated through a clean pipeline UI.

---

## Table of Contents

1. [Features](#features)
2. [Architecture Overview](#architecture-overview)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
6. [Environment Variables](#environment-variables)
7. [API Reference](#api-reference)
8. [Data Models](#data-models)
9. [AI Pipeline Stages](#ai-pipeline-stages)
10. [Scripts](#scripts)
11. [Contributing](#contributing)
12. [License](#license)

---

## Features

| Feature | Description |
|---|---|
| 🔐 **User Authentication** | Register & login with role-based user profiles |
| 📁 **Project Management** | Create, read, update, and delete projects scoped to each user |
| 📎 **File Ingestion** | Upload up to 10 project files per request (PDFs, docs, etc.) |
| 🧑‍🤝‍🧑 **Stakeholder Mapping** | AI-driven extraction of stakeholders with role, influence & stance |
| 🗂️ **Fact Extraction** | Parse key facts from files and messaging sources with source attribution |
| ⚡ **Contradiction Detection** | Automatically surface conflicting facts across sources |
| ✅ **Contradiction Resolution** | Accept, override, or provide custom resolution reasoning |
| 📝 **BRD Generation** | Generate a full Business Requirements Document via Gemini AI |
| ✏️ **BRD Refinement** | Iteratively refine the BRD with follow-up prompts |
| 💾 **BRD Save** | Persist the final BRD markdown to the database |
| 🔄 **Pipeline Status** | Step-by-step progress tracking across the full pipeline |

---

## Architecture Overview

```
┌─────────────────────────────────────┐
│              Frontend               │
│     React 19 · Vite · TailwindCSS   │
│                                     │
│  Login / Signup → Dashboard         │
│  └── Project View (Pipeline UI)     │
│       ├── File Upload               │
│       ├── Stakeholder Mapping       │
│       ├── Fact Extraction           │
│       ├── Contradiction Detection   │
│       ├── Contradiction Resolution  │
│       └── BRD Generate / Refine     │
└──────────────────┬──────────────────┘
                   │ REST API (axios)
                   ▼
┌─────────────────────────────────────┐
│              Backend                │
│   Express · TypeScript · Prisma     │
│                                     │
│  /api/v1/users   → User Routes      │
│  /api/v1/projects → Project Routes  │
│       └── AI calls via @google/genai│
└──────────────────┬──────────────────┘
                   │ Prisma ORM
                   ▼
         ┌─────────────────┐
         │    MongoDB       │
         │  (Atlas / local) │
         └─────────────────┘
```

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript 5 |
| Framework | Express 4 |
| ORM | Prisma 5 (MongoDB provider) |
| Database | MongoDB |
| AI | Google Gemini (`@google/genai`) |
| Auth | bcrypt · jsonwebtoken |
| File Uploads | Multer |
| Validation | Zod |
| Security | Helmet · CORS |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Styling | TailwindCSS 4 |
| Routing | React Router DOM 7 |
| HTTP Client | Axios |
| UI Icons | Lucide React · React Icons |
| Notifications | Sonner |
| PDF Export | jsPDF · html2canvas |

---

## Project Structure

```
Anvaya.AI-TeamRamanujan/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # MongoDB schema (User, Project, Fact, …)
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.ts          # Prisma client singleton
│   │   ├── controllers/
│   │   │   ├── user.controller.ts
│   │   │   └── project.controller.ts  # Core AI pipeline logic
│   │   ├── lib/                   # Shared libraries / helpers
│   │   ├── routes/
│   │   │   ├── user.route.ts
│   │   │   └── project.route.ts
│   │   ├── utils/
│   │   │   ├── multer.ts          # File upload configuration
│   │   │   └── apiRes.util.ts     # Standardised API response wrapper
│   │   └── index.ts               # Express app entry point
│   ├── uploads/                   # Uploaded project files (local storage)
│   ├── .env.sample
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── apis/                  # Axios API call wrappers
    │   ├── assets/
    │   ├── components/
    │   │   ├── NavBar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── pipeline/          # Step-by-step pipeline components
    │   │   ├── dashboradSubcomponents/
    │   │   ├── projectSubComponents/
    │   │   ├── providers/         # React context providers
    │   │   └── utils/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── Project.jsx
    │   ├── App.jsx                # Route definitions
    │   ├── main.jsx
    │   └── main.css
    ├── index.html
    ├── vite.config.js
    ├── .env.sample
    └── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Google Gemini API Key** — obtain from [Google AI Studio](https://aistudio.google.com/app/apikey)

---

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.sample .env
# → Edit .env with your values (see Environment Variables section)

# 4. Generate Prisma client
npx prisma generate

# 5. Start the development server
npm run dev
```

The backend will start on **http://localhost:8000** (or the port set in `.env`).

> **Production build:**
> ```bash
> npm run build   # Compiles TypeScript → dist/
> npm run start   # Runs dist/index.js
> ```

---

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.sample .env
# → Set VITE_BACKEND_URL to your backend URL

# 4. Start the development server
npm run dev
```

The frontend will start on **http://localhost:5173**.

> **Production build:**
> ```bash
> npm run build   # Outputs to dist/
> npm run preview # Preview the production build locally
> ```

---

## Environment Variables

### `backend/.env`

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `8000` | Port for the Express server |
| `FRONTEND_URL` | Yes | `http://localhost:5173` | Allowed CORS origin |
| `DATABASE_URL` | Yes | — | MongoDB connection string |
| `GEMINI_API_KEY` | Yes | — | Google Gemini API key |

### `frontend/.env`

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_BACKEND_URL` | Yes | `http://localhost:8000` | Backend API base URL |

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### User Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/users` | Register a new user |
| `POST` | `/users/login` | Authenticate and login |
| `GET` | `/users` | Retrieve all users |
| `DELETE` | `/users/:id` | Delete a specific user |
| `DELETE` | `/users` | Delete all users |

### Project Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/projects` | Create a new project |
| `GET` | `/projects/user/:userId` | Get all projects for a user |
| `GET` | `/projects/:projectId` | Get a specific project by ID |
| `PUT` | `/projects/:projectId` | Update project details |
| `DELETE` | `/projects/:projectId` | Delete a project |

### AI Pipeline Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/projects/:projectId/files` | Upload project files (max 10) |
| `POST` | `/projects/:projectId/stakeholders` | AI: map stakeholders from files |
| `POST` | `/projects/:projectId/map-facts` | AI: extract facts from sources |
| `DELETE` | `/projects/:projectId/facts/:factId` | Delete a specific fact |
| `POST` | `/projects/:projectId/find-contradictions` | AI: detect contradictory facts |
| `POST` | `/projects/:projectId/resolve-contradiction` | AI: resolve a contradiction |
| `POST` | `/projects/:projectId/generate-brd` | AI: generate BRD document |
| `POST` | `/projects/:projectId/refine-brd` | AI: refine BRD with follow-up |
| `POST` | `/projects/:projectId/save-brd` | Save the final BRD to DB |
| `POST` | `/projects/:projectId/increament-status` | Advance pipeline step counter |

---

## Data Models

### User
```
id          ObjectId   (PK)
fullName    String
email       String     (unique)
password    String
desc        String?
role        String
createdAt   DateTime
updatedAt   DateTime
projects    Project[]
```

### Project
```
id                        ObjectId   (PK)
projectName               String
project_description       String
included_messaging_source String[]
files                     File[]
brdMdx                    String?    (generated BRD markdown)
status                    Int        (pipeline step 0–N)
userId                    ObjectId   (FK → User)
stakeholders              Stakeholder[]
facts                     Fact[]
contradictions            Contradiction[]
resolutions               Resolution[]
```

### Fact
```
id            ObjectId
content       Json
source        String
tone          String
when          DateTime
resolved      Boolean
sourceType    Enum (messaging | file)
stackHolderId ObjectId?
projectId     ObjectId   (FK → Project)
```

### Contradiction
```
id                   ObjectId
contradiction_facts  String[]
context              String
projectId            ObjectId   (FK → Project)
```

### Resolution
```
id               ObjectId
final_decision   String
winnerFactId     ObjectId?
custom_input     String
reasoning        String
contradiction_id ObjectId
projectId        ObjectId   (FK → Project)
```

---

## AI Pipeline Stages

The platform guides users through a sequential 6-stage AI pipeline:

```
Stage 0 → Upload Files
           ↓
Stage 1 → Map Stakeholders
           ↓
Stage 2 → Extract Facts
           ↓
Stage 3 → Detect Contradictions
           ↓
Stage 4 → Resolve Contradictions
           ↓
Stage 5 → Generate / Refine / Save BRD
```

Each stage advances the project's `status` field in the database, providing a resumable, stateful pipeline.

---

## Scripts

### Backend
| Command | Description |
|---|---|
| `npm run dev` | Start dev server with nodemon (hot reload) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run compiled production build |

### Frontend
| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed database with test data (`src/test/seed.js`) |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

Please follow the existing code style — TypeScript strict mode on the backend, consistent React component patterns on the frontend.

---

## License

This project is licensed under the **ISC License**.

---

<div align="center">
  <p>Built with ❤️ by <strong>Team Ramanujan</strong> for Anvaya.AI Hackathon</p>
</div>
