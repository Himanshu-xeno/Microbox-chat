// // frontend/src/App.jsx
// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import Register from "./Register";
// import Login from "./Login";
// import UsersList from "./UsersList";
// import ChatWindow from "./ChatWindow";
// import { LogOut } from "lucide-react";

// function App() {
//   const [user, setUser] = useState(() => {
//     const u = localStorage.getItem("user");
//     return u ? JSON.parse(u) : null;
//   });
//   const [view, setView] = useState("login"); // login/register/dashboard
//   const [socket, setSocket] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);

//   // connect socket when user logs in
//   useEffect(() => {
//     if (!user) return;

//     const token = localStorage.getItem("token");

//     const s = io("http://localhost:5000", {
//       auth: { token },
//       autoConnect: true,
//       reconnection: true,
//     });

//     s.on("connect", () => {
//       console.log("✅ Socket connected:", s.id);
//       s.emit("joinGroup", "global");
//     });

//     s.on("connect_error", (err) => {
//       console.error("❌ Socket error:", err.message);

//       // If token invalid/expired → logout
//       if (err.message.includes("jwt expired") || err.message.includes("invalid token")) {
//         handleLogout();
//         alert("Session expired. Please log in again.");
//       }
//     });

//     setSocket(s);

//     return () => {
//       s.disconnect();
//     };
//   }, [user]);

//   function handleAuth(userObj) {
//     setUser(userObj);
//     setView("dashboard");

//     const token = localStorage.getItem("token");

//     if (socket) {
//       socket.auth = { token };
//       socket.connect();
//     }
//   }

//   function handleLogout() {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     if (socket) socket.disconnect();
//     setSocket(null);
//     setUser(null);
//     setSelectedUser(null);
//     setView("login");
//   }

//   return (
//     <div className="min-h-screen bg-[#1e1f22] flex items-center justify-center p-4">
//       {!user ? (
//         view === "login" ? (
//           <Login onAuth={handleAuth} switchToRegister={() => setView("register")} />
//         ) : (
//           <Register onAuth={handleAuth} switchToLogin={() => setView("login")} />
//         )
//       ) : (
//         <div className="w-full max-w-6xl h-[90vh] bg-[#2b2d31] rounded-xl shadow-2xl overflow-hidden flex">
//           {/* Sidebar */}
//           <div
//             className={`${
//               selectedUser ? "hidden md:flex" : "flex"
//             } md:w-1/3 w-full flex-col bg-[#2f3136] border-r border-gray-700`}
//           >
//             {/* Header */}
//             <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-[#202225]">
//               <h2 className="font-bold text-lg text-white truncate">{user.name}</h2>
//               <button
//                 className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//                 onClick={handleLogout}
//               >
//                 <LogOut size={18} />
//               </button>
//             </div>

//             <UsersList
//               currentUser={user}
//               onSelect={setSelectedUser}
//               selectedUser={selectedUser}
//               socket={socket}
//             />
//           </div>

//           {/* Chat Window */}
//           <div
//             className={`flex-1 ${
//               !selectedUser ? "hidden md:flex" : "flex"
//             } flex-col bg-[#36393f]`}
//           >
//             <ChatWindow
//               currentUser={user}
//               selectedUser={selectedUser}
//               socket={socket}
//               onBack={() => setSelectedUser(null)}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


// "use client"

// import { useEffect, useState } from "react"
// import { io } from "socket.io-client"
// import Register from "./Register"
// import Login from "./Login"
// import UsersList from "./UsersList"
// import ChatWindow from "./ChatWindow"
// import MenuDropdown from "./components/MenuDropdown"
// import HelpPage from "./pages/HelpPage"
// import FeedbackPage from "./pages/FeedbackPage"
// import SettingsPage from "./pages/SettingsPage"
// import { ThemeProvider, useTheme } from "./context/ThemeContext"
// import { Moon, Sun } from "lucide-react"

// function AppContent() {
//   const [user, setUser] = useState(() => {
//     const u = localStorage.getItem("user")
//     return u ? JSON.parse(u) : null
//   })
//   const [view, setView] = useState("login")
//   const [socket, setSocket] = useState(null)
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [currentPage, setCurrentPage] = useState("dashboard")
//   const { theme, toggleTheme } = useTheme()

//   useEffect(() => {
//     if (!user) return

//     const token = localStorage.getItem("token")

//     const s = io("http://localhost:5000", {
//       auth: { token },
//       autoConnect: true,
//       reconnection: true,
//     })

//     s.on("connect", () => {
//       console.log("✅ Socket connected:", s.id)
//       s.emit("joinGroup", "global")
//     })

//     s.on("connect_error", (err) => {
//       console.error("❌ Socket error:", err.message)

//       if (err.message.includes("jwt expired") || err.message.includes("invalid token")) {
//         handleLogout()
//         alert("Session expired. Please log in again.")
//       }
//     })

//     setSocket(s)

//     return () => {
//       s.disconnect()
//     }
//   }, [user])

//   function handleAuth(userObj) {
//     setUser(userObj)
//     setView("dashboard")
//     setCurrentPage("dashboard")

//     const token = localStorage.getItem("token")

//     if (socket) {
//       socket.auth = { token }
//       socket.connect()
//     }
//   }

//   function handleLogout() {
//     localStorage.removeItem("token")
//     localStorage.removeItem("user")
//     if (socket) socket.disconnect()
//     setSocket(null)
//     setUser(null)
//     setSelectedUser(null)
//     setView("login")
//     setCurrentPage("dashboard")
//   }

//   function handleNavigate(page) {
//     setCurrentPage(page)
//     setSelectedUser(null)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
//       {!user ? (
//         view === "login" ? (
//           <Login onAuth={handleAuth} switchToRegister={() => setView("register")} />
//         ) : (
//           <Register onAuth={handleAuth} switchToLogin={() => setView("login")} />
//         )
//       ) : (
//         <div className="w-full max-w-7xl h-[90vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex border border-slate-200 dark:border-slate-700">
//           {/* Sidebar */}
//           <div
//             className={`${
//               selectedUser || currentPage !== "dashboard" ? "hidden md:flex" : "flex"
//             } md:w-80 w-full flex-col bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700`}
//           >
//             {/* Header */}
//             <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
//               <div className="flex items-center justify-between mb-3">
//                 <h2 className="font-bold text-lg text-slate-900 dark:text-white truncate">{user.name}</h2>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={toggleTheme}
//                     className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
//                     title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
//                   >
//                     {theme === "dark" ? (
//                       <Sun size={18} className="text-slate-400" />
//                     ) : (
//                       <Moon size={18} className="text-slate-600" />
//                     )}
//                   </button>
//                   <MenuDropdown onNavigate={handleNavigate} onLogout={handleLogout} />
//                 </div>
//               </div>
//               <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
//             </div>

//             <UsersList currentUser={user} onSelect={setSelectedUser} selectedUser={selectedUser} socket={socket} />
//           </div>

//           {/* Main Content Area */}
//           <div
//             className={`flex-1 ${
//               !selectedUser && currentPage === "dashboard" ? "hidden md:flex" : "flex"
//             } flex-col bg-white dark:bg-slate-800`}
//           >
//             {currentPage === "dashboard" && (
//               <ChatWindow
//                 currentUser={user}
//                 selectedUser={selectedUser}
//                 socket={socket}
//                 onBack={() => setSelectedUser(null)}
//               />
//             )}
//             {currentPage === "help" && <HelpPage onBack={() => setCurrentPage("dashboard")} />}
//             {currentPage === "feedback" && <FeedbackPage onBack={() => setCurrentPage("dashboard")} />}
//             {currentPage === "settings" && (
//               <SettingsPage onBack={() => setCurrentPage("dashboard")} currentUser={user} />
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// function App() {
//   return (
//     <ThemeProvider>
//       <AppContent />
//     </ThemeProvider>
//   )
// }

// export default App


"use client"

import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import Register from "./Register"
import Login from "./Login"
import UsersList from "./UsersList"
import ChatWindow from "./ChatWindow"
import MenuDropdown from "./components/MenuDropdown"
import HelpPage from "./pages/HelpPage"
import FeedbackPage from "./pages/FeedbackPage"
import SettingsPage from "./pages/SettingsPage"
import { ThemeProvider, useTheme } from "./context/ThemeContext"
import { Moon, Sun } from "lucide-react"

function AppContent() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user")
    return u ? JSON.parse(u) : null
  })
  const [view, setView] = useState("login")
  const [socket, setSocket] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [currentPage, setCurrentPage] = useState("dashboard")
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (!user) return

    const token = localStorage.getItem("token")

    const s = io("http://localhost:5000", {
      auth: { token },
      autoConnect: true,
      reconnection: true,
    })

    s.on("connect", () => {
      console.log("✅ Socket connected:", s.id)
      s.emit("joinGroup", "global")
    })

    s.on("connect_error", (err) => {
      console.error("❌ Socket error:", err.message)

      if (err.message.includes("jwt expired") || err.message.includes("invalid token")) {
        handleLogout()
        alert("Session expired. Please log in again.")
      }
    })

    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [user])

  function handleAuth(userObj) {
    setUser(userObj)
    setView("dashboard")
    setCurrentPage("dashboard")

    const token = localStorage.getItem("token")

    if (socket) {
      socket.auth = { token }
      socket.connect()
    }
  }

  function handleLogout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    if (socket) socket.disconnect()
    setSocket(null)
    setUser(null)
    setSelectedUser(null)
    setView("login")
    setCurrentPage("dashboard")
  }

  function handleNavigate(page) {
    setCurrentPage(page)
    setSelectedUser(null)
  }

  const handleThemeToggle = () => {
    console.log("[v0] Theme toggle button clicked, current theme:", theme)
    console.log("[v0] HTML element classes before toggle:", document.documentElement.className)
    toggleTheme()
    // Log after a short delay to see the change
    setTimeout(() => {
      console.log("[v0] HTML element classes after toggle:", document.documentElement.className)
      console.log("[v0] Computed background color:", window.getComputedStyle(document.body).backgroundColor)
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
      {/* <div className="fixed top-4 right-4 z-50 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-lg">
        Theme: {theme}
      </div> */}

      {!user ? (
        view === "login" ? (
          <Login onAuth={handleAuth} switchToRegister={() => setView("register")} />
        ) : (
          <Register onAuth={handleAuth} switchToLogin={() => setView("login")} />
        )
      ) : (
        <div className="w-full max-w-7xl h-[90vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex border border-slate-200 dark:border-slate-700 transition-colors duration-300">
          <div
            className={`${
              selectedUser || currentPage !== "dashboard" ? "hidden md:flex" : "flex"
            } md:w-80 w-full flex-col bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-colors duration-300`}
          >
            <div className="h-16 p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors duration-300 flex items-center">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-sm text-slate-900 dark:text-white truncate">{user.name}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleThemeToggle}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                    title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {theme === "dark" ? (
                      <Sun size={20} className="text-yellow-400 animate-pulse" />
                    ) : (
                      <Moon size={20} className="text-slate-600 dark:text-slate-400" />
                    )}
                  </button>
                  <MenuDropdown onNavigate={handleNavigate} onLogout={handleLogout} />
                </div>
              </div>
            </div>

            <UsersList currentUser={user} onSelect={setSelectedUser} selectedUser={selectedUser} socket={socket} />
          </div>

          <div
            className={`flex-1 ${
              !selectedUser && currentPage === "dashboard" ? "hidden md:flex" : "flex"
            } flex-col bg-white dark:bg-slate-800 transition-colors duration-300`}
          >
            {currentPage === "dashboard" && (
              <ChatWindow
                currentUser={user}
                selectedUser={selectedUser}
                socket={socket}
                onBack={() => setSelectedUser(null)}
              />
            )}
            {currentPage === "help" && <HelpPage onBack={() => setCurrentPage("dashboard")} />}
            {currentPage === "feedback" && <FeedbackPage onBack={() => setCurrentPage("dashboard")} />}
            {currentPage === "settings" && (
              <SettingsPage onBack={() => setCurrentPage("dashboard")} currentUser={user} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
