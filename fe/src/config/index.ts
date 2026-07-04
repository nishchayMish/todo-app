export const ENDPOINTS = {
  auth: {
      register: "/api/v1/register",
      verifyUser: "/api/v1/verify-user",
      resendOTP: "/api/v1/resend-otp",
      refreshToken: "/api/v1/refresh-token",
      login: "/api/v1/login",
  },
  todos: {
      list: "/api/v1/todos",
      create: "/api/v1/todos",
      update: (id: string) => `/api/v1/todos/${id}`,
      toggle: (id: string) => `/api/v1/todos/${id}`,
      delete: (id: string) => `/api/v1/todos/${id}`,
  },
};