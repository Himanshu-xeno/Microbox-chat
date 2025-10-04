// frontend/src/App.jsx
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Register from "./Register";
import Login from "./Login";
import UsersList from "./UsersList";
import ChatWindow from "./ChatWindow";
import { LogOut } from "lucide-react";

function App() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const [view, setView] = useState("login"); // login/register/dashboard
  const [socket, setSocket] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // connect socket when user logs in
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");

    const s = io("http://localhost:5000", {
      auth: { token },
      autoConnect: true,
      reconnection: true,
    });

    s.on("connect", () => {
      console.log("✅ Socket connected:", s.id);
      s.emit("joinGroup", "global");
    });

    s.on("connect_error", (err) => {
      console.error("❌ Socket error:", err.message);

      // If token invalid/expired → logout
      if (err.message.includes("jwt expired") || err.message.includes("invalid token")) {
        handleLogout();
        alert("Session expired. Please log in again.");
      }
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [user]);

  function handleAuth(userObj) {
    setUser(userObj);
    setView("dashboard");

    const token = localStorage.getItem("token");

    if (socket) {
      socket.auth = { token };
      socket.connect();
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (socket) socket.disconnect();
    setSocket(null);
    setUser(null);
    setSelectedUser(null);
    setView("login");
  }

  return (
    <div className="min-h-screen bg-[#1e1f22] flex items-center justify-center p-4">
      {!user ? (
        view === "login" ? (
          <Login onAuth={handleAuth} switchToRegister={() => setView("register")} />
        ) : (
          <Register onAuth={handleAuth} switchToLogin={() => setView("login")} />
        )
      ) : (
        <div className="w-full max-w-6xl h-[90vh] bg-[#2b2d31] rounded-xl shadow-2xl overflow-hidden flex">
          {/* Sidebar */}
          <div
            className={`${
              selectedUser ? "hidden md:flex" : "flex"
            } md:w-1/3 w-full flex-col bg-[#2f3136] border-r border-gray-700`}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-[#202225]">
              <h2 className="font-bold text-lg text-white truncate">{user.name}</h2>
              <button
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                onClick={handleLogout}
              >
                <LogOut size={18} />
              </button>
            </div>

            <UsersList
              currentUser={user}
              onSelect={setSelectedUser}
              selectedUser={selectedUser}
              socket={socket}
            />
          </div>

          {/* Chat Window */}
          <div
            className={`flex-1 ${
              !selectedUser ? "hidden md:flex" : "flex"
            } flex-col bg-[#36393f]`}
          >
            <ChatWindow
              currentUser={user}
              selectedUser={selectedUser}
              socket={socket}
              onBack={() => setSelectedUser(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
