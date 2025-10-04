/* eslint-disable no-unused-vars */
// // frontend/src/Login.jsx
// import { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import { loadPrivateKey } from "./crypto/keyStore";

// export default function Login({ onAuth, switchToRegister }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");

//     try {
//       // 1. Call backend for login
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

//       // 2. Save token + user
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       // 3. Try to load private key
//       const privateKeyJwk = await loadPrivateKey(data.user.id);
//       if (!privateKeyJwk) {
//         console.warn("⚠️ No local private key found. You won’t be able to decrypt old messages on this device.");
//       } else {
//         console.log("✅ Private key restored for user:", data.user.id);
//       }

//       // 4. Move to dashboard
//       onAuth(data.user);
//     } catch (err) {
//       console.error(err);
//       setError("Network error");
//     }
//   }

//   return (
//     <div className="h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">
//       {/* Left branding */}
//       <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8">
//         <h1 className="text-4xl font-bold mb-4">MicroBox Chat 💬</h1>
//         <p className="text-lg leading-relaxed max-w-md text-center">
//           Connect instantly with your team and friends over LAN. Fast, secure
//           and reliable real-time messaging.
//         </p>
//       </div>

//       {/* Right form */}
//       <div className="flex items-center justify-center bg-gray-50">
//         <div className="w-full max-w-sm bg-white rounded-xl shadow-lg px-6 py-8">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Login</h2>

//           {error && (
//             <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
//               type="email"
//               placeholder="you@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <div className="relative">
//               <input
//                 className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm pr-10"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             <button className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-sm">
//               Login
//             </button>
//           </form>

//           <p className="mt-5 text-sm text-center text-gray-600">
//             New here?{" "}
//             <button
//               onClick={switchToRegister}
//               className="text-blue-600 font-semibold hover:underline"
//             >
//               Create an account
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client"

import { useState } from "react"
import { Eye, EyeOff, MessageCircle } from "lucide-react"
import { loadPrivateKey } from "./crypto/keyStore"
import { motion } from "framer-motion"

export default function Login({ onAuth, switchToRegister }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Login failed")
        setLoading(false)
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      const privateKeyJwk = await loadPrivateKey(data.user.id)
      if (!privateKeyJwk) {
        console.warn("⚠️ No local private key found.")
      } else {
        console.log("✅ Private key restored for user:", data.user.id)
      }

      onAuth(data.user)
    } catch (err) {
      console.error(err)
      setError("Network error. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4"
            >
              <MessageCircle className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-blue-100">Sign in to continue chatting</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none pr-12"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{" "}
                <button
                  onClick={switchToRegister}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
