/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function UsersList({ currentUser, onSelect, selectedUser, socket }) {
  const [users, setUsers] = useState([]);
  const [online, setOnline] = useState([]); // userIds online
  const [typingMap, setTypingMap] = useState({});
  const [unreadMap, setUnreadMap] = useState({}); // userId -> count

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
    const typingHandler = ({ userId }) => {
      setTypingMap((m) => ({ ...m, [userId]: true }));
    };
    const stopTypingHandler = ({ userId }) => {
      setTypingMap((m) => ({ ...m, [userId]: false }));
    };
    const unreadHandler = ({ from }) => {
      setUnreadMap((m) => ({
        ...m,
        [from]: (m[from] || 0) + 1,
      }));
    };

    socket.on("onlineUsers", onlineHandler);
    socket.on("typing", typingHandler);
    socket.on("stopTyping", stopTypingHandler);
    socket.on("unreadMessage", unreadHandler);

    return () => {
      socket.off("onlineUsers", onlineHandler);
      socket.off("typing", typingHandler);
      socket.off("stopTyping", stopTypingHandler);
      socket.off("unreadMessage", unreadHandler);
    };
  }, [socket]);

  // Reset unread when a chat is opened
  useEffect(() => {
    if (selectedUser) {
      setUnreadMap((m) => ({ ...m, [selectedUser.id]: 0 }));
    }
  }, [selectedUser]);

  const TypingDots = () => (
    <motion.div
      className="flex gap-1"
      initial={{ opacity: 0.4 }}
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.2, repeat: Infinity }}
    >
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
    </motion.div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[#2b2d31] p-3 space-y-2">
      {/* Group Chat */}
      <button
        onClick={() => onSelect({ id: "global", name: "Group Chat", isGroup: true })}
        className={`w-full flex items-center gap-3 p-3 rounded-lg transition 
        ${selectedUser?.id === "global" ? "bg-[#404249]" : "hover:bg-[#383a40]"}`}
      >
        <div className="relative">
          <div className="w-10 h-10 flex items-center justify-center bg-[#5865f2] text-white rounded-full font-bold">
            G
          </div>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-medium text-white">Group Chat</span>
          <span className="text-xs text-gray-400">Community</span>
        </div>
      </button>

      {/* Direct Messages */}
      {users.map((u) => {
        const isOnline = online.includes(u._id);
        const unread = unreadMap[u._id] || 0;

        return (
          <button
            key={u._id}
            onClick={() => onSelect({ id: u._id, name: u.name, isGroup: false })}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition relative
            ${selectedUser?.id === u._id ? "bg-[#404249]" : "hover:bg-[#383a40]"}`}
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 flex items-center justify-center bg-[#313338] rounded-full text-white font-bold">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2b2d31] ${
                  isOnline ? "bg-green-500" : "bg-gray-500"
                }`}
              ></span>
            </div>

            {/* Name + status */}
            <div className="flex flex-col text-left overflow-hidden">
              <span className="font-medium text-white truncate">{u.name}</span>
              {typingMap[u._id] ? (
                <TypingDots />
              ) : (
                <span className="text-xs text-gray-400 truncate">
                  {isOnline ? "Online" : "Offline"}
                </span>
              )}
            </div>

            {/* Unread Badge */}
            {unread > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {unread}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

