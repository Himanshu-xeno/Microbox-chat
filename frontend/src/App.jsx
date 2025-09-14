import { useEffect } from "react";
import { io } from "socket.io-client";

function App() {
  useEffect(() => {
    // Connect to backend Socket.IO server
    const socket = io("http://localhost:5000");

    // Emit "hello" event with a message to backend
    socket.emit("hello", "Hello from client 💻");

    // Listen for response event "helloResponse"
    socket.on("helloResponse", (msg) => {
      console.log("Server says:", msg);
    });

    // Handle connection errors
    socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    // Cleanup socket connection on component unmount
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
