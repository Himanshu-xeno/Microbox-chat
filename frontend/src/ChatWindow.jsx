// frontend/src/ChatWindow.jsx
import { useEffect, useState, useRef } from "react";
import { Send, ArrowLeft, Smile, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * formatTime: nice "hh:mm" string for createdAt timestamps
 */
function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * ProfileModal: simple modal to show profile info (user or group)
 */
function ProfileModal({ visible, onClose, selectedUser }) {
  if (!visible || !selectedUser) return null;

  // group: selectedUser.isGroup === true
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg p-6"
      >
        <button className="absolute top-3 right-3 text-gray-600" onClick={onClose}>
          <X />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-2xl">
            {selectedUser.name?.charAt(0)?.toUpperCase() || "G"}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
            <p className="text-sm text-gray-500">
              {selectedUser.isGroup ? "Group" : "User"}
            </p>
          </div>
        </div>

        {/* For groups show member names if provided */}
        {selectedUser.isGroup && selectedUser.members && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Members</h4>
            <ul className="space-y-1 max-h-40 overflow-auto">
              {selectedUser.members.map((m) => (
                <li key={m._id} className="text-sm text-gray-700">
                  {m.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* For users show email if available */}
        {!selectedUser.isGroup && selectedUser.email && (
          <div className="mt-4 text-sm text-gray-700">
            <div><strong>Email:</strong> {selectedUser.email}</div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/**
 * ChatWindow component
 * - shows header (name + online/offline)
 * - clickable avatar opens ProfileModal
 * - messages list with animations
 * - typing indicator
 * - input with send & typing emission
 */
export default function ChatWindow({ currentUser, selectedUser, socket, onBack }) {
  const [messages, setMessages] = useState([]); // messages array
  const [text, setText] = useState(""); // message input
  const [onlineUsers, setOnlineUsers] = useState([]); // from socket
  const [isTyping, setIsTyping] = useState(false); // typing indicator for this chat
  const [profileOpen, setProfileOpen] = useState(false); // profile modal
  const bottomRef = useRef();

  // load message history when selectedUser changes
  useEffect(() => {
    if (!selectedUser) return;
    setMessages([]); // clear while loading

    async function loadHistory() {
      const token = localStorage.getItem("token");
      let url = selectedUser.isGroup
        ? `http://localhost:5000/api/messages/group/${encodeURIComponent(selectedUser.id)}`
        : `http://localhost:5000/api/messages/${selectedUser.id}`;

      try {
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok) {
          // we expect backend to return senderName (or we can derive)
          setMessages(data);
          // scroll to bottom after a short delay
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 120);
        } else {
          console.error("Failed to load messages", data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadHistory();
  }, [selectedUser]);

  // socket listeners: newMessage, onlineUsers, typing, stopTyping
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const msgHandler = (msg) => {
      // filter relevant messages: group OR private matching participants
      if (selectedUser.isGroup) {
        if (msg.group === selectedUser.id) setMessages((p) => [...p, msg]);
      } else {
        const myId = currentUser.id;
        if (
          (msg.sender === myId && msg.receiver === selectedUser.id) ||
          (msg.sender === selectedUser.id && msg.receiver === myId)
        ) {
          setMessages((p) => [...p, msg]);
        }
      }
      // auto-scroll to newest
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    };

    const onlineHandler = (list) => setOnlineUsers(list || []);
    const typingHandler = ({ userId }) => {
      // only show typing when sender is the selected chat participant
      if (!selectedUser) return;
      if (selectedUser.isGroup) {
        // for group we could show "X is typing…" — here we set a boolean if anyone in the group types
        if (userId !== currentUser.id) setIsTyping(true);
      } else {
        if (userId === selectedUser.id) setIsTyping(true);
      }
    };
    const stopTypingHandler = ({ userId }) => {
      if (!selectedUser) return;
      if (selectedUser.isGroup) {
        if (userId !== currentUser.id) setIsTyping(false);
      } else {
        if (userId === selectedUser.id) setIsTyping(false);
      }
    };

    socket.on("newMessage", msgHandler);
    socket.on("onlineUsers", onlineHandler);
    socket.on("typing", typingHandler);
    socket.on("stopTyping", stopTypingHandler);

    return () => {
      socket.off("newMessage", msgHandler);
      socket.off("onlineUsers", onlineHandler);
      socket.off("typing", typingHandler);
      socket.off("stopTyping", stopTypingHandler);
    };
  }, [socket, selectedUser, currentUser]);

  // send message through socket
  function handleSend() {
    if (!text.trim() || !selectedUser || !socket) return;

    const payload = selectedUser.isGroup
      ? { to: null, text, isGroup: true, groupId: selectedUser.id }
      : { to: selectedUser.id, text, isGroup: false };

    // emit sendMessage — server should save and rebroadcast
    socket.emit("sendMessage", payload);

    // clear input and tell peers we stopped typing
    setText("");
    socket.emit("stopTyping", { userId: currentUser.id });

    // Do NOT append optimistically here — server will emit back the saved message
  }

  // handle typing events (emit start/stop)
  function handleTyping(e) {
    const val = e.target.value;
    setText(val);
    if (!socket || !selectedUser) return;

    if (val.length > 0) {
      socket.emit("typing", { userId: currentUser.id });
    } else {
      socket.emit("stopTyping", { userId: currentUser.id });
    }
  }

  // show profile modal when clicking avatar in header
  function openProfile() {
    setProfileOpen(true);

    // Optionally for group: fetch member list if you want live members
    // e.g. fetch(`/api/groups/${selectedUser.id}/members`)
  }

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a contact to start chat.
      </div>
    );
  }

  // determine online status for header: for group we may show "Online" if any members are online
  const isOnline = selectedUser.isGroup
    ? // if selectedUser.members array given, check any member in onlineUsers
      !!(selectedUser.members && selectedUser.members.some((m) => onlineUsers.includes(m._id)))
    : onlineUsers.includes(selectedUser.id);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header: avatar (clickable), name (for group show name not id), online/offline */}
      <motion.div
        key={selectedUser.id}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="p-4 border-b flex items-center justify-between bg-white"
      >
        <div className="flex items-center gap-3">
          {/* back button only visible on mobile */}
          <button className="md:hidden text-gray-600" onClick={onBack}>
            <ArrowLeft size={22} />
          </button>

          {/* Avatar + name */}
          <div className="flex items-center gap-3">
            <button
              onClick={openProfile}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold"
              aria-label="Open profile"
            >
              {selectedUser.name?.charAt(0)?.toUpperCase() || "G"}
            </button>

            <div>
              <h2 className="font-bold">{selectedUser.name}</h2>
              <p className="text-xs text-gray-500">{isOnline ? "Online" : "Offline"}</p>
            </div>
          </div>
        </div>

        {/* right side placeholder (could add call/profile buttons) */}
        <div className="text-sm text-gray-500"> </div>
      </motion.div>

      {/* Messages list */}
      <div className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-400 mt-10">
            Start the conversation 👋
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const isMine = m.sender === currentUser.id;
            // Use m.senderName if backend provides it; otherwise show only when group
            const senderName = m.senderName || (m.sender === currentUser.id ? currentUser.name : null);

            return (
              <motion.div
                key={m._id || m.createdAt + Math.random()}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.12 }}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    isMine ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none shadow"
                  }`}
                >
                  {/* In group chats show sender name above the message (except for my own messages) */}
                  {selectedUser.isGroup && !isMine && (
                    <div className="text-xs font-semibold mb-1 text-gray-700">{senderName || m.sender}</div>
                  )}

                  <div className="leading-relaxed">{m.text}</div>

                  <div className="text-[10px] text-gray-400 mt-1 text-right">{formatTime(m.createdAt)}</div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-2 text-gray-500 text-sm pl-2">
                <span className="flex space-x-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                </span>
                typing...
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="p-3 border-t flex gap-2 bg-white items-center">
        <button className="text-gray-500 hover:text-gray-700">
          <Smile size={22} />
        </button>

        <input
          className="flex-1 p-2 border rounded-full focus:outline-none focus:ring focus:ring-blue-300"
          value={text}
          onChange={handleTyping}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700" onClick={handleSend}>
          <Send size={20} />
        </button>
      </div>

      {/* Profile Modal */}
      <ProfileModal visible={profileOpen} onClose={() => setProfileOpen(false)} selectedUser={selectedUser} />
    </div>
  );
}
