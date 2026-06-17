import { useState } from "react";
import { createGroup } from "../api/groups";

export default function CreateGroupModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    contribution_amount: "",
    frequency: "monthly",
    max_members: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createGroup({
        ...form,
        contribution_amount: parseFloat(form.contribution_amount),
        max_members: parseInt(form.max_members, 10),
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create group");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-4 py-6 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-[2.5rem] border border-slate-800 bg-slate-900/80 p-10 shadow-2xl backdrop-blur-2xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">Initialization</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-white">New Circle</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-bold text-slate-500 transition-all hover:border-rose-500/50 hover:text-rose-400"
          >
            Close
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-400 border border-rose-500/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            name="name"
            placeholder="Group name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 px-5 py-4 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none transition-all"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full min-h-[100px] rounded-2xl border border-slate-800 bg-slate-950/60 px-5 py-4 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none transition-all"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="contribution_amount"
              type="number"
              placeholder="Contribution amount (₦)"
              value={form.contribution_amount}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 px-5 py-4 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none transition-all"
              required
            />
            <input
              name="max_members"
              type="number"
              placeholder="Max members"
              value={form.max_members}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 px-5 py-4 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none transition-all"
              required
            />
          </div>

          <select
            name="frequency"
            value={form.frequency}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 px-5 py-4 text-sm text-slate-300 focus:border-emerald-500/50 focus:outline-none transition-all appearance-none"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly Cycle</option>
          </select>

          <button
            type="submit"
            className="mt-4 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 py-4 font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            Initialize Circle
          </button>
        </form>
      </div>
    </div>
  );
}
