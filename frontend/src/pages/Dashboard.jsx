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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-700">Ajo Tracker</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hi, {user?.name}</span>
          <button onClick={logout} className="text-sm text-red-500">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Your Groups</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
          >
            + New Group
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : groups.length === 0 ? (
          <p className="text-gray-500">
            No groups yet. Create your first Ajo group!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
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