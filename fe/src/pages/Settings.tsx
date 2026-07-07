import { useEffect, useState } from "react";
import {
  Camera,
  Eye,
  EyeOff,
  Save,
  Lock,
  User,
  Mail,
  Trash2,
  Loader2,
  X,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import type { User as AuthUser } from "../context/AuthContext";
import {
  deleteProfileImage,
  fetchCurrentUser,
  updateProfile,
  updateProfileImage,
  verifyEmailUpdate,
} from "../services/users";

// sessionStorage key for pending email change
const PENDING_EMAIL_KEY = "pendingNewEmail";

const getErrorMessage = (err: unknown, fallback: string) => {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data
      ?.message || fallback
  );
};

const Settings = () => {
  const { setUser } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [savedUsername, setSavedUsername] = useState("");
  const [savedEmail, setSavedEmail] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // email OTP flow
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [pendingNewEmail, setPendingNewEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const displayImage = avatarPreview || profileImage;
  const firstLetter = username?.charAt(0)?.toUpperCase() || "U";

  const syncUser = (updatedUser: AuthUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setProfileImage(updatedUser.user_image ?? null);
    setUsername(updatedUser.username);
    setEmail(updatedUser.email);
    setSavedUsername(updatedUser.username);
    setSavedEmail(updatedUser.email);
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchCurrentUser();
        syncUser(profile);

        // agar pehle email change chal raha tha to OTP section dikhao
        const storedEmail = sessionStorage.getItem(PENDING_EMAIL_KEY);
        if (storedEmail) {
          setPendingNewEmail(storedEmail);
          setShowOtpSection(true);
        }
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");
    setAvatarPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const updatedUser = await updateProfileImage(file);
      syncUser(updatedUser);
      setAvatarPreview(null);
      setSuccess("Profile image updated successfully");
    } catch (err: unknown) {
      setAvatarPreview(null);
      setError(getErrorMessage(err, "Failed to upload image"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteAvatar = async () => {
    setError("");
    setSuccess("");
    setDeleting(true);

    try {
      const updatedUser = await deleteProfileImage();
      syncUser(updatedUser);
      setAvatarPreview(null);
      setSuccess("Profile image removed successfully");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to delete image"));
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveChanges = async () => {
    setError("");
    setSuccess("");

    const isUsernameChanged = username.trim() !== savedUsername;
    const isEmailChanged = email.trim().toLowerCase() !== savedEmail.toLowerCase();

    if (!isUsernameChanged && !isEmailChanged) {
      setError("No changes to save");
      return;
    }

    setSavingProfile(true);

    try {
      // pehle username update karo (agar change hua ho)
      if (isUsernameChanged) {
        const response = await updateProfile({ username: username.trim() });
        if (response.result?.user) {
          syncUser(response.result.user);
        }
        setSuccess(response.message || "Username updated successfully");
      }

      // agar email change hua hai to OTP bhejo
      if (isEmailChanged) {
        const newEmail = email.trim().toLowerCase();
        const response = await updateProfile({ email: newEmail });

        setPendingNewEmail(newEmail);
        sessionStorage.setItem(PENDING_EMAIL_KEY, newEmail);
        setShowOtpSection(true);
        setOtp("");
        setSuccess(response.message || "OTP sent to your new email");
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to update profile"));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    setError("");
    setSuccess("");

    if (!pendingNewEmail) {
      setError("New email not found. Please try again.");
      return;
    }

    if (!otp.trim()) {
      setError("Please enter OTP");
      return;
    }

    setVerifyingOtp(true);

    try {
      const updatedUser = await verifyEmailUpdate({
        newEmail: pendingNewEmail,
        otp: otp.trim(),
      });

      syncUser(updatedUser);
      sessionStorage.removeItem(PENDING_EMAIL_KEY);
      setShowOtpSection(false);
      setPendingNewEmail("");
      setOtp("");
      setSuccess("Email updated successfully");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to verify OTP"));
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleUpdatePassword = async () => {
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    setUpdatingPassword(true);

    try {
      const response = await updateProfile({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(response.message || "Password updated successfully");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to update password"));
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
        <Loader2 className="animate-spin mr-2" size={20} />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="mt-2 text-slate-500">
            Manage your account information and preferences.
          </p>
        </div>

        {(error || success) && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {error || success}
          </div>
        )}

        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-8">
              Profile Information
            </h2>

            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex flex-col items-center gap-3">
                <label
                  htmlFor="avatar"
                  className={`relative cursor-pointer group ${
                    uploading ? "pointer-events-none opacity-60" : ""
                  }`}
                >
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt="avatar"
                      className="w-32 h-32 rounded-full object-cover border-4 border-slate-200"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-slate-900 text-white flex items-center justify-center text-5xl font-bold">
                      {firstLetter}
                    </div>
                  )}

                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    {uploading ? (
                      <Loader2 className="animate-spin text-white" size={24} />
                    ) : (
                      <Camera size={24} className="text-white" />
                    )}
                  </div>
                </label>

                <input
                  id="avatar"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={uploading || deleting}
                />

                {profileImage && (
                  <button
                    type="button"
                    onClick={handleDeleteAvatar}
                    disabled={uploading || deleting}
                    className="flex items-center gap-1.5 bg-gray-100 hover:text-red-600 text-sm cursor-pointer disabled:opacity-50 rounded-xl px-3 py-1"
                  >
                    {deleting ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <X size={14} />
                    )}
                    Remove
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-5">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Username
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={savingProfile}
                  className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition disabled:opacity-60"
                >
                  {savingProfile ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  Save Changes
                </button>

                {showOtpSection && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <p className="text-sm text-slate-600">
                      OTP sent to <strong>{pendingNewEmail}</strong>. Enter it
                      below to confirm your new email.
                    </p>

                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-slate-800"
                    />

                    <button
                      type="button"
                      onClick={handleVerifyEmailOtp}
                      disabled={verifyingOtp}
                      className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition disabled:opacity-60"
                    >
                      {verifyingOtp && (
                        <Loader2 className="animate-spin" size={18} />
                      )}
                      Submit OTP
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Change Password
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Current Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-slate-800"
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  New Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-slate-800"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-slate-800"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleUpdatePassword}
              disabled={updatingPassword}
              className="mt-6 flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition disabled:opacity-60"
            >
              {updatingPassword ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Lock size={18} />
              )}
              Update Password
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-red-200 shadow-sm p-8">
            <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>

            <p className="mt-3 text-slate-600">
              Deleting your account is permanent and cannot be undone.
            </p>

            <button className="mt-6 flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
              <Trash2 size={18} />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
