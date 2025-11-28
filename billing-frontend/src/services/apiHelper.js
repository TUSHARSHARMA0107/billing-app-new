import axios from "axios";

// ---- AUTO SELECT BASE URL ----
const BASE_URL =
  import.meta.env.VITE_API_URL ||       // Render / Production
  "http://localhost:5000/api";          // Local dev

// ---- AXIOS INSTANCE ----
export const api = axios.create({
  baseURL: BASE_URL,
});

// ---- UNIVERSAL REQUEST FUNCTION ----
export async function request(method, url, data = null) {
  try {
    const token = localStorage.getItem("token");

    const res = await api({
      method,
      url: url.startsWith("/") ? url : `/${url}`,  // Ensures /auth/login works
      data,
      headers: {
        "x-auth-token": token || "",
      },
    });

    return res.data;
  } catch (err) {
    console.log("API ERROR:", err.response?.data || err.message);
    throw err;
  }
}