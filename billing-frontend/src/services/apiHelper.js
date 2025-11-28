import axios from "axios";

// 🔥 Render/Production baseURL automatically detect
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: BASE_URL,
});

// 🔥 FINAL UNIVERSAL REQUEST FUNCTION
export async function request(method, url, data = null) {
  try {
    const token = localStorage.getItem("token");

    const res = await api({
      method,
      url,
      data,
      headers: {
        "x-auth-token": token ? token : "",
      },
    });

    return res.data;

  } catch (err) {
    console.error("API ERROR:", err.response?.data || err.message);
    throw err;
  }
}
