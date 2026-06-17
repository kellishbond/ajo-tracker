import { Link } from "react-router-dom";

export default function GroupCard({ group }) {
  return (
    <Link
      to={`/groups/${group.id}`}
      className="group block overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/20 transition hover:-translate-y-1 hover:border-emerald-400"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-400">Ajo group</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{group.name}</h3>
        </div>
        <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">
          {group.frequency}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-400">{group.description}</p>

      <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
        <span className="rounded-full bg-slate-950/80 px-3 py-2">₦{group.contribution_amount.toLocaleString()}</span>
        <span className="rounded-full bg-slate-950/80 px-3 py-2">Max {group.max_members} members</span>
      </div>
    </Link>
  );
}
