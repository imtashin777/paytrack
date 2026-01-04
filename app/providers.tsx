"use client"

import { SessionProvider } from "next-auth/react"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "react-hot-toast"
import { GlobalLoading } from "./global-loading"

// Suppress console errors from browser extensions globally
if (typeof window !== "undefined") {
  const originalError = console.error
  const originalWarn = console.warn
  
  console.error = (...args: any[]) => {
    const errorString = String(args[0] || "")
    // Filter out extension-related errors
    if (
      errorString.includes("Minified React error #299") ||
      errorString.includes("embed script.js") ||
      errorString.includes("chrome-extension://") ||
      errorString.includes("moz-extension://") ||
      errorString.includes("data-new-gr-c-s-check-loaded") ||
      errorString.includes("data-gr-ext-installed")
    ) {
      return // Suppress these errors
    }
    originalError.apply(console, args)
  }
  
  console.warn = (...args: any[]) => {
    const warnString = String(args[0] || "")
    // Filter out extension-related warnings
    if (
      warnString.includes("Extra attributes from the server") ||
      warnString.includes("data-new-gr-c-s-check-loaded") ||
      warnString.includes("data-gr-ext-installed") ||
      warnString.includes("chrome-extension://")
    ) {
      return // Suppress these warnings
    }
    originalWarn.apply(console, args)
  }

  // Catch unhandled errors from extensions (more aggressive)
  window.addEventListener("error", (event) => {
    const msg = String(event.message || "")
    const filename = String(event.filename || "")
    const errorStack = event.error?.stack || ""
    
    if (
      msg.includes("Minified React error #299") ||
      msg.includes("React error #299") ||
      msg.includes("embed script") ||
      filename.includes("embed script.js") ||
      filename.includes("embed_script.js") ||
      filename.includes("chrome-extension://") ||
      filename.includes("moz-extension://") ||
      errorStack.includes("chrome-extension://") ||
      errorStack.includes("embed_script.js") ||
      errorStack.includes("embed script.js")
    ) {
      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation()
      return false
    }
  }, true)

  // Catch unhandled promise rejections from extensions (more aggressive)
  window.addEventListener("unhandledrejection", (event) => {
    const reason = String(event.reason || "")
    const reasonStack = event.reason?.stack || ""
    
    if (
      reason.includes("embed script") ||
      reason.includes("chrome-extension://") ||
      reason.includes("React error #299") ||
      reason.includes("Minified React error #299") ||
      reasonStack.includes("chrome-extension://") ||
      reasonStack.includes("embed_script.js")
    ) {
      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation()
      return false
    }
  }, true)
  
  // Override React's error handling if possible
  if (window.React?.createRoot) {
    const originalCreateRoot = window.React.createRoot
    // Try to wrap createRoot to catch errors
    try {
      window.React.createRoot = function(...args: any[]) {
        try {
          return originalCreateRoot.apply(this, args)
        } catch (error: any) {
          const errorStr = String(error?.message || "")
          const stackStr = String(error?.stack || "")
          
          if (
            errorStr.includes("React error #299") ||
            errorStr.includes("Minified React error #299") ||
            stackStr.includes("chrome-extension://") ||
            stackStr.includes("embed_script.js")
          ) {
            console.warn("Suppressed extension React error")
            // Return a dummy root object to prevent crash
            return {
              render: () => {},
              unmount: () => {},
            } as any
          }
          throw error
        }
      }
    } catch (e) {
      // If we can't override, that's okay
    }
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <SessionProvider>
        {/* GlobalLoading disabled - was causing slow page transitions */}
        {children}
        <Toaster position="top-right" />
      </SessionProvider>
    </ErrorBoundary>
  )
}
