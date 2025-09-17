import { useEffect, useState, useRef } from "react";

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWindow({ currentUser, selectedUser, socket, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
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
    const handler = (msg) => {
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
    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [socket, selectedUser, currentUser]);

  function handleSend() {
    if (!text.trim() || !selectedUser) return;
    const payload = selectedUser.isGroup
      ? { to: null, text, isGroup: true, groupId: selectedUser.id }
      : { to: selectedUser.id, text, isGroup: false };
    socket.emit("sendMessage", payload);
    setText("");
  }

  if (!selectedUser) {
    return <div className="flex-1 flex items-center justify-center text-gray-500">Select a contact to start chat.</div>;
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Back button (mobile only) */}
          <button className="md:hidden text-gray-600" onClick={onBack}>←</button>
          <h2 className="font-bold">{selectedUser.name}</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50">
        {messages.map((m, idx) => {
          const isMine = m.sender === currentUser.id;
          return (
            <div key={idx} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-3 py-2 rounded-lg shadow ${
                  isMine ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                {selectedUser.isGroup && !isMine && (
                  <div className="text-xs font-semibold mb-1">{m.senderName || m.sender}</div>
                )}
                <div>{m.text}</div>
                <div className="text-xs text-gray-400 mt-1 text-right">{formatTime(m.createdAt)}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2 bg-white">
        <input
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
