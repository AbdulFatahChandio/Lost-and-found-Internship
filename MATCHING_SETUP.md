# Parallel Item Matching — Setup Guide

This project uses **Redis** and **BullMQ** to match newly reported LOST items against existing FOUND items in the background. Multiple worker processes can run in parallel to scale throughput.

## Architecture

```
┌─────────────┐     enqueue job      ┌─────────────┐     pull jobs     ┌──────────────────┐
│  NestJS API │ ──────────────────►  │    Redis    │ ◄──────────────── │ Worker Process 1 │
│  (producer) │                      │   (BullMQ)  │                   └──────────────────┘
└─────────────┘                      └─────────────┘     pull jobs     ┌──────────────────┐
       │                                     ▲         ◄──────────────── │ Worker Process 2 │
       │                                     │                           └──────────────────┘
       ▼                                     │
┌─────────────┐                              │
│ PostgreSQL  │ ◄── store ItemMatch rows ────┘
└─────────────┘
```

**Flow:**
1. User creates a **LOST** post via `POST /api/v1/posts`
2. API enqueues a `match-lost-item` job on the `item-matching` queue (response unchanged)
3. Worker process(es) pull jobs from Redis
4. Each job loads all FOUND posts and compares them in **parallel batches** (`Promise.all`)
5. Matches above the similarity threshold are saved to `ItemMatch`
6. Users retrieve matches via the `/api/v1/matches` endpoints

## Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL (running)
- Redis 7+

## Environment Variables

Add these to your `.env` file:

```env
# Redis (required for matching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_CONTAINER_NAME=redis-lost-and-found

# Worker container name (Docker only)
DOCKER_WORKER_CONTAINER_NAME=lost-and-found-worker
```

Existing variables (`DATABASE_URL`, `PORT`, `JWT_SECRET_KEY`, etc.) are unchanged.

## Local Setup (without Docker)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start Redis

**Option A — Docker:**
```bash
docker run -d --name redis-lost-and-found -p 6379:6379 redis:7-alpine
```

**Option B — Windows (WSL / native Redis):**
```bash
redis-server
```

### 3. Run database migration

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Start the API (Terminal 1)

```bash
pnpm run start:dev
```

API: `http://localhost:4055`  
Swagger: `http://localhost:4055/api-docs/v1`

### 5. Start worker process(es) (Terminal 2+)

```bash
pnpm run start:worker
```

**Scale parallel workers** by opening additional terminals and running the same command:

```bash
# Terminal 3 — second worker
pnpm run start:worker

# Terminal 4 — third worker
pnpm run start:worker
```

Each worker process handles up to **5 concurrent jobs** (configurable in `src/modules/matching/constants/matching.constants.ts`).

## Docker Compose Setup

Start Redis, API, and one worker together:

```bash
docker compose up redis dev worker
```

Scale workers horizontally:

```bash
docker compose up --scale worker=3
```

## Testing the Matching Flow

### 1. Sign up and log in

```bash
POST /api/v1/auth/signup
POST /api/v1/auth/login
```

Copy the JWT token for authenticated requests.

### 2. Create FOUND posts (no job queued)

```bash
POST /api/v1/posts
Authorization: Bearer <token>

{
  "title": "Black Leather Wallet Found",
  "description": "Found near city park. Contains ID cards.",
  "type": "FOUND"
}
```

### 3. Create a LOST post (triggers background matching)

```bash
POST /api/v1/posts
Authorization: Bearer <token>

{
  "title": "Lost Black Wallet",
  "description": "Lost my black leather wallet near the city park with ID inside.",
  "type": "LOST"
}
```

The API response is identical to before — matching happens asynchronously.

### 4. View potential matches

**For a specific lost post:**
```bash
GET /api/v1/matches/posts/{lostPostId}
```

**All matches for your lost posts (auth required):**
```bash
GET /api/v1/matches/my
Authorization: Bearer <token>
```

**Filter by status:**
```bash
GET /api/v1/matches/my?status=PENDING
```

### 5. Update match status (owner of LOST post)

```bash
PATCH /api/v1/matches/{matchId}/status
Authorization: Bearer <token>

{ "status": "CONFIRMED" }
```

Status values: `PENDING`, `REVIEWED`, `DISMISSED`, `CONFIRMED`

## API Endpoints (new)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/matches/posts/:postId` | No | Matches for a LOST or FOUND post |
| GET | `/api/v1/matches/my` | Yes | All matches for current user's LOST posts |
| PATCH | `/api/v1/matches/:matchId/status` | Yes | Update match status |

All existing endpoints (`/auth`, `/posts`, `/comments`, `/reactions`) are unchanged.

## Configuration

Edit `src/modules/matching/constants/matching.constants.ts`:

| Constant | Default | Description |
|----------|---------|-------------|
| `MATCH_MIN_SCORE` | 25 | Minimum similarity (0–100) to store a match |
| `MATCH_BATCH_SIZE` | 20 | Found posts per parallel batch inside a job |
| `WORKER_CONCURRENCY` | 5 | Jobs processed concurrently per worker process |

## Production

```bash
pnpm run build
pnpm run start:prod          # API
pnpm run start:worker:prod   # Worker(s) — run multiple instances
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ECONNREFUSED` to Redis | Ensure Redis is running and `REDIS_HOST`/`REDIS_PORT` are correct |
| No matches returned | Wait a few seconds for the worker; check worker logs |
| Jobs not processing | Confirm at least one worker is running (`pnpm run start:worker`) |
| Prisma errors on `ItemMatch` | Run `npx prisma migrate dev && npx prisma generate` |

## Parallel & Distributed Computing Summary

| Layer | Mechanism |
|-------|-----------|
| **Job queue** | BullMQ on Redis decouples API from heavy matching work |
| **Horizontal scaling** | Multiple worker OS processes compete for jobs from the same queue |
| **Intra-job parallelism** | Found posts split into batches; batches compared via `Promise.all` |
| **Concurrency** | Each worker runs up to 5 jobs simultaneously |
| **Persistence** | PostgreSQL stores ranked matches with unique `(lostPostId, foundPostId)` constraint |
