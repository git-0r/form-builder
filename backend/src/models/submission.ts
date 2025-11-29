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
const deleteStmt = db.prepare("DELETE FROM submissions WHERE id = ?");
const updateStmt = db.prepare("UPDATE submissions SET data = ? WHERE id = ?");
const countStmt = db.prepare("SELECT COUNT(*) as total FROM submissions");

export const SubmissionModel = {
  create: (id: string, data: object, createdAt: string) => {
    insertStmt.run(id, JSON.stringify(data), createdAt);
  },

  update: (id: string, data: object) => {
    const result = updateStmt.run(JSON.stringify(data), id);
    return result.changes > 0;
  },

  delete: (id: string) => {
    const result = deleteStmt.run(id);
    return result.changes > 0;
  },

  findAll: (
    limit: number,
    offset: number,
    sortOrder: "ASC" | "DESC",
    search?: string
  ) => {
    let queryStr = `SELECT id, data, createdAt FROM submissions`;
    const params: any[] = [];

    // SQLite's INSTR or LIKE can be used. LIKE is case-insensitive by default in SQLite.
    if (search) {
      queryStr += ` WHERE data LIKE ?`;
      params.push(`%${search}%`);
    }

    queryStr += ` ORDER BY createdAt ${sortOrder} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const query = db.prepare(queryStr);
    const rows = query.all(...params) as any[];

    return rows.map((row) => ({
      ...row,
      data: JSON.parse(row.data),
    })) as SubmissionRecord[];
  },

  count: (search?: string) => {
    if (search) {
      const stmt = db.prepare(
        "SELECT COUNT(*) as total FROM submissions WHERE data LIKE ?"
      );
      const result = stmt.get(`%${search}%`) as { total: number };
      return result.total;
    }
    const result = countStmt.get() as { total: number };
    return result.total;
  },
};
