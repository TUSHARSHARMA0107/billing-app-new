import { api } from "./api";
import toast from "react-hot-toast";

export default async function request(method, url, data = null) {
  try {
    const res = await api[method](url, data, {
      headers: {
        "x-auth-token": localStorage.getItem("token")
      }
    });
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Something went wrong");
    throw err;
  }
}