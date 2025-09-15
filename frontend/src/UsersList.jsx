// frontend/src/UsersList.jsx
import { useEffect, useState } from "react";

export default function UsersList({ currentUser, onSelect, selectedUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const others = data.filter((u) => u._id !== currentUser.id);
          setUsers(others);
        } else {
          console.error("Failed to load users", data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [currentUser]);

  return (
    <div className="w-64 border-r p-4">
      <h3 className="font-bold mb-3">Contacts</h3>

      <button
        onClick={() => onSelect({ id: "global", name: "Group Chat", isGroup: true })}
        className={`block w-full text-left p-2 rounded mb-2 ${selectedUser?.id === "global" ? "bg-gray-200" : ""}`}
      >
        Group Chat
      </button>

      <div className="space-y-2">
        {users.map((u) => (
          <button
            key={u._id}
            onClick={() => onSelect({ id: u._id, name: u.name, isGroup: false })}
            className={`block w-full text-left p-2 rounded ${selectedUser?.id === u._id ? "bg-gray-200" : ""}`}
          >
            {u.name}
          </button>
        ))}
      </div>
    </div>
  );
}
