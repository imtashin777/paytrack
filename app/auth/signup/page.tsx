"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { signUp } from "@/lib/actions/auth"
import { SignupFormSplitScreen } from "@/components/ui/signup-form-split-screen"
import { FileText, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function SignUpPage() {
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
    firstName: string
    lastName: string
    email: string
    password: string
    termsAccepted: boolean
  }) => {
    try {
      setError(null)
      
      // Sign up the user
      const signupResult = await signUp(data.email, data.password, data.firstName, data.lastName)
      
      // Check if signup returned an error
      if (signupResult?.error) {
        setError(signupResult.error)
        return
      }
      
      if (!signupResult?.success) {
        setError("Failed to create account. Please try again.")
        return
      }
      
      // Automatically sign them in
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Account created but failed to sign in. Please try signing in manually.")
        return
      } else if (result?.ok) {
        // Wait for session cookie to be set
        await new Promise(resolve => setTimeout(resolve, 200))
        // Hard redirect to dashboard - ensures session is recognized
        window.location.href = "/dashboard"
      }
    } catch (err) {
      console.error("Signup error:", err)
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again."
      setError(errorMessage)
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
      <SignupFormSplitScreen
        logo={
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-white" />
            <span className="text-2xl font-bold text-white">PayTrack</span>
          </Link>
        }
        imageSrc="https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=900"
        imageAlt="A beautiful desert landscape with rolling sand dunes."
        onSubmit={handleSubmit}
        loginHref="/auth/signin"
      />
    </div>
  )
}

