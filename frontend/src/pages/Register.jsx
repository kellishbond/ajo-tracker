import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-1/4 -top-1/4 h-[80%] w-[80%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute -right-1/4 -bottom-1/4 h-[80%] w-[80%] rounded-full bg-sky-500/10 blur-[120px]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-[2.5rem] border border-slate-800 bg-slate-900/60 p-10 shadow-2xl backdrop-blur-xl"
      >
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-emerald-500 mb-2">Join Ajo Tracker</p>
          <h1 className="text-4xl font-black tracking-tighter text-white">Create Account</h1>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-400 text-center border border-rose-500/20">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 px-5 py-4 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none transition-all"
            required
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 px-5 py-4 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none transition-all"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 px-5 py-4 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none transition-all"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-8 w-full rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 py-4 font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Sign Up
        </button>

        <p className="text-sm text-center mt-8 text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400 font-bold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}