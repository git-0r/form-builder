import { getDB } from "../config/db";

export interface SubmissionRecord {
  id: string;
  data: any;
  createdAt: string;
}

export const SubmissionModel = {
  create: (id: string, data: object, createdAt: string) => {
    const stmt = getDB().prepare(
      "INSERT INTO submissions (id, data, createdAt) VALUES (?, ?, ?)"
    );
    stmt.run(id, JSON.stringify(data), createdAt);
  },

  update: (id: string, data: object) => {
    const stmt = getDB().prepare(
      "UPDATE submissions SET data = ? WHERE id = ?"
    );
    const result = stmt.run(JSON.stringify(data), id);
    return result.changes > 0;
  },

  delete: (id: string) => {
    const stmt = getDB().prepare("DELETE FROM submissions WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  },

  findById: (id: string): SubmissionRecord | undefined => {
    const stmt = getDB().prepare(
      "SELECT id, data, createdAt FROM submissions WHERE id = ?"
    );
    const row = stmt.get(id) as any;
    if (!row) return undefined;
    return { ...row, data: JSON.parse(row.data) };
  },

  findAll: (
    limit: number,
    offset: number,
    sortOrder: "ASC" | "DESC",
    search?: string
  ) => {
    let queryStr = `SELECT id, data, createdAt FROM submissions`;
    const params: any[] = [];

    if (search) {
      queryStr += ` WHERE data LIKE ?`;
      params.push(`%${search}%`);
    }

    queryStr += ` ORDER BY createdAt ${sortOrder} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const stmt = getDB().prepare(queryStr);
    const rows = stmt.all(...params) as any[];

    return rows.map((row) => ({
      ...row,
      data: JSON.parse(row.data),
    })) as SubmissionRecord[];
  },

  count: (search?: string) => {
    if (search) {
      const stmt = getDB().prepare(
        "SELECT COUNT(*) as total FROM submissions WHERE data LIKE ?"
      );
      const result = stmt.get(`%${search}%`) as { total: number };
      return result.total;
    }
    const stmt = getDB().prepare("SELECT COUNT(*) as total FROM submissions");
    const result = stmt.get() as { total: number };
    return result.total;
  },
};
