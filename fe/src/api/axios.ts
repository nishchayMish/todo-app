import axios from "axios";
import Cookies from "js-cookie";
import { ENDPOINTS } from "../config";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

http.interceptors.request.use((config) => {
    const token = Cookies.get("token");

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
})

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;     
        }

        try {
            const refreshToken = Cookies.get("refreshToken");

            const res = await api.post(ENDPOINTS.auth.refreshToken, {
                refreshToken
            })

            const { newToken, newRefreshToken } = res.data.result;

            Cookies.set("token", newToken);
            Cookies.set("refreshToken", newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return http(originalRequest);
        } catch (err) {
            console.log(err);
            Cookies.remove("token");
            Cookies.remove("refreshToken");
            localStorage.clear();
            
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)

export default http;