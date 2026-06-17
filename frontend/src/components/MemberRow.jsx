export default function MemberRow({ member, hasPaid, onMarkPaid, isCurrentRound }) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-semibold">
          {member.position}
        </div>
        <div>
          <p className="font-medium text-gray-800">{member.name}</p>
          <p className="text-xs text-gray-400">{member.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {member.has_collected && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            Collected
          </span>
        )}

      {isCurrentRound && (
  hasPaid ? (
    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
      Paid
    </span>
  ) : (
    <button
      onClick={() => onMarkPaid(member.user_id)}
      className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200"
    >
      Mark Paid
    </button>
  )
)}
      </div>
    </div>
  );
}