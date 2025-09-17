import { useEffect, useState, useRef } from "react";

function formatDateHeader(date) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString();
}

export default function ChatWindow({ currentUser, selectedUser, socket }) {
  const [messages, setMessages] = useState([]); // oldest -> newest
  const [text, setText] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [typingInfo, setTypingInfo] = useState(null); // { userId, name }
  const containerRef = useRef();
  const bottomRef = useRef();
  const PAGE_LIMIT = 20;

  // load initial page (newest PAGE_LIMIT)
  useEffect(() => {
    if (!selectedUser || !selectedUser.id) return;
    setMessages([]);
    setHasMore(true);
    loadMore(true);
    // after loading, mark seen (for private)
    // handled inside loadMore when finished
    // eslint-disable-next-line
  }, [selectedUser]);

  // function to load older messages (or initial load)
  async function loadMore(initial = false) {
    if (!selectedUser || loadingMore || !hasMore) return;
    setLoadingMore(true);

    const token = localStorage.getItem("token");
    let url;
    const earliest = messages.length ? new Date(messages[0].createdAt) : null;
    const beforeParam = earliest ? `&before=${encodeURIComponent(earliest.toISOString())}` : "";
    const limitParam = `limit=${PAGE_LIMIT}`;
    if (selectedUser.isGroup) {
      url = `http://localhost:5000/api/messages/group/${encodeURIComponent(selectedUser.id)}?${limitParam}${beforeParam}`;
    } else {
      url = `http://localhost:5000/api/messages/${selectedUser.id}?${limitParam}${beforeParam}`;
    }

    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) {
        // data is oldest->newest
        if (data.length < PAGE_LIMIT) setHasMore(false);

        // preserve scroll position when prepending (only when not initial)
        if (!initial && containerRef.current) {
          const prevScrollHeight = containerRef.current.scrollHeight;
          setMessages((prev) => [...data, ...prev]);
          // wait a tick then adjust
          setTimeout(() => {
            const newScrollHeight = containerRef.current.scrollHeight;
            containerRef.current.scrollTop = newScrollHeight - prevScrollHeight;
          }, 50);
        } else {
          setMessages((prev) => [...data, ...prev]);
          // after initial load scroll to bottom
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        }

        // After loading initial page, for private chats mark messages seen
        if (!selectedUser.isGroup) {
          // notify server (socket) to mark as seen
          if (socket) socket.emit("markSeen", { withUserId: selectedUser.id, isGroup: false });
        }
      } else {
        console.error("Failed to load messages", data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }

  // infinite scroll: when scrollTop is near 0 load more
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => {
      if (el.scrollTop < 80 && !loadingMore && hasMore) {
        loadMore(false);
      }
    };
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, [messages, loadingMore, hasMore, selectedUser]);

  // socket listeners
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const newMsgHandler = (msg) => {
      if (!selectedUser) return;
      // filter relevant messages
      if (selectedUser.isGroup) {
        if (msg.group === selectedUser.id) setMessages((p) => [...p, msg]);
      } else {
        const myId = currentUser.id;
        if ((msg.sender === myId && msg.receiver === selectedUser.id) ||
            (msg.sender === selectedUser.id && msg.receiver === myId)) {
          setMessages((p) => [...p, msg]);
        }
      }
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    };

    const typingHandler = ({ userId }) => {
      if (userId === currentUser.id) return; // ignore my own
      setTypingInfo({ userId });
      // clear after 2s if no further typing signals
      setTimeout(() => setTypingInfo(null), 2000);
    };

    const stopTypingHandler = () => setTypingInfo(null);

    socket.on("newMessage", newMsgHandler);
    socket.on("typing", typingHandler);
    socket.on("stopTyping", stopTypingHandler);

    return () => {
      socket.off("newMessage", newMsgHandler);
      socket.off("typing", typingHandler);
      socket.off("stopTyping", stopTypingHandler);
    };
  }, [socket, selectedUser, currentUser]);

  // typing emit (debounced)
  useEffect(() => {
    if (!socket || !selectedUser) return;
    let timeout;
    const handleTyping = () => {
      socket.emit("typing", {
        to: selectedUser.isGroup ? null : selectedUser.id,
        isGroup: !!selectedUser.isGroup,
        groupId: selectedUser.isGroup ? selectedUser.id : null,
      });
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        socket.emit("stopTyping", {
          to: selectedUser.isGroup ? null : selectedUser.id,
          isGroup: !!selectedUser.isGroup,
          groupId: selectedUser.isGroup ? selectedUser.id : null,
        });
      }, 1200);
    };
    if (text.length) handleTyping();
    return () => clearTimeout(timeout);
  }, [text, socket, selectedUser]);

  async function handleSend() {
    if (!text.trim() || !selectedUser || !socket) return;
    const payload = selectedUser.isGroup
      ? { to: null, text, isGroup: true, groupId: selectedUser.id }
      : { to: selectedUser.id, text, isGroup: false };

    socket.emit("sendMessage", payload);
    setText("");
    // do not locally append — server will broadcast back
  }

  if (!selectedUser) return <div className="flex-1 p-6">Select a contact to start chat.</div>;

  // Group messages by date for rendering
  const grouped = messages.reduce((acc, msg) => {
    const day = new Date(msg.createdAt || Date.now()).toDateString();
    if (!acc[day]) acc[day] = [];
    acc[day].push(msg);
    return acc;
  }, {});

  const dayKeys = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b)); // oldest -> newest

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-bold">{selectedUser.name}</h2>
        {typingInfo && <div className="text-sm text-gray-500">typing…</div>}
      </div>

      {/* messages container */}
      <div ref={containerRef} className="flex-1 p-4 overflow-auto space-y-3">
        {loadingMore && <div className="text-center text-sm text-gray-500">Loading earlier messages…</div>}

        {dayKeys.map((day) => (
          <div key={day}>
            <div className="text-center text-xs text-gray-400 my-2">{formatDateHeader(day)}</div>
            {grouped[day].map((m, idx) => {
              const isMine = m.sender === currentUser.id;
              return (
                <div key={m._id || idx} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs p-2 rounded ${isMine ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                    {/* In group chat, show sender name */}
                    {selectedUser.isGroup && !isMine && <div className="text-xs font-semibold">{m.senderName || m.sender}</div>}
                    <div>{m.text}</div>
                    <div className="text-xs text-gray-500 mt-1">{new Date(m.createdAt).toLocaleTimeString()}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 p-2 border"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="px-4 py-2 bg-blue-600 text-white" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
