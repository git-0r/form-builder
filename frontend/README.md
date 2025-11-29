# Frontend Application

A modern, responsive React application built with **React 19** and the **TanStack Ecosystem**. It features a dynamic form engine and a data-rich administration table.

## Tech Stack

- **Framework:** Vite + React 19
- **Routing:** TanStack Router (Code-based routing)
- **State/Caching:** TanStack Query
- **Forms:** TanStack Form (Composition Pattern)
- **Tables:** TanStack Table
- **UI Components:** ShadCN UI + Tailwind CSS

## Architectural Patterns

### 1. Composition-Based Forms

Instead of a monolithic form component, we use TanStack Form's **Composition Pattern**.

- **`useAppForm`**: A custom hook that binds specific UI components (like `TextField`, `SelectField`) to the form context.
- **Result:** Typesafe, reusable field components that encapsulate their own label and error rendering logic.

### 2. URL State Synchronization

We do not use local state for table pagination or searching.

- **TanStack Router** is the source of truth.
- When you search or change pages, the URL updates (`?q=john&page=2`).
- The UI reacts to the URL change. This makes every view shareable and bookmarkable.

### 3. Zod Generator

A shared utility (`src/utils/zod-generator.ts`) converts the backend JSON schema into a client-side Zod schema at runtime. This ensures the frontend validation rules (Regex, Min/Max) perfectly match the backend.

## Running Tests

Unit tests verify the dynamic form rendering and validation logic.

```bash
# Run from project root
cd frontend
npm run test
```
