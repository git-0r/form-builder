# Full-Stack Dynamic Form System

A robust, schema-driven application featuring a dynamic form builder and a server-side paginated submissions table. Built with the **TanStack Ecosystem** (Router, Query, Form, Table), **React 19**, **Node.js**, and **Native SQLite**.

![Project Status](https://img.shields.io/badge/status-complete-success)
![Coverage](https://img.shields.io/badge/milestones-100%25-brightgreen)

<div align="center">
  <img src="https://jrzlzlssd50v2uto.public.blob.vercel-storage.com/formBuilder/Screenshot%202025-11-30%20at%202.01.03%E2%80%AFAM-4UrkylnFSoypVjKWCn0E4GWCrdKyqP.png" alt="Schema-Driven Dynamic Form" width="600">
  <p>
    <em>Schema-Driven Dynamic Form.</em>
  </p>
</div>

<div align="center">
  <img src="https://jrzlzlssd50v2uto.public.blob.vercel-storage.com/formBuilder/Screenshot%202025-11-30%20at%202.01.42%E2%80%AFAM-MUj3eNKQ4rhQ30I2TfxbOx5cyF07Yt.png" alt="Feature-Rich Data Table with Search, Sort, and CSV Export" width="600">
  <p>
    <em>Feature-Rich Data Table with Search, Sort, and CSV Export.</em>
  </p>
</div>

## Quick Start

### Prerequisites

- **Node.js v22.5.0+** (Required for native `node:sqlite` support)
- npm or yarn

### Installation

```bash
# 1. Install Backend Dependencies
cd backend
npm install
cd ..

# 2. Install Frontend Dependencies
cd frontend
npm install
cd ..
```

### Running the App

You need two terminals to run the full stack:

**Terminal 1 (Backend):**

```bash
cd backend
npm run dev
# Server running at http://localhost:3001
```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm run dev
# App running at http://localhost:5173
```

## Architecture Overview

This project follows a **Schema-First Design** philosophy.

1.  **Single Source of Truth:** The `backend/form-schema.json` file defines the entire form structure (fields, types, validation rules, labels).
2.  **Dynamic Backend:** The API reads this schema to automatically generate **Zod** validators for incoming requests.
3.  **Dynamic Frontend:** The React app fetches this schema to dynamically render the UI and generate client-side validation logic on the fly.

This ensures the Frontend and Backend validation logic never drift out of sync.

## Milestone Status

### Milestone 1: Frontend (Completed)

- **Dynamic Form:** Renders inputs (Text, Number, Date, Multi-Select, Switch, etc.) from JSON.
- **Validation:** Zod schema generation for client-side feedback.
- **Submissions Table:** TanStack Table implementation.
- **Server-Side Features:** Pagination, Sorting (ASC/DESC).
- **Items Per Page:** 10/20/50 selector.

### Milestone 2: Backend (Completed)

- **API Endpoints:** RESTful routes for Schema, Create, Read, Update, Delete.
- **Persistence:** Zero-dependency Native SQLite (`node:sqlite`).
- **Validation Middleware:** Request body validation using Zod.
- **Error Handling:** Standardized error responses.

### Bonus Features

- **URL Synchronization:** Table state (search, page, sort) syncs to URL via `TanStack Router`.
- **Edit Mode:** Full update capability via `/edit/:id`.
- **Search & Filter:** Debounced search implementation.
- **CSV Export:** Client-side data export.
- **Modern UI:** ShadCN + Tailwind.
- **Testing:** Comprehensive backend (Supertest) and frontend (Vitest) test suites.

## Repository Structure

```text
project-root/
├── backend/                # Node.js API
│   ├── src/
│   │   ├── config/         # DB Connection
│   │   ├── controllers/    # Request Handlers
│   │   ├── database/       # Migrations
│   │   ├── models/         # SQL Logic
│   │   ├── routes/         # API Routes
│   │   ├── utils/          # Zod Generators
│   │   └── app.ts
│   ├── tests/
│   ├── form-schema.json    # The Master Schema
│   └── server.ts           # Entry Point
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── hooks/          # Custom Hooks
│   │   ├── router.tsx      # TanStack Router
│   │   └── lib/            # Frontend Helpers
│   └── vite.config.ts
└── README.md               # You are here
```
