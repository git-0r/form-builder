import path from "path";
import app from "./src/app";
import { connectDB, closeDB } from "./src/config/db";
import { runMigrations } from "./src/database/migrate";

const PORT = process.env.port || 3000;
const DB_PATH = path.join(process.cwd(), "database.sqlite");

try {
  connectDB(DB_PATH);
  runMigrations();
} catch (error) {
  console.error("Failed to start application:", error);
  process.exit(1);
}

const server = app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

const shutdown = () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    closeDB();
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
