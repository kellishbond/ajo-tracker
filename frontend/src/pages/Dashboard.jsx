import { useEffect, useState } from "react";
import { getGroups } from "../api/groups";
import { useAuth } from "../context/AuthContext";
import GroupCard from "../components/GroupCard";
import CreateGroupModal from "../components/CreateGroupModal";

export default function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  const fetchGroups = async () => {
    try {
      const res = await getGroups();
      setGroups(res.data.groups || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-500">Fintech Solutions</span>
            <h1 className="text-2xl font-black tracking-tight text-white">Ajo Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Account</p>
              <p className="text-sm font-bold text-slate-200">{user?.name}</p>
            </div>
            <button
              onClick={logout}
              className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-xs font-bold text-slate-400 transition-all hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl transition-all hover:border-slate-700/50 lg:col-span-2">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-[100px]" />
            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Overview</p>
                <h2 className="mt-1 text-3xl font-bold tracking-tight text-white">Your Circles</h2>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-emerald-400 active:scale-95"
              >
                + Create Group
              </button>
            </div>
            <p className="mt-4 max-w-2xl text-slate-400">
              Keep track of members, contributions, and payouts in one polished workspace.
            </p>

            <div className="relative z-10 mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800/50 bg-slate-950/40 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Groups</p>
                <p className="mt-1 text-3xl font-bold text-white">{groups.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-800/50 bg-slate-950/40 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Active Slots</p>
                <p className="mt-1 text-3xl font-bold text-white">
                  {groups.reduce((sum, group) => sum + (group.max_members || 0), 0)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800/50 bg-slate-950/40 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Network Status</p>
                <p className="mt-1 text-xl font-bold text-emerald-400">{groups.length ? "Online" : "Standby"}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-[2rem] border border-slate-800 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Quick Actions</h3>
            <div className="mt-6 flex flex-1 flex-col justify-center gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-5 py-4 text-sm font-bold text-white transition-all hover:border-emerald-500/50 hover:bg-slate-900"
              >
                <span>Start New Circle</span>
                <span className="text-emerald-500">→</span>
              </button>
              <button
                onClick={fetchGroups}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-5 py-4 text-sm font-bold text-slate-400 transition-all hover:border-emerald-500/50 hover:bg-slate-900"
              >
                <span>Sync Dashboard</span>
                <span className="text-slate-600">↺</span>
              </button>
            </div>
          </div>
        </section>

        <div className="mt-12">
          <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white">Active Management</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{groups.length} Circles Found</span>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-[2rem] bg-slate-900/40" />
              ))}
            </div>
          ) : groups.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-800 bg-slate-900/20 text-center">
              <p className="text-sm font-medium text-slate-500">No active groups found. Initialize your first circle to get started.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <CreateGroupModal
          onClose={() => setShowModal(false)}
          onCreated={fetchGroups}
        />
      )}
    </div>
  );
}