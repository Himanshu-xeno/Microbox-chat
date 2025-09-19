// frontend/src/ChatWindow.jsx
import { useEffect, useState, useRef } from "react";
import { Send, ArrowLeft, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWindow({ currentUser, selectedUser, socket, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    if (!selectedUser) return;
    setMessages([]);

    async function loadHistory() {
      const token = localStorage.getItem("token");
      let url = selectedUser.isGroup
        ? `http://localhost:5000/api/messages/group/${encodeURIComponent(selectedUser.id)}`
        : `http://localhost:5000/api/messages/${selectedUser.id}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setMessages(data);
    }
    loadHistory();
  }, [selectedUser]);

  useEffect(() => {
    if (!socket) return;

    const msgHandler = (msg) => {
      if (!selectedUser) return;
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

    const onlineHandler = (list) => setOnlineUsers(list);
    const typingHandler = ({ userId }) => {
      if (userId === selectedUser.id) setIsTyping(true);
    };
    const stopTypingHandler = ({ userId }) => {
      if (userId === selectedUser.id) setIsTyping(false);
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
    if (!text.trim() || !selectedUser) return;
    const payload = selectedUser.isGroup
      ? { to: null, text, isGroup: true, groupId: selectedUser.id }
      : { to: selectedUser.id, text, isGroup: false };
    socket.emit("sendMessage", payload);
    setText("");
    socket.emit("stopTyping", { userId: currentUser.id });
  }

  function handleTyping(e) {
    setText(e.target.value);
    if (e.target.value.length > 0) {
      socket.emit("typing", { userId: currentUser.id });
    } else {
      socket.emit("stopTyping", { userId: currentUser.id });
    }
  }

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a contact to start chat.
      </div>
    );
  }

  const isOnline = onlineUsers.includes(selectedUser.id);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <motion.div
        key={selectedUser.id}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 border-b flex items-center justify-between bg-white"
      >
        <div className="flex items-center gap-3">
          <button className="md:hidden text-gray-600" onClick={onBack}>
            <ArrowLeft size={22} />
          </button>
          <div>
            <h2 className="font-bold">{selectedUser.name}</h2>
            <p className="text-xs text-gray-500">{isOnline ? "Online" : "Offline"}</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 mt-10"
          >
            Start the conversation 👋
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((m, idx) => {
            const isMine = m.sender === currentUser.id;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    isMine
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none shadow"
                  }`}
                >
                  {selectedUser.isGroup && !isMine && (
                    <div className="text-xs font-semibold mb-1">
                      {m.senderName || m.sender}
                    </div>
                  )}
                  <div className="leading-relaxed">{m.text}</div>
                  <div className="text-[10px] text-gray-300 mt-1 text-right">
                    {formatTime(m.createdAt)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-gray-500 text-sm pl-2"
            >
              <span className="flex space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
              </span>
              typing...
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input */}
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
        <button
          className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700"
          onClick={handleSend}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
