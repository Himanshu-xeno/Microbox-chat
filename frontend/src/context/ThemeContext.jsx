// "use client"

// import { createContext, useContext, useEffect, useState } from "react"

// const ThemeContext = createContext()

// export function ThemeProvider({ children }) {
//   const [theme, setTheme] = useState(() => {
//     const saved = localStorage.getItem("theme")
//     return saved || "light"
//   })

//   useEffect(() => {
//     const root = window.document.documentElement
//     root.classList.remove("light", "dark")
//     root.classList.add(theme)
//     localStorage.setItem("theme", theme)
//   }, [theme])

//   const toggleTheme = () => {
//     setTheme((prev) => (prev === "light" ? "dark" : "light"))
//   }

//   return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
// }

// export function useTheme() {
//   const context = useContext(ThemeContext)
//   if (!context) {
//     throw new Error("useTheme must be used within ThemeProvider")
//   }
//   return context
// }

// frontend/src/context/ThemeContext.jsx
// Theme context for managing dark/light mode throughout the application

"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()

/**
 * ThemeProvider component that wraps the app and provides theme state
 * Persists theme preference to localStorage
 */
export function ThemeProvider({ children }) {
  // Initialize theme from localStorage or default to light
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme")
      return saved || "light"
    }
    return "light"
  })

  // Apply theme class to document root whenever theme changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(theme)
      localStorage.setItem("theme", theme)
    }
  }, [theme])

  /**
   * Toggles between light and dark theme
   */
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

/**
 * Hook to access theme context
 * @returns {Object} Object containing current theme and toggleTheme function
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
