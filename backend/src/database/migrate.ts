import { getDB } from "../config/db";

export const runMigrations = () => {
  const db = getDB();

  console.log("Running database migrations...");

  db.exec("BEGIN TRANSACTION");
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        createdAt TEXT NOT NULL
      )
    `);

    db.exec("COMMIT");
    console.log("Migrations applied successfully.");
  } catch (error) {
    db.exec("ROLLBACK");
    console.error("Migration failed:", error);
    throw error;
  }
};
