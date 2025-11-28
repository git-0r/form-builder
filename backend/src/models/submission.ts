import { db } from "../config/db";

export interface SubmissionRecord {
  id: string;
  data: any;
  createdAt: string;
}

// Prepared Statements
const insertStmt = db.prepare(
  "INSERT INTO submissions (id, data, createdAt) VALUES (?, ?, ?)"
);
const countStmt = db.prepare("SELECT COUNT(*) as total FROM submissions");

export const SubmissionModel = {
  create: (id: string, data: object, createdAt: string) => {
    insertStmt.run(id, JSON.stringify(data), createdAt);
  },

  findAll: (limit: number, offset: number, sortOrder: "ASC" | "DESC") => {
    const query = db.prepare(`
      SELECT id, data, createdAt 
      FROM submissions 
      ORDER BY createdAt ${sortOrder} 
      LIMIT ? OFFSET ?
    `);

    const rows = query.all(limit, offset) as any[];

    // Parse JSON data before returning
    return rows.map((row) => ({
      ...row,
      data: JSON.parse(row.data),
    })) as SubmissionRecord[];
  },

  count: () => {
    const result = countStmt.get() as { total: number };
    return result.total;
  },
};
