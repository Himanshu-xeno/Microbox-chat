import { useEffect, useState, useRef } from "react";
import { Send, ArrowLeft, Smile, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Picker from "emoji-picker-react";

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWindow({ currentUser, selectedUser, socket, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [profileOpen, setProfileOpen] = useState(false);
  const bottomRef = useRef();
  const emojiRef = useRef();

  // --- Load messages when selectedUser changes ---
  useEffect(() => {
    if (!selectedUser) return;
    setMessages([]);

    async function loadHistory() {
      const token = localStorage.getItem("token");
      const url = selectedUser.isGroup
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

  // --- Socket handlers ---
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const msgHandler = (msg) => {
      const myId = currentUser.id;
      if (selectedUser.isGroup) {
        if (msg.group === selectedUser.id) setMessages((p) => [...p, msg]);
      } else if ((msg.sender === myId && msg.receiver === selectedUser.id) || (msg.sender === selectedUser.id && msg.receiver === myId)) {
        setMessages((p) => [...p, msg]);
      }
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    };

    const onlineHandler = (list) => setOnlineUsers(list || []);
    const typingHandler = ({ userId }) => {
      if (selectedUser.isGroup) {
        if (userId !== currentUser.id) setIsTyping(true);
      } else if (userId === selectedUser.id) setIsTyping(true);
    };
    const stopTypingHandler = ({ userId }) => {
      if (selectedUser.isGroup) {
        if (userId !== currentUser.id) setIsTyping(false);
      } else if (userId === selectedUser.id) setIsTyping(false);
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

  // --- Typing & sending ---
  function handleTyping(e) {
    const val = e.target.value;
    setText(val);
    if (!socket || !selectedUser) return;
    if (val.length > 0) socket.emit("typing", { userId: currentUser.id });
    else socket.emit("stopTyping", { userId: currentUser.id });
  }

  function handleSend() {
    if (!text.trim() || !selectedUser || !socket) return;
    const payload = selectedUser.isGroup
      ? { to: null, text, isGroup: true, groupId: selectedUser.id }
      : { to: selectedUser.id, text, isGroup: false };
    socket.emit("sendMessage", payload);
    setText("");
    socket.emit("stopTyping", { userId: currentUser.id });
  }

  // --- Emoji handling ---
  function handleEmojiClick(emojiData) {
    setText((prev) => prev + emojiData.emoji);
  }

  // --- Close emoji picker on outside click ---
  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) setShowEmoji(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!selectedUser) return <div className="flex-1 flex items-center justify-center text-gray-400">Select a contact to start chat.</div>;

  const isOnline = selectedUser.isGroup
    ? !!(selectedUser.members && selectedUser.members.some((m) => onlineUsers.includes(m._id)))
    : onlineUsers.includes(selectedUser.id);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <motion.div key={selectedUser.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="p-2 border-b flex items-center justify-between bg-[#202225]">
        <div className="flex items-center gap-3">
          <button className="md:hidden text-gray-300" onClick={onBack}><ArrowLeft size={22} /></button>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setProfileOpen(true)}>
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold">{selectedUser.name?.charAt(0)?.toUpperCase() || "G"}</div>
            <div>
              <h2 className="font-bold text-white">{selectedUser.name}</h2>
              <p className={`text-xs ${isOnline ? "text-green-500" : "text-gray-400"}`}>{isOnline ? "Online" : "Offline"}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-3 bg-[#36393f]">
        {messages.length === 0 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 mt-10">Start the conversation 👋</motion.div>}

        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const isMine = m.sender === currentUser.id;
            const senderName = m.senderName || (isMine ? currentUser.name : selectedUser.name);
            return (
              <motion.div key={m._id || m.createdAt + Math.random()} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.12 }} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl break-words ${isMine ? "bg-blue-600 text-white rounded-br-none" : "bg-[#40444b] text-white rounded-bl-none"}`}>
                  {selectedUser.isGroup && !isMine && <div className="text-xs font-semibold mb-1 text-blue-200">{senderName}</div>}
                  <div>{m.text}</div>
                  <div className="text-[10px] text-gray-400 mt-1 text-right">{formatTime(m.createdAt)}</div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center gap-2 text-gray-400 text-sm pl-2">
              <span className="flex space-x-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
              </span>
              typing...
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2 bg-[#2f3136] items-center relative">
        <button className="text-gray-300 hover:text-white" onClick={() => setShowEmoji((s) => !s)}><Smile size={22} /></button>

        {showEmoji && (
          <div ref={emojiRef} className="absolute bottom-12 left-0 z-50">
            <Picker onEmojiClick={handleEmojiClick} theme="dark" />
          </div>
        )}

        <input
          className="flex-1 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#40444b] text-white"
          value={text}
          onChange={handleTyping}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition" onClick={handleSend}><Send size={20} /></button>
      </div>
    </div>
  );
}
