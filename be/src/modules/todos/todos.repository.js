import { db } from "../../config/db.js";

export const fetchTodos = async(userId) => {
    const res = await db.query("SELECT * FROM todos WHERE user_id = $1", [userId]);
    return res.rows;
}

export const createTodo = async(title, description, userId) => {
    const res = await db.query("INSERT INTO todos(title, description, user_id) VALUES($1, $2, $3) RETURNING *", 
    [title, description, userId])
    return res.rows[0];
}

export const updateTodos = async(title, description, id, userId) => {
    const res = await db.query("UPDATE todos SET title=$1, description=$2 WHERE id=$3 AND user_id=$4 RETURNING *", 
        [title, description, id, userId]
    )
    return res.rows[0];
}

export const toggleTodos = async(id, userId, isCompleted) => {
    const res = await db.query("UPDATE todos SET isCompleted = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
        [isCompleted, id, userId]
    )
    return res.rows[0];
}

export const deleteTodos = async(id, userId) => {
    await db.query("DELETE FROM todos WHERE id=$1 AND user_id=$2", [id, userId]);
}