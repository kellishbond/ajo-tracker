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
        max_members: parseInt(form.max_members),
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create group");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Create Ajo Group</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            placeholder="Group name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="contribution_amount"
            type="number"
            placeholder="Contribution amount (₦)"
            value={form.contribution_amount}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <select
            name="frequency"
            value={form.frequency}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          <input
            name="max_members"
            type="number"
            placeholder="Max members"
            value={form.max_members}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}