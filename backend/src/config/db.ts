import { DatabaseSync } from "node:sqlite";

let dbInstance: DatabaseSync | null = null;

export const connectDB = (location: string): void => {
  if (dbInstance) {
    dbInstance.close();
  }

  dbInstance = new DatabaseSync(location);

  dbInstance.exec("PRAGMA journal_mode = WAL;");

  console.log(`Database connected at: ${location}`);
};

export const getDB = (): DatabaseSync => {
  if (!dbInstance) {
    throw new Error(
      "Database not initialized. Ensure connectDB() is called before using models."
    );
  }
  return dbInstance;
};

export const closeDB = (): void => {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
};
