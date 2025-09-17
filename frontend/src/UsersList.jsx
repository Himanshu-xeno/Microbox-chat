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

    return () => {
      socket.off("onlineUsers", onlineHandler);
      socket.off("typing", typingHandler);
      socket.off("stopTyping", stopTypingHandler);
    };
  }, [socket]);

  return (
    <div className="flex-1 overflow-y-auto">
      <button
        onClick={() => onSelect({ id: "global", name: "Group Chat", isGroup: true })}
        className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 hover:bg-gray-100 transition ${
          selectedUser?.id === "global" ? "bg-gray-200" : ""
        }`}
      >
        <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full font-bold">
          G
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Group Chat</span>
          {online.includes("global") && <span className="text-xs text-green-500">● Online</span>}
        </div>
      </button>

      {users.map((u) => {
        const isOnline = online.includes(u._id);
        return (
          <button
            key={u._id}
            className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition ${
              selectedUser?.id === u._id ? "bg-gray-200" : ""
            }`}
            onClick={() => onSelect({ id: u._id, name: u.name, isGroup: false })}
          >
            <div className="relative">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full text-gray-700 font-bold">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                  isOnline ? "bg-green-500" : "bg-gray-400"
                } border border-white`}
              ></span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-medium">{u.name}</span>
              {typingMap[u._id] && <span className="text-xs text-gray-500">typing…</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
