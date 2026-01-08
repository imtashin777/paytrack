"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { LoginFormSplitScreen } from "@/components/ui/login-form-split-screen"
import { FileText, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function SignInPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleSubmit = async (data: {
    email: string
    password: string
    rememberMe?: boolean
  }) => {
    try {
      setError(null)
      
      console.log("Attempting to sign in with email:", data.email)
      
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      console.log("Sign in result:", result)

      if (result?.error) {
        console.error("Sign in error:", result.error)
        if (result.error === "CredentialsSignin") {
          setError("Invalid email or password. Please check your credentials and try again.")
        } else if (result.error.includes("fetch")) {
          setError("Unable to connect to the server. Please check your internet connection and try again.")
        } else {
          setError(`Login failed: ${result.error}. Please try again or contact support.`)
        }
        return
      } 
      
      if (result?.ok) {
        console.log("Sign in successful, waiting for session to be established...")
        
        // Wait for session cookie to be set
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // Hard redirect to dashboard - ensures session is recognized by middleware
        window.location.href = "/dashboard"
      } else {
        setError("Login failed. Please check your credentials and try again.")
      }
    } catch (err) {
      console.error("Sign in exception:", err)
      setError("An error occurred. Please try again. If the problem persists, check the browser console for details.")
    }
  }

  return (
    <div>
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-destructive text-destructive-foreground px-4 py-3 rounded-md shadow-lg max-w-md w-full mx-4 flex items-center justify-between gap-4">
          <span className="flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="hover:bg-destructive/80 rounded p-1 transition-colors"
            aria-label="Close error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <LoginFormSplitScreen
        logo={
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-white" />
            <span className="text-2xl font-bold text-white">PayTrack</span>
          </Link>
        }
        imageSrc="https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=900"
        imageAlt="A beautiful desert landscape with rolling sand dunes."
        onSubmit={handleSubmit}
        signupHref="/auth/signup"
        forgotPasswordHref="#"
      />
    </div>
  )
}

