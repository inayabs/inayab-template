// import { auth } from '@/auth';
import axios from "axios";
import { getSession, signOut } from "next-auth/react";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Set your API base URL
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    "Access-Control-Allow-Headers":
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession(); // ✅ Get session from NextAuth
      if (session && session.user?.token) {
        config.headers.Authorization = `Bearer ${session.user.token}`; // ✅ Attach token
      }
    } catch (error) {
      console.error("Error getting session:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.warn("Unauthorized (401) detected, signing out...");
        await signOut({ redirect: true, callbackUrl: "/auth/login" }); // ✅ Redirect to login page
      }

      const errorMessage = error.response.data.message || "Fetch error";
      return Promise.reject(new Error(errorMessage));
    } else {
      return Promise.reject(new Error(error.message));
    }
  }
);

export default axiosInstance;
