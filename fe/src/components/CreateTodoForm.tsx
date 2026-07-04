import { useState } from "react";
import http from "../api/axios";
import { ENDPOINTS } from "../config";
import { useQueryClient } from "@tanstack/react-query";

interface FormDataI {
  title: string;
  description: string;
}

const CreateTodoForm = () => {
  const queryClient  = useQueryClient();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormDataI>({
    title: "",
    description: "",
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      await http.post(ENDPOINTS.todos.create, formData)
      
      await queryClient.invalidateQueries({
        queryKey: ["todos"]
      })

      setFormData({
        title: "",
        description: "",
      });
      
    } catch (error) {
      console.error(error);
      alert("Failed to create todo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">
        Create Todo
      </h2>

      <form className="space-y-5" onSubmit={onSubmitHandler}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChangeHandler}
            placeholder="Enter todo title"
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={onChangeHandler}
            placeholder="Write something..."
            className="w-full px-4 py-3 border border-slate-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Add Todo"}
        </button>
      </form>
    </div>
  );
};

export default CreateTodoForm;