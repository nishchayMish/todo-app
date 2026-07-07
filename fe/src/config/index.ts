export const ENDPOINTS = {
  auth: {
    register: "/api/v1/register",
    verifyUser: "/api/v1/verify-user",
    resendOTP: "/api/v1/resend-otp",
    refreshToken: "/api/v1/refresh-token",
    login: "/api/v1/login",
    forgotPassword: "/api/v1/forgot-password",
    resetPassword: "/api/v1/reset-password",
  },
  todos: {
    list: "/api/v1/todos",
    create: "/api/v1/todos",
    update: (id: string) => `/api/v1/todos/${id}`,
    toggle: (id: string) => `/api/v1/todos/${id}`,
    delete: (id: string) => `/api/v1/todos/${id}`,
  },
  users: {
    me: "/api/v1/profile/me",
    image: "/api/v1/profile/image",
  },
};