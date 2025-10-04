/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
// "use client"

// import { ArrowLeft, MessageSquare, Send } from "lucide-react"
// import { motion } from "framer-motion"
// import { useState } from "react"

// export default function FeedbackPage({ onBack }) {
//   const [feedback, setFeedback] = useState("")
//   const [submitted, setSubmitted] = useState(false)

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     // Here you would send feedback to your backend
//     console.log("Feedback submitted:", feedback)
//     setSubmitted(true)
//     setTimeout(() => {
//       setSubmitted(false)
//       setFeedback("")
//     }, 3000)
//   }

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
//             <MessageSquare size={24} className="text-purple-600 dark:text-purple-400" />
//             <h1 className="text-xl font-bold text-slate-900 dark:text-white">Feedback</h1>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="flex-1 overflow-auto p-6">
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
//           <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white mb-6">
//             <h2 className="text-3xl font-bold mb-2">We'd love to hear from you!</h2>
//             <p className="text-purple-100">Your feedback helps us improve and build better features.</p>
//           </div>

//           <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
//             {submitted ? (
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 className="text-center py-12"
//               >
//                 <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Send size={32} className="text-green-600 dark:text-green-400" />
//                 </div>
//                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Thank you for your feedback!</h3>
//                 <p className="text-slate-600 dark:text-slate-400">
//                   We appreciate you taking the time to help us improve.
//                 </p>
//               </motion.div>
//             ) : (
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
//                     What's on your mind?
//                   </label>
//                   <textarea
//                     value={feedback}
//                     onChange={(e) => setFeedback(e.target.value)}
//                     className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none"
//                     rows={8}
//                     placeholder="Share your thoughts, suggestions, or report issues..."
//                     required
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//                 >
//                   <Send size={18} />
//                   Submit Feedback
//                 </button>
//               </form>
//             )}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   )
// }


"use client"

import { ArrowLeft, MessageSquare, Send } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export default function FeedbackPage({ onBack }) {
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would send feedback to your backend
    console.log("Feedback submitted:", feedback)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFeedback("")
    }, 3000)
  }

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
            <MessageSquare size={24} className="text-purple-600 dark:text-purple-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Feedback</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white mb-6">
            <h2 className="text-3xl font-bold mb-2">We'd love to hear from you!</h2>
            <p className="text-purple-100">Your feedback helps us improve and build better features.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={32} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Thank you for your feedback!</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We appreciate you taking the time to help us improve.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    What's on your mind?
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none"
                    rows={8}
                    placeholder="Share your thoughts, suggestions, or report issues..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
