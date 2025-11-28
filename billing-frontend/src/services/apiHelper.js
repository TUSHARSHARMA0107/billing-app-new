import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// FINAL REQUEST FUNCTION (works for all pages)
export async function request(method, url, data = null) {
  try {
    let token = localStorage.getItem("token");

    const res = await api({
      method,
      url,
      data,
      headers: {
        "x-auth-token": token,   // 👈 BACKEND EXACT HEADER NAME
      },
    });

    return res.data;

  } catch (err) {
    console.log(err);
    throw err;
  }
}