import { createTodo, deleteTodos, fetchTodos, toggleTodos, updateTodos } from "./todos.repository.js";

export const createTodoService = async(title, description, userId) => {
    const res = createTodo(title, description, userId);
    return res;
}

export const fetchTodosService = async(userId) => {
    const res = await fetchTodos(userId);
    return res;
}

export const updateTodosService = async(title, description, id, userId) => {
    const res = await updateTodos(title, description, id, userId);
    return res;
}

export const toggleTodosService = async(id, userId, isCompleted) => {
    const res = await toggleTodos(id, userId, isCompleted);
    return res;
}

export const deleteTodosService = async(id, userId) => {
    await deleteTodos(id, userId);
}