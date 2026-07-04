import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { ENDPOINTS } from "../config";

type VerifyPageState = {
  email?: string;
  startTimer?: boolean;
};

const RESEND_WAIT_SECONDS = 3 * 60; // 3 minutes

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const VerifyEmail = () => {
  const location = useLocation();
  const state = location.state as VerifyPageState | null;
  const navigate = useNavigate();

  const email = state?.email || sessionStorage.getItem("verifyEmail") || "";
  const shouldStartTimer = state?.startTimer === true;

  const [secondsLeft, setSecondsLeft] = useState(
    shouldStartTimer ? RESEND_WAIT_SECONDS : 0
  );
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setTimeout(() => {
      setSecondsLeft(secondsLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setVerifying(true);

    try {
      const response = await api.post(ENDPOINTS.auth.verifyUser, {
        email,
        otp,
      });

      if(response.status === 200){
        navigate("/login");
        sessionStorage.removeItem("verifyEmail");
        setSuccess("OTP verified successfully. You can login now.");
        setOtp("");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.response?.data?.message || "Could not verify OTP");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");
    setResending(true);

    try {
      const response = await api.post(ENDPOINTS.auth.resendOTP, {
        email,
      });

      const message = response.data.message?.message || "OTP sent successfully";
      setSuccess(message);
      setSecondsLeft(RESEND_WAIT_SECONDS);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.response?.data?.message || "Could not resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Verify OTP</h1>
          <p className="mt-2 text-slate-500">
            {email
              ? `Enter the OTP sent to ${email}`
              : "Enter the OTP sent to your email to verify your account."}
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              OTP
            </label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={verifying}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition disabled:opacity-60"
          >
            {verifying ? "Verifying..." : "Verify OTP"}
          </button>

          {secondsLeft > 0 ? (
            <p className="text-center text-sm text-slate-500">
              Resend OTP in {formatTime(secondsLeft)}
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending}
              className="w-full py-3 border border-slate-300 text-slate-900 rounded-xl font-medium hover:bg-slate-50 transition disabled:opacity-60"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Back to{" "}
          <Link to="/login" className="text-slate-900 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
