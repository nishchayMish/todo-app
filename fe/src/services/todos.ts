import http from "../api/axios"
import { ENDPOINTS } from "../config"

export const fetchTodos = async() => {
    const res = await http.get(ENDPOINTS.todos.list);
    return res.data.data;
}