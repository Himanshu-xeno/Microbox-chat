import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Register from "./Register";
import Login from "./Login";

function App() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const [view, setView] = useState("login"); // 'login' | 'register' | 'dashboard'
  const [socket, setSocket] = useState(null);

  // connect socket only when user is logged in
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    // pass token as auth (socket.io v4 supports auth option)
    const s = io("http://localhost:5000", {
      auth: { token }, // we'll use this later to authenticate socket connections
      // transports: ["websocket"], // optional
    });

    s.on("connect", () => console.log("Socket connected", s.id));
    s.on("server-message", (msg) => console.log("Server message:", msg));

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
        <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Welcome, {user.name} 👋</h1>
            <div>
              <button className="mr-2 px-3 py-1 border" onClick={() => alert("Socket id: " + (socket ? socket.id : "not connected"))}>Socket Info</button>
              <button className="px-3 py-1 bg-red-500 text-white" onClick={handleLogout}>Logout</button>
            </div>
          </div>

          <p className="text-sm text-gray-600">You're logged in. Token saved in localStorage. Tomorrow we'll wire this identity into chat messages.</p>

          {/* demo: call protected route */}
          <ProtectedTest />
        </div>
      )}
    </div>
  );
}

// small component to call /api/me with token and show result
function ProtectedTest() {
  const [result, setResult] = useState(null);

  async function callProtected() {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setResult(JSON.stringify(data));
  }

  return (
    <div className="mt-4">
      <button className="px-3 py-1 bg-blue-600 text-white" onClick={callProtected}>Call protected /api/me</button>
      {result && <pre className="mt-3 p-3 bg-gray-50 border">{result}</pre>}
    </div>
  );
}

export default App;
