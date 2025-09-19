// frontend/src/UsersList.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * UsersList component
 * Props:
 * - currentUser: logged-in user object
 * - onSelect: function({ id, name, isGroup }) -> called when user picks chat
 * - selectedUser: currently opened chat
 * - socket: socket.io client instance
 * - unreadCounts: object mapping chatId -> number
 */
export default function UsersList({
  currentUser,
  onSelect,
  selectedUser,
  socket,
  unreadCounts = {},
}) {
  const [users, setUsers] = useState([]);
  const [online, setOnline] = useState([]); // array of userIds
  const [typingMap, setTypingMap] = useState({}); // userId -> boolean

  // load users from backend (exclude current user)
  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          // filter out current user
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

  // subscribe to socket events for online/typing
  useEffect(() => {
    if (!socket) return;

    const onlineHandler = (list) => setOnline(list || []);
    const typingHandler = ({ userId }) =>
      setTypingMap((m) => ({ ...m, [userId]: true }));
    const stopTypingHandler = ({ userId }) =>
      setTypingMap((m) => ({ ...m, [userId]: false }));

    socket.on("onlineUsers", onlineHandler);
    socket.on("typing", typingHandler);
    socket.on("stopTyping", stopTypingHandler);

    return () => {
      socket.off("onlineUsers", onlineHandler);
      socket.off("typing", typingHandler);
      socket.off("stopTyping", stopTypingHandler);
    };
  }, [socket]);

  // helper to render avatar with gradient
  function Avatar({ name }) {
    const initial = (name && name.charAt(0).toUpperCase()) || "?";
    return (
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold">
        {initial}
      </div>
    );
  }

  return (
    <div className="w-full md:w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <h2 className="text-xl font-semibold p-4 border-b border-gray-200">Chats</h2>

      <ul>
        {/* Group Chat (global) */}
        <motion.li
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center p-3 mx-2 my-1 cursor-pointer rounded-lg transition 
            ${selectedUser?.id === "global" ? "bg-blue-100" : "hover:bg-gray-100"}`}
          onClick={() => onSelect({ id: "global", name: "Group Chat", isGroup: true })}
        >
          <div className="relative">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold">
              G
            </div>
          </div>

          <div className="ml-3 flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="font-medium">Group Chat</span>
              {/* unread badge for group */}
              {unreadCounts["global"] > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500 text-white">
                  {unreadCounts["global"]}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {online.includes("global") ? <span className="text-green-500">● Online</span> : "Offline"}
            </div>
          </div>
        </motion.li>

        {/* Direct chats */}
        {users.map((u) => {
          const isOnline = online.includes(u._id);
          const isTyping = typingMap[u._id];
          const unread = unreadCounts[u._id] || 0;

          return (
            <motion.li
              key={u._id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect({ id: u._id, name: u.name, isGroup: false })}
              className={`flex items-center p-3 mx-2 my-1 cursor-pointer rounded-lg transition 
                ${selectedUser?.id === u._id ? "bg-blue-100" : "hover:bg-gray-100"}`}
            >
              {/* Avatar + online dot */}
              <div className="relative">
                <Avatar name={u.name} />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white 
                  ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
                ></span>
              </div>

              {/* Name / status / unread / typing */}
              <div className="ml-3 flex flex-col text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{u.name}</span>
                  {unread > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500 text-white">
                      {unread}
                    </span>
                  )}
                </div>

                {/* typing or online/offline */}
                {isTyping ? (
                  <span className="text-xs text-blue-500 animate-pulse">typing…</span>
                ) : (
                  <span className="text-xs text-gray-500">
                    {isOnline ? "Online" : "Offline"}
                  </span>
                )}
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
