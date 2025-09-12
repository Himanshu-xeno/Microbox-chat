import { useEffect } from "react";
import { io } from "socket.io-client";

function App() {
  useEffect(() => {
    // Connect to backend
    const socket = io("http://localhost:5000");

    // Send a message after connecting
    socket.emit("message", "Hello from client 💻");

    // Listen for server reply
    socket.on("server-message", (msg) => {
      console.log("Server says:", msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold">MicroBox Chat 🚀</h1>
    </div>
  );
}

export default App;
