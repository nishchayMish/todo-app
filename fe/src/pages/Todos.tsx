import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "../services/todos";
import TodoCard from "../components/TodoCard";
import type { TodoI } from "../types";
import CreateTodoForm from "../components/CreateTodoForm";

const Todos = () => {
  const navigate = useNavigate();

  const logoutHandler = async() => {
    localStorage.clear();
    Cookies.remove("token")
    Cookies.remove("refreshToken")
    navigate("/");
  }
  
  const { data: todos = [], isLoading, error } = useQuery<TodoI[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  })

  if (isLoading) {
    return <p>Loading...</p> ;
  }

  if (error) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            My Todos
          </h1>

          <button onClick={logoutHandler} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        
        {/* Create Todo Card */}
        <CreateTodoForm />

        {/* Todo List */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-5">
            Your Todos
          </h2>

          <ul className="space-y-4">
            {todos.map((todo) => (
              <TodoCard key={todo.id} todo={todo}/>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Todos;