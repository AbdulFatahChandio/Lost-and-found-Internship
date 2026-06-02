# Lost & Found API

A backend API for reporting lost and found items. Users can create posts, comment in threads, react to posts, and receive **automatic background matches** when a lost item may correspond to a found one.

Built with **NestJS**, **PostgreSQL**, **Prisma**, and **Redis + BullMQ** for parallel item matching.

**Author:** [Abdul Fatah Chandio](https://github.com/AbdulFatahChandio)  
**Repository:** [Lost-and-found-Internship](https://github.com/AbdulFatahChandio/Lost-and-found-Internship)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Overview](#api-overview)
- [Background Matching](#background-matching)
- [Database Schema](#database-schema)
- [Docker](#docker)
- [Scripts](#scripts)
- [Documentation](#documentation)
- [License](#license)

---

## Features

| Area | Description |
|------|-------------|
| **Authentication** | Sign up, login, JWT-based sessions |
| **Roles** | Role-based users (`admin`, `user`) |
| **Posts** | Create LOST or FOUND item posts with search and pagination |
| **Comments** | Nested replies with soft delete |
| **Reactions** | LIKE / SAD reactions (one per user per post) |
| **Item matching** | Background workers compare LOST posts against FOUND posts |
| **Matches API** | View and manage potential matches with similarity scores |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | NestJS 11 |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma 6 |
| Queue | Redis + BullMQ |
| Auth | JWT, Passport, bcrypt |
| API docs | Swagger |
| Containerization | Docker, Docker Compose |

---

## Project Structure

```
Lost-and-found-Internship/
├── prisma/
│   ├── schema.prisma          # Database models
│   ├── migrations/            # SQL migrations
│   └── seed/                  # Role seed data
├── src/
│   ├── main.ts                # API entry point
│   ├── worker.main.ts         # Matching worker entry point
│   ├── app.module.ts
│   └── modules/
│       ├── auth/              # Signup, login, JWT
│       ├── post/              # LOST / FOUND posts
│       ├── comments/          # Threaded comments
│       ├── reaction/          # Post reactions
│       └── matching/          # Queue, workers, matches API
├── docker-compose.yml
├── Dockerfile
├── MATCHING_SETUP.md          # Detailed matching worker guide
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL
- Redis 7+ (required for item matching)

### Installation

```bash
# Clone the repository
git clone https://github.com/AbdulFatahChandio/Lost-and-found-Internship.git
cd Lost-and-found-Internship

# Install dependencies
pnpm install

# Create .env file (see Environment Variables section below)

# Run migrations and seed roles
npx prisma migrate dev
npx prisma db seed
```

---

## Environment Variables

Create a `.env` file in the project root. Do **not** commit it to version control.

```env
# Application
NODE_ENV=development
PORT=4055

# Database
DATABASE_URL="postgresql://root:rootpassword@localhost:5432/lost-and-found?schema=public"

# JWT
JWT_SECRET=your-32-character-secret-here
JWT_EXPIRY=24

# Redis (required for background matching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Docker (optional)
REDIS_CONTAINER_NAME=redis-lost-and-found
DOCKER_DEVELOPMENT_CONTAINER_NAME=lost-and-found-dev
DOCKER_WORKER_CONTAINER_NAME=lost-and-found-worker
DOCKER_STAGING_CONTAINER_NAME=lost-and-found-stag
DOCKER_PRODUCTION_CONTAINER_NAME=lost-and-found-prod
```

> **Note:** The app reads `JWT_SECRET` for token signing. Keep the secret at least 32 characters long.

---

## Running the Application

### 1. Start Redis

```bash
docker run -d --name redis-lost-and-found -p 6379:6379 redis:7-alpine
```

### 2. Start the API

```bash
pnpm run start:dev
```

| Resource | URL |
|----------|-----|
| API base | `http://localhost:4055/api/v1` |
| Swagger docs | `http://localhost:4055/api-docs/v1` |

### 3. Start the matching worker

Matching runs in a **separate process**. Open a second terminal:

```bash
pnpm run start:worker
```

Run additional worker terminals to scale parallel processing.

---

## API Overview

All routes use the prefix `/api/v1`.

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | No | Register a new user |
| POST | `/auth/login` | No | Login and receive JWT |

### Posts

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/posts` | Yes | Create a LOST or FOUND post |
| GET | `/posts` | No | List posts (filter, search, paginate) |
| GET | `/posts/lost` | No | List LOST posts only |
| GET | `/posts/found` | No | List FOUND posts only |
| GET | `/posts/:id` | No | Get a single post |
| PATCH | `/posts/:id` | Yes | Update post (creator only) |
| DELETE | `/posts/:id` | Yes | Soft delete (creator only) |

### Comments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/comments` | Yes | Create a comment or reply |
| GET | `/comments/:postId` | No | Get threaded comments for a post |
| PATCH | `/comments/:id` | Yes | Update comment (author only) |
| DELETE | `/comments/:id` | Yes | Soft delete (author only) |

### Reactions

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/reactions/:postId` | Yes | Set or update reaction |
| DELETE | `/reactions/:postId` | Yes | Remove reaction |
| GET | `/reactions/:postId` | No | Get counts and current user reaction |

### Matches

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/matches/posts/:postId` | No | Potential matches for a post |
| GET | `/matches/my` | Yes | All matches for your LOST posts |
| PATCH | `/matches/:matchId/status` | Yes | Update match status |

**Match statuses:** `PENDING`, `REVIEWED`, `DISMISSED`, `CONFIRMED`

---

## Background Matching

When a user reports a **LOST** item, the API enqueues a background job. Worker processes pull jobs from Redis and compare the lost item against all FOUND posts in parallel batches.

```
User creates LOST post
        │
        ▼
   API enqueues job ──► Redis (BullMQ)
                              │
                              ▼
                    Worker process(es)
                    compare in parallel
                              │
                              ▼
                    Store matches in PostgreSQL
                              │
                              ▼
              User views matches via /matches API
```

For full setup, scaling workers, configuration, and testing steps, see **[MATCHING_SETUP.md](MATCHING_SETUP.md)**.

---

## Database Schema

### Models

| Model | Purpose |
|-------|---------|
| **User** | Registered users with email, password, role |
| **Role** | User roles (`admin`, `user`) |
| **Post** | LOST or FOUND item posts |
| **Comment** | Nested comments on posts |
| **Reaction** | LIKE / SAD reactions on posts |
| **ItemMatch** | Potential LOST ↔ FOUND matches with similarity score |

### Key relationships

- User → Role (many-to-one)
- User → Posts, Comments, Reactions (one-to-many)
- Post → Comments, Reactions, ItemMatches (one-to-many)
- Comment → Comment (self-relation for replies)

### Important constraints

- Unique email per user
- One reaction per user per post
- Unique `(lostPostId, foundPostId)` pair for matches
- Soft delete on posts and comments via `deletedAt`

Full field definitions are in [`prisma/schema.prisma`](prisma/schema.prisma).

---

## Docker

Start Redis, the API, and one worker together:

```bash
docker compose up redis dev worker
```

Scale workers horizontally:

```bash
docker compose up --scale worker=3
```

Production build:

```bash
docker compose up prod
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm install` | Install dependencies |
| `pnpm run start:dev` | Run API with hot reload + migrations |
| `pnpm run start:worker` | Run matching worker process |
| `pnpm run start:prod` | Run API in production mode |
| `pnpm run start:worker:prod` | Run worker from compiled build |
| `pnpm run build` | Compile TypeScript |
| `pnpm run test` | Run unit tests |
| `pnpm run test:e2e` | Run end-to-end tests |
| `pnpm run lint` | Lint source files |
| `npx prisma migrate dev` | Apply migrations (development) |
| `npx prisma db seed` | Seed roles |

---

## Documentation

| Document | Description |
|----------|-------------|
| [MATCHING_SETUP.md](MATCHING_SETUP.md) | Redis, BullMQ, workers, and matching API guide |
| Swagger UI | Interactive API docs at `/api-docs/v1` when the server is running |

---

## License

This project is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
