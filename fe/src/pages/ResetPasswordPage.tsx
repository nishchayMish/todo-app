import { useState } from "react";
import { api } from "../api/axios";
import { ENDPOINTS } from "../config";
import { useLocation, useNavigate } from "react-router-dom";

interface resetPasswordState{
  userId?: string;
}

const ResetPasswordPage = () => {
  const [otp, setOtp] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as resetPasswordState | null
  const userId = state?.userId || sessionStorage.getItem("userId") || "";
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await api.post(ENDPOINTS.auth.resetPassword, {
        userId,
        password,
        otp
      })

      if(res.status === 200){
        navigate("/login");
        sessionStorage.removeItem("userId");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Reset Password
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Enter the OTP sent to your email and create a new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              New Password
            </label>

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type="password"
              placeholder="Enter your new password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-900"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Confirm Password
            </label>

            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-900"
            />
          </div>

          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              OTP
            </label>

            <input
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-center tracking-[0.5em] text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-900"
            />

            <p className="mt-2 text-xs text-slate-500">
              Enter the 6-digit code sent to your email.
            </p>
          </div>

          <button
            disabled={
              loading ||
              !otp ||
              otp.length !== 6 ||
              !password ||
              !confirmPassword
            }
            type="submit"
            className={`w-full rounded-xl py-3 text-sm font-medium text-white transition-all ${
              loading ||
              !otp ||
              otp.length !== 6 ||
              !password ||
              !confirmPassword
                ? "bg-slate-400 cursor-not-allowed opacity-70"
                : "bg-slate-900 hover:bg-slate-800 active:scale-[0.99]"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;