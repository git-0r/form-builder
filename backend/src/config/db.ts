import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const dbPath = path.join(process.cwd(), "database.sqlite");
const db = new DatabaseSync(dbPath);

export const initDB = () => {
  try {
    console.log("Initializing database...");
    db.exec(`
      CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        createdAt TEXT NOT NULL
      )
    `);
    console.log(`SQLite connected and ready at: ${dbPath}`);
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
};

export { db };
