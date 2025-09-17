// frontend/src/App.jsx
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Register from "./Register";
import Login from "./Login";
import UsersList from "./UsersList";
import ChatWindow from "./ChatWindow";

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
    const s = io("http://localhost:5000", { auth: { token } });
    s.on("connect", () => {
      console.log("Socket connected", s.id);
      s.emit("joinGroup", "global");
    });
    s.on("connect_error", (err) => console.error("Socket error:", err.message));
    setSocket(s);
    return () => s.disconnect();
  }, [user]);

  function handleAuth(userObj) {
    setUser(userObj);
    setView("dashboard");
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {!user ? (
        view === "login" ? (
          <Login onAuth={handleAuth} switchToRegister={() => setView("register")} />
        ) : (
          <Register onAuth={handleAuth} switchToLogin={() => setView("login")} />
        )
      ) : (
        <div className="w-full max-w-6xl h-[90vh] bg-white rounded-xl shadow-lg overflow-hidden flex">
          {/* Sidebar */}
          <div
            className={`${
              selectedUser ? "hidden md:flex" : "flex"
            } md:w-1/3 w-full flex-col border-r`}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg">Welcome, {user.name}</h2>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                onClick={handleLogout}
              >
                Logout
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
            } flex-col`}
          >
            <ChatWindow
              currentUser={user}
              selectedUser={selectedUser}
              socket={socket}
              onBack={() => setSelectedUser(null)} // for mobile back
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
