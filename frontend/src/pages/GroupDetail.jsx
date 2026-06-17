import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getGroupMembers,
  getContributions,
  markContributionPaid,
  getPayoutStatus,
  processPayout,
  addMember,
} from "../api/groups";
import MemberRow from "../components/MemberRow";

export default function GroupDetail() {
  const { id } = useParams();
  const [members, setMembers] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [payoutStatus, setPayoutStatus] = useState(null);
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(true);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [message, setMessage] = useState("");

  const fetchAll = async () => {
    try {
      const [membersRes, contribRes, statusRes] = await Promise.all([
        getGroupMembers(id),
        getContributions(id, round),
        getPayoutStatus(id, round),
      ]);
      setMembers(membersRes.data.members || []);
      setContributions(contribRes.data.contributions || []);
      setPayoutStatus(statusRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [id, round]);

  const hasPaid = (userId) =>
    contributions.some((c) => c.user_id === userId && c.paid);

  const handleMarkPaid = async (userId) => {
    try {
      await markContributionPaid(id, {
        user_id: userId,
        round,
        amount: 5000, // TODO: pull from group's actual contribution_amount
      });
      fetchAll();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to mark paid");
    }
  };

  const handlePayout = async () => {
    try {
      await processPayout(id, round);
      setMessage("Payout processed! Moving to next round.");
      setRound(round + 1);
    } catch (err) {
      setMessage(err.response?.data?.error || "Payout failed");
    }
  };

const handleAddMember = async (e) => {
  e.preventDefault();
  try {
    await addMember(id, newMemberEmail);
    setNewMemberEmail("");
    setMessage("Member added successfully!");
    fetchAll();
  } catch (err) {
    setMessage(err.response?.data?.error || "Failed to add member");
  }
};
  if (loading) return <p className="p-8 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300">
            <span className="text-lg">←</span> Back
          </Link>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Circle Detail</p>
            <h1 className="text-lg font-bold text-white">Round {round}</h1>
          </div>
          <div className="w-16" /> {/* Spacer */}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
        {message && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center text-sm font-medium text-emerald-300 backdrop-blur-md">
            {message}
          </div>
        )}

        {/* Payout Status Card */}
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-white">Payout Distribution</h2>
              <p className="mt-1 text-sm text-slate-400">Track current round collections</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-emerald-400">{payoutStatus?.paid_count}</span>
              <span className="text-slate-600"> / {payoutStatus?.total_members}</span>
              <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">Paid</p>
            </div>
          </div>

          <div className="mb-8 rounded-3xl bg-slate-950/50 p-6 border border-slate-800/50">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Recipient of the Round</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                <span className="text-emerald-500 font-bold uppercase">{payoutStatus?.recipient_name?.charAt(0) || "?"}</span>
              </div>
              <p className="text-lg font-semibold text-white">{payoutStatus?.recipient_name || "Assigning..."}</p>
            </div>
          </div>

          <button
            onClick={handlePayout}
            disabled={!payoutStatus?.can_payout}
            className={`w-full py-4 rounded-2xl text-sm font-bold transition-all ${
              payoutStatus?.can_payout
                ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-[1.01]"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            {payoutStatus?.can_payout ? "Distribute Payout Funds" : "Awaiting All Member Payments"}
          </button>
        </div>

        {/* Members List */}
        <div className="rounded-[2.5rem] border border-slate-800 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-6 text-xl font-bold text-white">Circle Participants</h2>
          <div className="space-y-2">
            {members.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                hasPaid={hasPaid(member.user_id)}
                onMarkPaid={handleMarkPaid}
                isCurrentRound={true}
              />
            ))}
          </div>

          <form onSubmit={handleAddMember} className="mt-8 flex gap-3">
            <input
              type="email"
              placeholder="Enter member's email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              className="flex-1 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none transition-colors"
              required
            />
            <button
              type="submit"
              className="rounded-2xl bg-slate-800 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-700 hover:text-emerald-400 active:scale-95"
            >
              Invite
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}