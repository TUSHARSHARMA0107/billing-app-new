import { useState } from "react";
import { request } from "../services/apiHelper";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    if (!email || !password) return toast.error("Email & password required");
    try {
      const res = await request("post", "/auth/login", { email, password });
      localStorage.setItem("token", res.token);
      toast.success("Logged in!");
      nav("/dashboard");
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">

        <h1 className="text-3xl font-semibold text-white text-center mb-6">
          Login
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            className="w-full px-4 py-3 bg-white/10 text-white rounded-lg placeholder-gray-300 
            focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full px-4 py-3 bg-white/10 text-white rounded-lg placeholder-gray-300 
            focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={submit}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg transition"
          >
            Login
          </button>

          <p className="text-gray-300 text-center">
            New here?{" "}
            <Link className="text-blue-400 hover:underline" to="/register">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}