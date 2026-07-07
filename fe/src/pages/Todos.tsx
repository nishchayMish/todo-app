import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, LogOut, Settings } from "lucide-react";

import { fetchTodos } from "../services/todos";
import TodoCard from "../components/TodoCard";
import CreateTodoForm from "../components/CreateTodoForm";
import type { TodoI } from "../types";
import { fetchCurrentUser } from "../services/users";
import useAuth from "../hooks/useAuth";
import type { User } from "../context/AuthContext";

const Todos = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showDropDown, setShowDropDown] = useState(false);
  const [user, setLocalUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const profile = await fetchCurrentUser();
      setLocalUser(profile);
      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));
    };
    fetchUser();
  }, [setUser]);

  const firstLetter = user?.username?.charAt(0)?.toUpperCase() || "U";

  const logoutHandler = () => {
    localStorage.clear();
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    navigate("/");
  };

  const menuItems = [
    {
      label: "Settings",
      icon: <Settings size={16} />,
      route: "/settings",
    },
  ];

  const {
    data: todos = [],
    isLoading,
    error,
  } = useQuery<TodoI[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Something went wrong
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            My Todos
          </h1>

          <div className="relative">
            <button
              onClick={() => setShowDropDown((prev) => !prev)}
              className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-100 transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-semibold uppercase overflow-hidden">
                {user?.user_image ? (
                  <img
                    src={user.user_image}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  firstLetter
                )}
              </div>

              <ChevronDown
                size={16}
                className={`text-slate-500 transition-transform duration-200 ${
                  showDropDown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDropDown && (
              <div className="absolute right-0 top-14 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.route}
                    onClick={() => setShowDropDown(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}

                <button
                  onClick={logoutHandler}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <CreateTodoForm />

        <section className="mt-10">
          <h2 className="mb-5 text-xl font-semibold text-slate-900">
            Your Todos
          </h2>

          {todos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              No todos found. Create your first todo 🚀
            </div>
          ) : (
            <ul className="space-y-4">
              {todos.map((todo) => (
                <TodoCard key={todo.id} todo={todo} />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default Todos;