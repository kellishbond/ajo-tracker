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
  const [newMemberId, setNewMemberId] = useState("");
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
      await addMember(id, parseInt(newMemberId));
      setNewMemberId("");
      fetchAll();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to add member");
    }
  };

  if (loading) return <p className="p-8 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4 flex items-center gap-4">
        <Link to="/dashboard" className="text-green-700 text-sm">
          ← Back
        </Link>
        <h1 className="text-lg font-bold">Group #{id} — Round {round}</h1>
      </header>

      <main className="max-w-2xl mx-auto p-6 space-y-6">
        {message && (
          <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded">
            {message}
          </div>
        )}

        {/* Payout Status Card */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="font-semibold mb-3">Payout Status</h2>
          <p className="text-sm text-gray-600">
            {payoutStatus?.paid_count} of {payoutStatus?.total_members} members paid
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Next to collect: <span className="font-medium">{payoutStatus?.recipient_name || "—"}</span>
          </p>

          <button
            onClick={handlePayout}
            disabled={!payoutStatus?.can_payout}
            className={`mt-4 w-full py-2 rounded text-sm font-medium ${
              payoutStatus?.can_payout
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {payoutStatus?.can_payout ? "Process Payout" : "Waiting for all payments"}
          </button>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="font-semibold mb-2">Members</h2>
          {members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              hasPaid={hasPaid(member.user_id)}
              onMarkPaid={handleMarkPaid}
              isCurrentRound={true}
            />
          ))}

          <form onSubmit={handleAddMember} className="flex gap-2 mt-4">
            <input
              type="number"
              placeholder="User ID to add"
              value={newMemberId}
              onChange={(e) => setNewMemberId(e.target.value)}
              className="flex-1 border p-2 rounded text-sm"
              required
            />
            <button
              type="submit"
              className="bg-gray-800 text-white px-4 py-2 rounded text-sm"
            >
              Add
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}