import { z } from "zod";
import { validate } from "../../middleware/validate.middleware.js";

const createTodoSchema = z.object({
    body: z.object({
        title: z
            .string({ error: "title cannot be empty" })
            .trim()
            .min(1, "title cannot be empty")
            .min(3, "title cannot be smaller than 3 words")
            .max(30, "title cannot be greater than 30 words"),
        description: z
            .string()
            .max(255, "description cannot be bigger than 255 words")
            .optional()
            .default(""),
    }),
});

const updateTodoSchema = z.object({
    params: z.object({
        id: z.string({ error: "id is missing" }).min(1, "id is missing"),
    }),
    body: z.object({
        title: z
            .string()
            .min(3, "title cannot be smaller than 3 words")
            .max(30, "title cannot be greater than 30 words")
            .optional(),
        description: z
            .string()
            .min(3, "description cannot be smaller than 3 words")
            .max(255, "description cannot be bigger than 255 words")
            .optional(),
    }),
});

const toggleTodosSchema = z.object({
    params: z.object({
        id: z.string({ error: "id is missing "}).min(1, "id is missing")
    }),
    body: z.object({
        isCompleted: z.boolean({ error: "isCompleted must be a boolean value" }).optional(),
    })
})

export const santitizedCreateTodoInput = validate(createTodoSchema);
export const sanitizedUpdateTodoInput = validate(updateTodoSchema);
export const sanitizedToggleTodoInput = validate(toggleTodosSchema);
