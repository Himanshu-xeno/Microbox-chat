// import { useState } from "react";
// import { Eye, EyeOff } from "lucide-react"; // 👈 install: npm install lucide-react

// export default function Login({ onAuth, switchToRegister }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         setError(data.message || "Login failed");
//         return;
//       }
//       // after setting token & user
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       const privateKey = localStorage.getItem(`privateKey_${data.user.id}`);
//       if (!privateKey) {
//         // Optionally show a UI alert that encryption won't work without private key
//         // For MVP: continue, but user cannot decrypt older messages
//         console.warn(
//           "No local private key found for this account. You won't be able to decrypt existing encrypted messages on this device."
//         );
//       }
//       onAuth(data.user);
//     } catch (err) {
//       console.error(err);
//       setError("Network error");
//     }
//   }


// frontend/src/Login.jsx
// frontend/src/Login.jsx
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loadPrivateKey } from "./crypto/keyStore";

export default function Login({ onAuth, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      // 1. Call backend for login
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // 2. Save token + user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // 3. Try to load private key
      const privateKeyJwk = await loadPrivateKey(data.user.id);
      if (!privateKeyJwk) {
        console.warn("⚠️ No local private key found. You won’t be able to decrypt old messages on this device.");
      } else {
        console.log("✅ Private key restored for user:", data.user.id);
      }

      // 4. Move to dashboard
      onAuth(data.user);
    } catch (err) {
      console.error(err);
      setError("Network error");
    }
  }

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      {/* Left branding */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8">
        <h1 className="text-4xl font-bold mb-4">MicroBox Chat 💬</h1>
        <p className="text-lg leading-relaxed max-w-md text-center">
          Connect instantly with your team and friends over LAN. Fast, secure
          and reliable real-time messaging.
        </p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Login</h2>

          {error && (
            <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm pr-10"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-sm">
              Login
            </button>
          </form>

          <p className="mt-5 text-sm text-center text-gray-600">
            New here?{" "}
            <button
              onClick={switchToRegister}
              className="text-blue-600 font-semibold hover:underline"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
