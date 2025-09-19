import { useEffect, useState, useRef } from "react";
import { Send, ArrowLeft, Smile, X } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function ProfileModal({ visible, onClose, selectedUser }) {
  if (!visible || !selectedUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 w-full max-w-md bg-[#2b2d31] rounded-lg shadow-lg p-6 text-white"
      >
        <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={onClose}>
          <X />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#5865f2] text-white font-bold text-2xl">
            {selectedUser.name?.charAt(0)?.toUpperCase() || "G"}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
            <p className="text-sm text-gray-400">{selectedUser.isGroup ? "Group" : "User"}</p>
          </div>
        </div>

        {selectedUser.isGroup && selectedUser.members && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Members</h4>
            <ul className="space-y-1 max-h-40 overflow-auto text-gray-300">
              {selectedUser.members.map((m) => (
                <li key={m._id} className="text-sm">
                  {m.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!selectedUser.isGroup && selectedUser.email && (
          <div className="mt-4 text-sm text-gray-300">
            <div><strong>Email:</strong> {selectedUser.email}</div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function ChatWindow({ currentUser, selectedUser, socket, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    if (!selectedUser) return;
    setMessages([]);

    async function loadHistory() {
      const token = localStorage.getItem("token");
      let url = selectedUser.isGroup
        ? `http://localhost:5000/api/messages/group/${encodeURIComponent(selectedUser.id)}`
        : `http://localhost:5000/api/messages/${selectedUser.id}`;

      try {
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok) {
          setMessages(data);
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 120);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadHistory();
  }, [selectedUser]);

  useEffect(() => {
    if (!socket || !selectedUser) return;

    const msgHandler = (msg) => {
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
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    };

    const onlineHandler = (list) => setOnlineUsers(list || []);
    const typingHandler = ({ userId }) => {
      if (selectedUser.isGroup) {
        if (userId !== currentUser.id) setIsTyping(true);
      } else {
        if (userId === selectedUser.id) setIsTyping(true);
      }
    };
    const stopTypingHandler = ({ userId }) => {
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

  function handleSend() {
    if (!text.trim() || !selectedUser || !socket) return;

    const payload = selectedUser.isGroup
      ? { to: null, text, isGroup: true, groupId: selectedUser.id }
      : { to: selectedUser.id, text, isGroup: false };

    socket.emit("sendMessage", payload);
    setText("");
    socket.emit("stopTyping", { userId: currentUser.id });
  }

  function handleTyping(e) {
    const val = e.target.value;
    setText(val);
    if (!socket || !selectedUser) return;
    if (val.length > 0) socket.emit("typing", { userId: currentUser.id });
    else socket.emit("stopTyping", { userId: currentUser.id });
  }

  function openProfile() {
    setProfileOpen(true);
  }

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-[#313338]">
        Select a contact to start chat.
      </div>
    );
  }

  const isOnline = selectedUser.isGroup
    ? !!(selectedUser.members && selectedUser.members.some((m) => onlineUsers.includes(m._id)))
    : onlineUsers.includes(selectedUser.id);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#313338] text-white">
      {/* Header */}
      <motion.div
        key={selectedUser.id}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="p-4 border-b border-[#1e1f22] flex items-center justify-between bg-[#2b2d31]"
      >
        <div className="flex items-center gap-3">
          <button className="md:hidden text-gray-400 hover:text-white" onClick={onBack}>
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={openProfile}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#5865f2] font-bold"
            >
              {selectedUser.name?.charAt(0)?.toUpperCase() || "G"}
            </button>
            <div>
              <h2 className="font-bold">{selectedUser.name}</h2>
              <p className="text-xs text-gray-400">{isOnline ? "Online" : "Offline"}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 mt-10">
            Start the conversation 👋
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const isMine = m.sender === currentUser.id;
            const senderName = m.senderName || (isMine ? currentUser.name : null);
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
                    isMine ? "bg-[#5865f2] text-white rounded-br-none" : "bg-[#2b2d31] text-gray-200 rounded-bl-none"
                  }`}
                >
                  {selectedUser.isGroup && !isMine && (
                    <div className="text-xs font-semibold mb-1 text-gray-400">{senderName || m.sender}</div>
                  )}
                  <div>{m.text}</div>
                  <div className="text-[10px] text-gray-400 mt-1 text-right">{formatTime(m.createdAt)}</div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-2 text-gray-400 text-sm pl-2">
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

      {/* Input */}
      <div className="p-3 border-t border-[#1e1f22] flex gap-2 bg-[#2b2d31] items-center">
        <button className="text-gray-400 hover:text-white">
          <Smile size={22} />
        </button>
        <input
          className="flex-1 p-2 rounded-full bg-[#383a40] text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-[#5865f2]"
          value={text}
          onChange={handleTyping}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="p-2 bg-[#5865f2] rounded-full text-white hover:bg-[#4752c4]" onClick={handleSend}>
          <Send size={20} />
        </button>
      </div>

      <ProfileModal visible={profileOpen} onClose={() => setProfileOpen(false)} selectedUser={selectedUser} />
    </div>
  );
}
