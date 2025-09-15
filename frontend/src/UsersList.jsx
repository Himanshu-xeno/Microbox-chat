import { useEffect, useState } from "react";

export default function UsersList({ currentUser, onSelect, selectedUser, socket }) {
  const [users, setUsers] = useState([]);
  const [online, setOnline] = useState([]); // array of userIds
  const [typingMap, setTypingMap] = useState({}); // userId -> boolean

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
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [currentUser]);

  useEffect(() => {
    if (!socket) return;
    const onlineHandler = (list) => setOnline(list);
    const typingHandler = ({ userId }) => setTypingMap((m) => ({ ...m, [userId]: true }));
    const stopTypingHandler = ({ userId }) => setTypingMap((m) => ({ ...m, [userId]: false }));

    socket.on("onlineUsers", onlineHandler);
    socket.on("typing", typingHandler);
    socket.on("stopTyping", stopTypingHandler);

    // cleanup
    return () => {
      socket.off("onlineUsers", onlineHandler);
      socket.off("typing", typingHandler);
      socket.off("stopTyping", stopTypingHandler);
    };
  }, [socket]);

  return (
    <div className="w-64 border-r p-4">
      <h3 className="font-bold mb-3">Contacts</h3>

      <button
        onClick={() => onSelect({ id: "global", name: "Group Chat", isGroup: true })}
        className={`block w-full text-left p-2 rounded mb-2 ${selectedUser?.id === "global" ? "bg-gray-200" : ""}`}
      >
        Group Chat {online.includes("global") ? <span>●</span> : null}
      </button>

      <div className="space-y-2">
        {users.map((u) => {
          const isOnline = online.includes(u._id);
          return (
            <div key={u._id} className={`flex items-center justify-between p-2 rounded ${selectedUser?.id === u._id ? "bg-gray-200" : ""}`}>
              <button className="text-left flex-1" onClick={() => onSelect({ id: u._id, name: u.name, isGroup: false })}>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: isOnline ? "#22c55e" : "#cbd5e1" }} />
                  <span>{u.name}</span>
                </div>
                {typingMap[u._id] && <div className="text-xs text-gray-500">typing…</div>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
