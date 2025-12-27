"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AuthFormSplitScreen } from "@/components/ui/auth-form-split-screen"
import { FileText } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function SignInPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: {
    email: string
    password: string
    rememberMe?: boolean
  }) => {
    try {
      setError(null)
      
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
        return
      } else if (result?.ok) {
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
        title="Welcome back!"
        description="Sign in by entering the information below"
        imageSrc="https://images.unsplash.com/photo-1714715350295-5f00e902f0d7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2FsbHBhZXJ8ZW58MHwxfDB8fHww&auto=format&fit=crop&q=60&w=900"
        imageAlt="A beautiful landscape with rolling hills and a road."
        onSubmit={handleSubmit}
        forgotPasswordHref="#"
        createAccountHref="/auth/signup"
      />
    </div>
  )
}

