import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import request from "../services/apiHelper";
import toast from "react-hot-toast";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await request("post", "/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.token);
      toast.success("Welcome back!");

      nav("/dashboard");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl p-8 rounded-2xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back
        </h1>

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-white/20 text-white placeholder-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-white/20 text-white placeholder-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition">
            Login
          </button>
        </form>

        <p className="text-center text-gray-300 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}