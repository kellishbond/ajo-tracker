export default function MemberRow({ member, hasPaid, onMarkPaid, isCurrentRound }) {
  return (
    <div className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-4 text-slate-200 shadow-sm shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-sm font-semibold text-emerald-300">
            {member.position}
          </div>
          <div>
            <p className="text-base font-semibold text-white">{member.name}</p>
            <p className="text-sm text-slate-400">{member.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {member.has_collected && (
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.2em] text-sky-300">
              Collected
            </span>
          )}

          {isCurrentRound && (
            hasPaid ? (
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-300">
                Paid
              </span>
            ) : (
              <button
                onClick={() => onMarkPaid(member.user_id)}
                className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/20"
              >
                Mark paid
              </button>
            )
          )}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 text-sm text-slate-400">
        <div className="rounded-2xl bg-slate-900/85 px-3 py-2">Role: {member.role || "Member"}</div>
        <div className="rounded-2xl bg-slate-900/85 px-3 py-2">Status: {hasPaid ? "Settled" : "Pending"}</div>
      </div>
    </div>
  );
}
