import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Pencil, X, Clock, Check } from "lucide-react";
import http from "../api/axios";
import { ENDPOINTS } from "../config";
import type { TodoI } from "../types";

interface TodoCardProps {
  todo: TodoI;
}

interface EditModalProps {
  todo: TodoI;
  onClose: () => void;
}

const EditModal = ({ todo, onClose }: EditModalProps) => {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [isCompleted, setIsCompleted] = useState(todo.iscompleted);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) return;

    const isTodoChanged =
      trimmedTitle !== todo.title || description !== todo.description;
    const isStatusChanged = isCompleted !== todo.iscompleted;

    if (!isTodoChanged && !isStatusChanged) {
      onClose();
      return;
    }

    setSaving(true);
    try {
      if (isTodoChanged) {
        await http.patch(ENDPOINTS.todos.update(todo.id), {
          title: trimmedTitle,
          description,
        });
      }

      if (isStatusChanged) {
        await http.put(ENDPOINTS.todos.toggle(todo.id), {
          isCompleted,
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["todos"] });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal */}
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-800">Edit task</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a note…"
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition resize-none leading-relaxed"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsCompleted(false)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  !isCompleted
                    ? "bg-amber-50 border-amber-300 text-amber-700"
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
              >
                <Clock size={14} />
                Pending
              </button>
              <button
                type="button"
                onClick={() => setIsCompleted(true)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  isCompleted
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
              >
                <Check size={14} />
                Completed
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || saving}
              className="flex-2 py-2.5 rounded-xl text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const TodoCard = ({ todo }: TodoCardProps) => {
  const queryClient = useQueryClient();
  const [showEditModal, setShowEditModal] = useState(false);

  const deleteTodo = async () => {
    try {
      await http.delete(ENDPOINTS.todos.delete(todo.id));
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <li className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
        <div className="flex items-start justify-between gap-4">

          {/* Content */}
          <div className="min-w-0">
            <h3 className={`text-lg font-semibold ${todo.iscompleted ? "line-through text-slate-400" : "text-slate-900"}`}>
              {todo.title}
            </h3>
            <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
              {todo.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Status badge */}
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
              todo.iscompleted
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}>
              {todo.iscompleted ? "Completed" : "Pending"}
            </span>

            {/* Edit button */}
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Edit todo"
            >
              <Pencil size={16} />
            </button>

            {/* Delete button */}
            <button
              onClick={deleteTodo}
              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Delete todo"
            >
              <Trash2 size={16} />
            </button>

          </div>
        </div>
      </li>

      {/* Edit modal — only renders when open */}
      {showEditModal && (
        <EditModal todo={todo} onClose={() => setShowEditModal(false)} />
      )}
    </>
  );
};

export default TodoCard;