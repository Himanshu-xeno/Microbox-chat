// frontend/src/Register.jsx
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { generateKeyPair, exportPublicJwk, exportPrivateJwk } from "./crypto/cryptoUtils";
import { savePrivateKey } from "./crypto/keyStore";

export default function Register({ onAuth, switchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      // 1. Generate key pair (ECDH for end-to-end encryption)
      const kp = await generateKeyPair();
      const publicJwk = await exportPublicJwk(kp.publicKey);
      const privateJwk = await exportPrivateJwk(kp.privateKey);

      // 2. Send registration request with public key
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, publicKey: publicJwk }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      // 3. Save private key securely in IndexedDB (scoped to userId)
      await savePrivateKey(data.user.id, privateJwk);
      console.log("✅ Private key stored for user:", data.user.id);

      // 4. Save JWT + user details in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // 5. Move to dashboard
      onAuth(data.user);
    } catch (err) {
      console.error(err);
      setError("Network error");
    }
  }

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      {/* Left branding */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-pink-500 to-orange-600 text-white p-12">
        <h1 className="text-5xl font-extrabold mb-4">Join MicroBox 🚀</h1>
        <p className="text-lg leading-relaxed max-w-md text-center">
          Create your free account and start chatting with your peers in a secure and private LAN environment.
        </p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg px-8 py-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Register</h2>

          {error && (
            <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm pr-10"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button className="w-full py-3 rounded-xl bg-pink-600 text-white font-semibold hover:bg-pink-700 transition text-sm">
              Register
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <button
              onClick={switchToLogin}
              className="text-pink-600 font-semibold hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
