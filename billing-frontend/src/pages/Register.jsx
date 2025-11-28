import { useState } from "react";
import { request } from "../services/apiHelper";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    if (!email || !password) return toast.error("Email & password required");

    try {
      const res = await request("post", "/auth/register", { email, password });
      localStorage.setItem("token", res.token);
      toast.success("Account created!");
      nav("/dashboard");
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">

        <h1 className="text-3xl font-semibold text-white text-center mb-6">
          Create Account
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 bg-white/10 text-white rounded-lg placeholder-gray-300 
            focus:ring-2 focus:ring-purple-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-white/10 text-white rounded-lg placeholder-gray-300 
            focus:ring-2 focus:ring-purple-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={submit}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-lg transition"
          >
            Register
          </button>

          <p className="text-gray-300 text-center">
            Already registered?{" "}
            <Link className="text-purple-400 hover:underline" to="/">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}