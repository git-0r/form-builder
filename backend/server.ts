import express from "express";
import cors from "cors";
import apiRoutes from "./src/routes/api";
import { initDB } from "./src/config/db";

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

const startServer = async () => {
  try {
    // this function is sync
    initDB();

    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
