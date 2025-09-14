import { useState } from "react";

export default function Login({ onAuth, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
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
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onAuth(data.user);
    } catch (err) {
      console.error(err);
      setError("Network error");
    }
  }

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full p-2 border" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full p-2 border" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full p-2 bg-green-600 text-white">Login</button>
      </form>
      <p className="mt-3 text-sm">New here? <button className="text-blue-600" onClick={switchToRegister}>Register</button></p>
    </div>
  );
}
