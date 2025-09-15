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
  const [view, setView] = useState("login"); // login/register
  const [socket, setSocket] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // connect socket when user logs in
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    const s = io("http://localhost:5000", { auth: { token } });
    s.on("connect", () => {
      console.log("Socket connected", s.id);
      // join default group
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
    <div className="min-h-screen bg-gray-100 p-6">
      {!user ? (
        view === "login" ? (
          <Login onAuth={handleAuth} switchToRegister={() => setView("register")} />
        ) : (
          <Register onAuth={handleAuth} switchToLogin={() => setView("login")} />
        )
      ) : (
        <div className="max-w-5xl mx-auto bg-white p-4 rounded shadow flex">
          <div className="flex-shrink-0">
            <div className="p-4">
              <h2 className="font-bold">Welcome, {user.name}</h2>
              <div className="mt-2">
                {/* <button className="px-3 py-1 mr-2 border" onClick={() => alert("Socket id: " + (socket ? socket.id : "not connected"))}>Socket Info</button> */}
                <button className="px-3 py-1 bg-red-500 text-white" onClick={handleLogout}>Logout</button>
              </div>
            </div>
            <UsersList currentUser={user} onSelect={setSelectedUser} selectedUser={selectedUser}  socket={socket}/>
          </div>

          <div className="flex-1">
            <ChatWindow currentUser={user} selectedUser={selectedUser} socket={socket} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
