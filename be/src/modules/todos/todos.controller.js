import { createTodoService, deleteTodosService, fetchTodosService, toggleTodosService, updateTodosService } from "./todos.service.js";

export const createTodosController = async(req, res) => {
    try {
        const { title, description } =  req.body;
        const userId = req.user.userId;
        const data = await createTodoService(title, description, userId);
        res.status(201).json({
            message: "todo created successfully",
            data
        })
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Internal server error",
        })
    }
}

export const fetchTodosController = async(req, res) => {
    try {
        const userId = req.user.userId;
        const data = await fetchTodosService(userId);
        res.status(200).json({
            message: "todos fetched successfully",
            data
        })
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Internal server error",
        })
    }
}

export const updateTodosController = async(req, res) =>{
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const { title, description } = req.body;
        const result = await updateTodosService(title, description, id, userId);
        res.status(200).json({
            message: "todos upadted successfully",
            result
        })
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Internal server error"
        })
    }
}

export const toggleTodosController = async(req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const { isCompleted } = req.body; 
        const result = await toggleTodosService(id, userId, isCompleted);
        res.status(200).json({
            message: "todos upadted successfully",
            result
        })
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Internal server error"
        })
    }
}

export const deleteTodosController = async(req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        await deleteTodosService(id, userId);
        res.status(201).json({
            message: "todos deleted successfully",
        })
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Internal server error"
        })
    }
}