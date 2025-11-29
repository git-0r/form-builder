import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app";
import { connectDB, closeDB } from "../src/config/db";
import { runMigrations } from "../src/database/migrate";

describe("Backend API Integration Tests", () => {
  let firstId: string;
  let secondId: string;

  beforeAll(() => {
    connectDB(":memory:");
    runMigrations();
  });

  afterAll(() => {
    closeDB();
  });

  describe("Form Schema", () => {
    it("GET /api/form-schema - should return the correct JSON structure", async () => {
      const res = await request(app).get("/api/form-schema");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title");
      expect(res.body).toHaveProperty("fields");
      expect(Array.isArray(res.body.fields)).toBe(true);
      // Verify a specific field exists
      const emailField = res.body.fields.find((f: any) => f.name === "email");
      expect(emailField).toBeDefined();
    });
  });

  describe("Submissions CRUD", () => {
    const validData1 = {
      full_name: "Alice Wonderland",
      email: "alice@example.com",
      age: 25,
      department: "eng",
      skills: ["react", "node"],
      joining_date: "2025-01-01",
      terms: true,
    };

    const validData2 = {
      full_name: "Bob Builder",
      email: "bob@example.com",
      age: 40,
      department: "hr",
      skills: ["sql"],
      joining_date: "2024-05-01",
      terms: true,
    };

    it("POST /api/submissions - should fail with invalid data", async () => {
      const invalidData = {
        full_name: "A", // Too short
        email: "not-an-email",
      };
      const res = await request(app).post("/api/submissions").send(invalidData);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toHaveProperty("full_name");
    });

    it("POST /api/submissions - should create first submission", async () => {
      const res = await request(app).post("/api/submissions").send(validData1);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.id).toBeDefined();
      firstId = res.body.id;
    });

    it("POST /api/submissions - should create second submission", async () => {
      const res = await request(app).post("/api/submissions").send(validData2);
      expect(res.status).toBe(201);
      secondId = res.body.id;
    });

    it("GET /api/submissions/:id - should fetch single submission", async () => {
      const res = await request(app).get(`/api/submissions/${firstId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(firstId);
      expect(res.body.data.data.full_name).toBe("Alice Wonderland");
    });

    it("GET /api/submissions/:id - should return 404 for non-existent ID", async () => {
      const res = await request(app).get("/api/submissions/non-existent-id");
      expect(res.status).toBe(404);
    });

    it("PUT /api/submissions/:id - should update submission", async () => {
      const updatedData = {
        ...validData1,
        age: 26,
        full_name: "Alice Updated",
      };
      const res = await request(app)
        .put(`/api/submissions/${firstId}`)
        .send(updatedData);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify update
      const check = await request(app).get(`/api/submissions/${firstId}`);
      expect(check.body.data.data.age).toBe(26);
      expect(check.body.data.data.full_name).toBe("Alice Updated");
    });
  });

  describe("Search, Sort, & Pagination", () => {
    it("GET /api/submissions?q=... - should filter by search term", async () => {
      // Search for "Bob"
      const res = await request(app).get("/api/submissions?q=Bob");
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].data.full_name).toBe("Bob Builder");
      expect(res.body.meta.total).toBe(1);
    });

    it("GET /api/submissions?limit=... - should respect pagination limit", async () => {
      // We have 2 items, limit to 1
      const res = await request(app).get("/api/submissions?limit=1");
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.meta.totalPages).toBe(2);
    });

    it("GET /api/submissions?sortOrder=DESC - should sort by creation date", async () => {
      // Bob was created AFTER Alice, so DESC (Newest first) means Bob comes first
      const res = await request(app).get("/api/submissions?sortOrder=DESC");
      expect(res.body.data[0].id).toBe(secondId);
      expect(res.body.data[1].id).toBe(firstId);
    });

    it("GET /api/submissions?sortOrder=ASC - should sort ASC", async () => {
      const res = await request(app).get("/api/submissions?sortOrder=ASC");
      expect(res.body.data[0].id).toBe(firstId);
      expect(res.body.data[1].id).toBe(secondId);
    });
  });

  describe("Deletion", () => {
    it("DELETE /api/submissions/:id - should delete submission", async () => {
      const res = await request(app).delete(`/api/submissions/${firstId}`);
      expect(res.status).toBe(200);

      // Verify it's gone
      const check = await request(app).get(`/api/submissions/${firstId}`);
      expect(check.status).toBe(404);
    });

    it("GET /api/submissions - total count should decrease", async () => {
      const res = await request(app).get("/api/submissions");
      // Originally 2, deleted 1 -> Should be 1
      expect(res.body.meta.total).toBe(1);
    });
  });
});
