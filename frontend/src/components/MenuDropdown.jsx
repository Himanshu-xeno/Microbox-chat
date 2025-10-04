/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
// "use client"

// import { useState, useRef, useEffect } from "react"
// import { Menu, HelpCircle, MessageSquare, Settings, LogOut } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"

// export default function MenuDropdown({ onNavigate, onLogout }) {
//   const [isOpen, setIsOpen] = useState(false)
//   const dropdownRef = useRef(null)

//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setIsOpen(false)
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside)
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [])

//   const menuItems = [
//     { icon: HelpCircle, label: "Help", action: () => onNavigate("help") },
//     { icon: MessageSquare, label: "Feedback", action: () => onNavigate("feedback") },
//     { icon: Settings, label: "Settings", action: () => onNavigate("settings") },
//     { icon: LogOut, label: "Logout", action: onLogout, danger: true },
//   ]

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
//       >
//         <Menu size={20} className="text-slate-600 dark:text-slate-300" />
//       </button>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.15 }}
//             className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
//           >
//             {menuItems.map((item, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => {
//                   item.action()
//                   setIsOpen(false)
//                 }}
//                 className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
//                   item.danger ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-slate-300"
//                 }`}
//               >
//                 <item.icon size={18} />
//                 <span className="font-medium">{item.label}</span>
//               </button>
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }


"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, HelpCircle, MessageSquare, Settings, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function MenuDropdown({ onNavigate, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const menuItems = [
    { icon: HelpCircle, label: "Help", action: () => onNavigate("help") },
    { icon: MessageSquare, label: "Feedback", action: () => onNavigate("feedback") },
    { icon: Settings, label: "Settings", action: () => onNavigate("settings") },
    { icon: LogOut, label: "Logout", action: onLogout, danger: true },
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
      >
        <Menu size={20} className="text-slate-600 dark:text-slate-300" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
          >
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  item.action()
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                  item.danger ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-slate-300"
                }`}
              >
                <item.icon size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
