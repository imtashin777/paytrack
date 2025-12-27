"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { signUp } from "@/lib/actions/auth"
import { AuthFormSplitScreen } from "@/components/ui/auth-form-split-screen"
import { FileText } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: {
    email: string
    password: string
    rememberMe?: boolean
  }) => {
    try {
      setError(null)
      
      // Sign up the user
      await signUp(data.email, data.password)
      
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
        // Redirect to dashboard
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again."
      setError(errorMessage)
    }
  }

  return (
    <div>
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-destructive text-destructive-foreground px-4 py-2 rounded-md shadow-lg">
          {error}
        </div>
      )}
      <AuthFormSplitScreen
        logo={
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold">PayTrack</span>
          </Link>
        }
        title="Create an account"
        description="Sign up to get started with PayTrack"
        imageSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d29ya3NwYWNlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900"
        imageAlt="A modern workspace with a laptop and notebook."
        onSubmit={handleSubmit}
        forgotPasswordHref="#"
        createAccountHref="/auth/signin"
      />
    </div>
  )
}

