/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
// "use client"

// import { ArrowLeft, Settings, Moon, Sun, Bell, Lock, User } from "lucide-react"
// import { motion } from "framer-motion"
// import { useTheme } from "../context/ThemeContext"

// export default function SettingsPage({ onBack, currentUser }) {
//   const { theme, toggleTheme } = useTheme()

//   return (
//     <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900">
//       {/* Header */}
//       <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={onBack}
//             className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
//           >
//             <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
//           </button>
//           <div className="flex items-center gap-2">
//             <Settings size={24} className="text-blue-600 dark:text-blue-400" />
//             <h1 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h1>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="flex-1 overflow-auto p-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="max-w-2xl mx-auto space-y-6"
//         >
//           {/* Profile Section */}
//           <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
//             <div className="flex items-center gap-2 mb-4">
//               <User size={20} className="text-blue-600 dark:text-blue-400" />
//               <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profile</h2>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
//                 {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
//               </div>
//               <div>
//                 <p className="font-medium text-slate-900 dark:text-white">{currentUser?.name}</p>
//                 <p className="text-sm text-slate-500 dark:text-slate-400">{currentUser?.email}</p>
//               </div>
//             </div>
//           </div>

//           {/* Appearance Section */}
//           <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
//             <div className="flex items-center gap-2 mb-4">
//               {theme === "dark" ? (
//                 <Moon size={20} className="text-blue-600 dark:text-blue-400" />
//               ) : (
//                 <Sun size={20} className="text-blue-600 dark:text-blue-400" />
//               )}
//               <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h2>
//             </div>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-medium text-slate-900 dark:text-white">Theme</p>
//                 <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark mode</p>
//               </div>
//               <button
//                 onClick={toggleTheme}
//                 className={`relative w-14 h-8 rounded-full transition-colors ${
//                   theme === "dark" ? "bg-blue-600" : "bg-slate-300"
//                 }`}
//               >
//                 <motion.div
//                   layout
//                   className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
//                   animate={{ x: theme === "dark" ? 24 : 0 }}
//                   transition={{ type: "spring", stiffness: 500, damping: 30 }}
//                 >
//                   {theme === "dark" ? (
//                     <Moon size={14} className="text-blue-600" />
//                   ) : (
//                     <Sun size={14} className="text-slate-600" />
//                   )}
//                 </motion.div>
//               </button>
//             </div>
//           </div>

//           {/* Notifications Section */}
//           <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
//             <div className="flex items-center gap-2 mb-4">
//               <Bell size={20} className="text-blue-600 dark:text-blue-400" />
//               <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h2>
//             </div>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium text-slate-900 dark:text-white">Message Notifications</p>
//                   <p className="text-sm text-slate-500 dark:text-slate-400">Get notified for new messages</p>
//                 </div>
//                 <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
//               </div>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium text-slate-900 dark:text-white">Sound</p>
//                   <p className="text-sm text-slate-500 dark:text-slate-400">Play sound for notifications</p>
//                 </div>
//                 <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
//               </div>
//             </div>
//           </div>

//           {/* Privacy Section */}
//           <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
//             <div className="flex items-center gap-2 mb-4">
//               <Lock size={20} className="text-blue-600 dark:text-blue-400" />
//               <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Privacy & Security</h2>
//             </div>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium text-slate-900 dark:text-white">End-to-End Encryption</p>
//                   <p className="text-sm text-slate-500 dark:text-slate-400">Always enabled for your security</p>
//                 </div>
//                 <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
//                   Active
//                 </span>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   )
// }


"use client"

import { ArrowLeft, Settings, Moon, Sun, Bell, Lock, User } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "../context/ThemeContext"

export default function SettingsPage({ onBack, currentUser }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
          <div className="flex items-center gap-2">
            <Settings size={24} className="text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          {/* Profile Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <User size={20} className="text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profile</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{currentUser?.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{currentUser?.email}</p>
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              {theme === "dark" ? (
                <Moon size={20} className="text-blue-600 dark:text-blue-400" />
              ) : (
                <Sun size={20} className="text-blue-600 dark:text-blue-400" />
              )}
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Theme</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark mode</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  theme === "dark" ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <motion.div
                  layout
                  className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                  animate={{ x: theme === "dark" ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {theme === "dark" ? (
                    <Moon size={14} className="text-blue-600" />
                  ) : (
                    <Sun size={14} className="text-slate-600" />
                  )}
                </motion.div>
              </button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={20} className="text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Message Notifications</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Get notified for new messages</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Sound</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Play sound for notifications</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={20} className="text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Privacy & Security</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">End-to-End Encryption</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Always enabled for your security</p>
                </div>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
