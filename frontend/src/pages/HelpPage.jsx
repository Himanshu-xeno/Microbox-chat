/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
// "use client"

// import { ArrowLeft, HelpCircle, MessageCircle, Book, Mail } from "lucide-react"
// import { motion } from "framer-motion"

// export default function HelpPage({ onBack }) {
//   const helpTopics = [
//     {
//       icon: MessageCircle,
//       title: "Getting Started",
//       description: "Learn how to send messages, create groups, and manage your profile.",
//     },
//     {
//       icon: Book,
//       title: "Privacy & Security",
//       description: "Understand our end-to-end encryption and privacy features.",
//     },
//     {
//       icon: Mail,
//       title: "Account Management",
//       description: "Update your profile, change password, and manage settings.",
//     },
//   ]

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
//             <HelpCircle size={24} className="text-blue-600 dark:text-blue-400" />
//             <h1 className="text-xl font-bold text-slate-900 dark:text-white">Help Center</h1>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="flex-1 overflow-auto p-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="max-w-3xl mx-auto space-y-6"
//         >
//           <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
//             <h2 className="text-3xl font-bold mb-2">How can we help you?</h2>
//             <p className="text-blue-100">Find answers to common questions and learn more about our features.</p>
//           </div>

//           <div className="grid gap-4">
//             {helpTopics.map((topic, idx) => (
//               <motion.div
//                 key={idx}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: idx * 0.1 }}
//                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
//               >
//                 <div className="flex items-start gap-4">
//                   <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
//                     <topic.icon size={24} className="text-blue-600 dark:text-blue-400" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{topic.title}</h3>
//                     <p className="text-slate-600 dark:text-slate-400">{topic.description}</p>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
//             <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h3>
//             <div className="space-y-4">
//               <div>
//                 <h4 className="font-medium text-slate-900 dark:text-white mb-1">How do I send a message?</h4>
//                 <p className="text-sm text-slate-600 dark:text-slate-400">
//                   Select a contact from the sidebar, type your message in the input field, and press Enter or click the
//                   send button.
//                 </p>
//               </div>
//               <div>
//                 <h4 className="font-medium text-slate-900 dark:text-white mb-1">Are my messages encrypted?</h4>
//                 <p className="text-sm text-slate-600 dark:text-slate-400">
//                   Yes! All direct messages use end-to-end encryption to ensure your privacy and security.
//                 </p>
//               </div>
//               <div>
//                 <h4 className="font-medium text-slate-900 dark:text-white mb-1">How do I change my theme?</h4>
//                 <p className="text-sm text-slate-600 dark:text-slate-400">
//                   Go to Settings and toggle between light and dark mode using the theme switcher.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   )
// }


"use client"

import { ArrowLeft, HelpCircle, MessageCircle, Book, Mail } from "lucide-react"
import { motion } from "framer-motion"

export default function HelpPage({ onBack }) {
  const helpTopics = [
    {
      icon: MessageCircle,
      title: "Getting Started",
      description: "Learn how to send messages, create groups, and manage your profile.",
    },
    {
      icon: Book,
      title: "Privacy & Security",
      description: "Understand our end-to-end encryption and privacy features.",
    },
    {
      icon: Mail,
      title: "Account Management",
      description: "Update your profile, change password, and manage settings.",
    },
  ]

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
            <HelpCircle size={24} className="text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Help Center</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">How can we help you?</h2>
            <p className="text-blue-100">Find answers to common questions and learn more about our features.</p>
          </div>

          <div className="grid gap-4">
            {helpTopics.map((topic, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <topic.icon size={24} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{topic.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{topic.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">How do I send a message?</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Select a contact from the sidebar, type your message in the input field, and press Enter or click the
                  send button.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">Are my messages encrypted?</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Yes! All direct messages use end-to-end encryption to ensure your privacy and security.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">How do I change my theme?</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Go to Settings and toggle between light and dark mode using the theme switcher.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
