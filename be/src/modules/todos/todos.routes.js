import express from "express";
import { createTodosController, deleteTodosController, fetchTodosController, toggleTodosController, updateTodosController } from "./todos.controller.js";
import { sanitizedUpdateTodoInput, santitizedCreateTodoInput } from "./todos.sanitizedInput.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/todos", authMiddleware, santitizedCreateTodoInput, createTodosController);
router.get("/todos", authMiddleware, fetchTodosController);
router.patch("/todos/:id", sanitizedUpdateTodoInput, authMiddleware, updateTodosController);
router.put("/todos/:id", authMiddleware, toggleTodosController)
router.delete("/todos/:id", authMiddleware, deleteTodosController);

export default router;