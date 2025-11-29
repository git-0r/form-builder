# Backend API Service

A lightweight, robust Node.js REST API powered by **Express** and **Native SQLite**. It serves the dynamic form schema and manages submission data persistence.

## Tech Stack

- **Runtime:** Node.js (v22.5.0+)
- **Framework:** Express
- **Database:** `node:sqlite` (Native synchronous SQLite module)
- **Validation:** Zod
- **Testing:** Vitest + Supertest

## Key Features

- **Zero-Config DB:** Uses a local `database.sqlite` file. No Docker or external services required.
- **Dynamic Validation:** Automatically converts `form-schema.json` into a strictly typed Zod validator.
- **Transactions:** Ensures data integrity during migrations and writes.

## API Endpoints

### Form Configuration

- `GET /api/form-schema`
  - Returns the JSON definition for the frontend form builder.

### Submissions

- `GET /api/submissions`
  - **Query Params:** `page`, `limit`, `sortOrder`, `q` (search).
  - Returns paginated list of submissions.
- `POST /api/submissions`
  - Accepts JSON payload matching the schema.
  - Returns `201 Created` with ID.
- `GET /api/submissions/:id`
  - Returns a single submission payload.
- `PUT /api/submissions/:id`
  - Updates an existing submission.
- `DELETE /api/submissions/:id`
  - Permanently removes a submission.

## Running Tests

The backend includes a full integration test suite using an in-memory database.

```bash
# Run from project root
cd backend
npm run test
```

## Database Schema

The application uses a single table design for simplicity and flexibility with dynamic data.

```sql
CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,  -- JSON blob of form fields
  createdAt TEXT NOT NULL
);
```
