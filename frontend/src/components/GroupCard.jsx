import { Link } from "react-router-dom";

export default function GroupCard({ group }) {
  return (
    <Link
      to={`/groups/${group.id}`}
      className="group relative block overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-emerald-500/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Active Circle</p>
          <h3 className="mt-1 text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">{group.name}</h3>
        </div>
        <span className="rounded-lg bg-slate-950/50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {group.frequency}
        </span>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-400">{group.description}</p>

      <div className="mt-8 flex items-center justify-between border-t border-slate-800/50 pt-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase text-slate-500">Contribution</span>
          <span className="text-lg font-bold text-white">₦{group.contribution_amount.toLocaleString()}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase text-slate-500">Capacity</span>
          <p className="text-sm font-bold text-slate-300">{group.max_members} Members</p>
        </div>
      </div>
    </Link>
  );
}