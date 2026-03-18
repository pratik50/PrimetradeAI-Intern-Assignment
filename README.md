# Anything.io Assignment

This repository contains a full-stack internship task project with two folders:
- frontend: React app (Vite)
- backend: Node.js API (Express + Prisma + PostgreSQL)

This README is written for a newcomer so you can run the project quickly.

## Tech Stack

Backend uses:
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL (Neon compatible)
- JWT authentication
- Swagger/OpenAPI docs

Frontend uses:
- React
- Vite
- Fetch API

## Folder Structure

```text
.
├─ backend/
│  ├─ src/                 # API source code
│  ├─ prisma/              # schema and migrations
│  ├─ docs/                # postman collection
│  ├─ Dockerfile
│  ├─ docker-compose.yml
│  ├─ package.json
│  └─ .env.example
├─ frontend/
│  ├─ src/
│  │  ├─ api/              # API client
│  │  ├─ hooks/            # custom React hooks
│  │  ├─ components/       # UI components
│  │  └─ App.jsx
│  └─ package.json
└─ README.md
```

## Environment Setup

Create this file first:
- backend/.env

Add these values in backend/.env:

```env
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
PORT=4000
```

You can copy from:
- backend/.env.example

## Run Locally

Open two terminals.

1. Start backend

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Backend runs on:
- http://localhost:4000

2. Start frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
- http://localhost:5173

## Docker (Backend)

Backend is dockerized.

Option A: Run backend only using Docker Compose (recommended with Neon)

```bash
cd backend
docker compose up --build
```

This starts backend on:
- http://localhost:4000

Before running, make sure backend/.env has:
- DATABASE_URL (Neon or any cloud Postgres URL)
- JWT_SECRET
- JWT_EXPIRES_IN
- PORT

Option B: Build only backend container (use your own DATABASE_URL)

```bash
cd backend
docker build -t anythingio-backend .
docker run --rm -p 4000:4000 \
	-e DATABASE_URL="your_database_url" \
	-e JWT_SECRET="your_jwt_secret" \
	-e JWT_EXPIRES_IN="1d" \
	-e PORT="4000" \
	anythingio-backend
```

## Important Notes

- Frontend uses Vite proxy for /api, so backend must be running.
- If login/register fails with connection error, check backend terminal first.
- If database changes are made in Prisma schema, run migration again.
- In Docker Compose, backend runs prisma migrate deploy on startup.

## API Docs

- Swagger UI: http://localhost:4000/api/docs
- OpenAPI JSON: http://localhost:4000/api/docs.json

## Basic Feature Checklist

- Register and login
- View current user profile
- Create, list, update, delete tasks
- Role-based authorization (USER and ADMIN)
