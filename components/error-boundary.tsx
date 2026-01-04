"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Check if error is from a Chrome extension or embed script (more aggressive)
    const errorStack = String(error?.stack || "")
    const errorMessage = String(error?.message || "")
    const errorName = String(error?.name || "")
    
    const isExtensionError = 
      errorStack.includes("chrome-extension://") ||
      errorStack.includes("embed script.js") ||
      errorStack.includes("embed_script.js") ||
      errorStack.includes("moz-extension://") ||
      errorMessage.includes("Minified React error #299") ||
      errorMessage.includes("React error #299") ||
      errorMessage.includes("embed script") ||
      errorMessage.includes("embed_script") ||
      errorName.includes("ChromeExtension") ||
      // Check for the specific extension ID pattern
      /chrome-extension:\/\/[a-z]+\/embed_script\.js/.test(errorStack)
    
    // If it's an extension error, ignore it completely
    if (isExtensionError) {
      // Silently ignore - don't even log to avoid console noise
      return { hasError: false, error: null }
    }
    
    // Only catch real application errors
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Check if error is from a Chrome extension or embed script (more aggressive)
    const errorStack = String(error?.stack || "")
    const errorMessage = String(error?.message || "")
    const errorName = String(error?.name || "")
    const componentStack = String(errorInfo?.componentStack || "")
    
    const isExtensionError = 
      errorStack.includes("chrome-extension://") ||
      errorStack.includes("embed script.js") ||
      errorStack.includes("embed_script.js") ||
      errorStack.includes("moz-extension://") ||
      componentStack.includes("chrome-extension://") ||
      componentStack.includes("embed_script.js") ||
      errorMessage.includes("Minified React error #299") ||
      errorMessage.includes("React error #299") ||
      errorMessage.includes("embed script") ||
      errorMessage.includes("embed_script") ||
      errorName.includes("ChromeExtension") ||
      // Match the specific extension pattern
      /chrome-extension:\/\/[a-z]+\/embed_script\.js/.test(errorStack) ||
      /chrome-extension:\/\/[a-z]+\/embed_script\.js/.test(componentStack)
    
    // Ignore extension errors completely - don't even log
    if (isExtensionError) {
      // Silently reset state to prevent error UI
      this.setState({ hasError: false, error: null })
      return
    }
    
    // Only log real application errors
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    // If error is from extension, just render children
    const errorStack = this.state.error?.stack || ""
    const errorMessage = this.state.error?.message || ""
    
    if (
      errorStack.includes("chrome-extension://") ||
      errorStack.includes("embed script.js") ||
      errorStack.includes("moz-extension://") ||
      errorMessage.includes("Minified React error #299") ||
      errorMessage.includes("embed script") ||
      errorMessage.includes("React error #299")
    ) {
      return this.props.children
    }

    // Only show error UI for real application errors
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle>Something went wrong</CardTitle>
              </div>
              <CardDescription>
                An error occurred while rendering this page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <div className="rounded-md bg-muted p-3">
                  <p className="text-sm font-mono text-destructive">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    this.setState({ hasError: false, error: null })
                    window.location.reload()
                  }}
                  className="flex-1"
                >
                  Reload Page
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="flex-1"
                >
                  Go Back
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                If this persists, try disabling browser extensions or using incognito mode.
              </p>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
