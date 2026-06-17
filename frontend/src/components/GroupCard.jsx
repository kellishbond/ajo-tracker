import { Link } from "react-router-dom";

export default function GroupCard({ group }) {
  return (
    <Link
      to={`/groups/${group.id}`}
      className="block bg-white rounded-lg shadow p-5 hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold text-gray-800">{group.name}</h3>
      <p className="text-gray-500 text-sm mt-1">{group.description}</p>

      <div className="flex justify-between mt-4 text-sm text-gray-600">
        <span>₦{group.contribution_amount.toLocaleString()}</span>
        <span className="capitalize">{group.frequency}</span>
      </div>

      <div className="mt-2 text-xs text-gray-400">
        Max {group.max_members} members
      </div>
    </Link>
  );
}