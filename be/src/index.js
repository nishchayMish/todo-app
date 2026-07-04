import express from 'express';
import dotenv from 'dotenv';
import { db } from './config/db.js';
import authRoutes from "./modules/auth/auth.routes.js"
import todosRoutes from "./modules/todos/todos.routes.js"
import { startMigration } from './config/migrate.js';
import cors from 'cors';
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({}))

app.use(express.json());

app.use("/api/v1", authRoutes);
app.use("/api/v1", todosRoutes);


const startServer = async () => {
  try {
    await db.query("SELECT 1");

    await startMigration();

    console.log("Database connected successfully");

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

startServer();