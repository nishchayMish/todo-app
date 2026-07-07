import http from "../api/axios";
import { ENDPOINTS } from "../config";
import type { User } from "../context/AuthContext";

export const fetchCurrentUser = async (): Promise<User> => {
  const res = await http.get(ENDPOINTS.users.me);
  return res.data.result;
};

export const updateProfileImage = async (file: File): Promise<User> => {
  const formData = new FormData();
  formData.append("user_image", file);

  const res = await http.patch(ENDPOINTS.users.image, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.result;
};

export const deleteProfileImage = async (): Promise<User> => {
  const res = await http.delete(ENDPOINTS.users.image);
  return res.data.result;
};

// Update username, email, or password (one at a time)
export const updateProfile = async (data: {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}) => {
  const res = await http.patch(ENDPOINTS.users.profile, data);
  return res.data;
};

// Verify OTP after email change
export const verifyEmailUpdate = async (data: {
  newEmail: string;
  otp: string;
}): Promise<User> => {
  const res = await http.post(ENDPOINTS.users.verifyEmail, data);
  return res.data.result;
};
