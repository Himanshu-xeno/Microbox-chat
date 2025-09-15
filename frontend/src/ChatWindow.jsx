// frontend/src/ChatWindow.jsx
import { useEffect, useState, useRef } from "react";

export default function ChatWindow({ currentUser, selectedUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    if (!selectedUser) return;
    async function loadHistory() {
      const token = localStorage.getItem("token");
      try {
        let url;
        if (selectedUser.isGroup) {
          const groupId = encodeURIComponent(selectedUser.id); // 'global'
          url = `http://localhost:5000/api/messages/group/${groupId}`;
        } else {
          url = `http://localhost:5000/api/messages/${selectedUser.id}`;
        }
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok) setMessages(data);
        else console.error("Failed to load messages", data);
      } catch (err) {
        console.error(err);
      }
      // scroll
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
    loadHistory();
  }, [selectedUser]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      // For group: msg.group === selectedUser.id
      // For private: sender/receiver matching current chat
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

  async function handleSend() {
    if (!text.trim() || !selectedUser) return;
    const payload = selectedUser.isGroup
      ? { to: null, text, isGroup: true, groupId: selectedUser.id }
      : { to: selectedUser.id, text, isGroup: false };

    socket.emit("sendMessage", payload);
    setText("");
    // optimistic UI append (server will also emit back)
    setMessages((p) => [
      ...p,
      { sender: currentUser.id, receiver: selectedUser.isGroup ? null : selectedUser.id, group: selectedUser.isGroup ? selectedUser.id : null, text, createdAt: new Date().toISOString() },
    ]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  if (!selectedUser) return <div className="flex-1 p-6">Select a contact to start chat.</div>;

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-bold">{selectedUser.name}</h2>
      </div>

      <div className="flex-1 p-4 overflow-auto space-y-3">
        {messages.map((m, idx) => {
          const isMine = m.sender === currentUser.id;
          return (
            <div key={idx} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs p-2 rounded ${isMine ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                <div>{m.text}</div>
                <div className="text-xs text-gray-500 mt-1">{new Date(m.createdAt).toLocaleTimeString()}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t flex gap-2">
        <input className="flex-1 p-2 border" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." onKeyDown={(e)=> e.key==='Enter' && handleSend()} />
        <button className="px-4 py-2 bg-blue-600 text-white" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
