/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
// "use client"

// import { X, Mail, Clock, Shield } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"

// export default function ProfileModal({ user, isOpen, onClose, isOnline }) {
//   if (!user) return null

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Backdrop */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
//           />

//           {/* Modal */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.9, y: 20 }}
//             className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
//           >
//             {/* Header with gradient */}
//             <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600">
//               <button
//                 onClick={onClose}
//                 className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Avatar */}
//             <div className="relative px-6 pb-6">
//               <div className="absolute -top-16 left-6">
//                 <div className="relative">
//                   <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-white dark:border-slate-800 shadow-xl">
//                     {user.name?.charAt(0)?.toUpperCase() || "U"}
//                   </div>
//                   <span
//                     className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800 ${
//                       isOnline ? "bg-green-500" : "bg-slate-400"
//                     }`}
//                   />
//                 </div>
//               </div>

//               <div className="pt-16">
//                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{user.name}</h2>
//                 <p
//                   className={`text-sm font-medium ${isOnline ? "text-green-600 dark:text-green-400" : "text-slate-500 dark:text-slate-400"}`}
//                 >
//                   {isOnline ? "● Online" : "● Offline"}
//                 </p>

//                 {/* Info Cards */}
//                 <div className="mt-6 space-y-3">
//                   {user.email && (
//                     <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
//                       <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                         <Mail size={18} className="text-blue-600 dark:text-blue-400" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
//                         <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.email}</p>
//                       </div>
//                     </div>
//                   )}

//                   <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
//                     <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
//                       <Clock size={18} className="text-purple-600 dark:text-purple-400" />
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-xs text-slate-500 dark:text-slate-400">Member Since</p>
//                       <p className="text-sm font-medium text-slate-900 dark:text-white">
//                         {new Date().toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
//                     <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
//                       <Shield size={18} className="text-green-600 dark:text-green-400" />
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-xs text-slate-500 dark:text-slate-400">Security</p>
//                       <p className="text-sm font-medium text-slate-900 dark:text-white">End-to-End Encrypted</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   )
// }


"use client"

import { X, Mail, Clock, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function ProfileModal({ user, isOpen, onClose, isOnline }) {
  if (!user) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header with gradient */}
            <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Avatar */}
            <div className="relative px-6 pb-6">
              <div className="absolute -top-16 left-6">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-white dark:border-slate-800 shadow-xl">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span
                    className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800 ${
                      isOnline ? "bg-green-500" : "bg-slate-400"
                    }`}
                  />
                </div>
              </div>

              <div className="pt-16">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{user.name}</h2>
                <p
                  className={`text-sm font-medium ${isOnline ? "text-green-600 dark:text-green-400" : "text-slate-500 dark:text-slate-400"}`}
                >
                  {isOnline ? "● Online" : "● Offline"}
                </p>

                {/* Info Cards */}
                <div className="mt-6 space-y-3">
                  {user.email && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Mail size={18} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.email}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Clock size={18} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Member Since</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Shield size={18} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Security</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">End-to-End Encrypted</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
