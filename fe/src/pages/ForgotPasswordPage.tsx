import { useState } from "react";
import { api } from "../api/axios";
import { ENDPOINTS } from "../config";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");

  const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const res = await api.post(ENDPOINTS.auth.forgotPassword, {
            email
        })
        if(res.status === 200){
            navigate("/reset-password")
        }
    } catch (err) {
        console.log(err)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Forgot Password
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Enter your email address and we'll verify your account before
            sending password reset instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Email Address
            </label>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-900"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white transition-all hover:bg-slate-800 active:scale-[0.99]"
          >
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;