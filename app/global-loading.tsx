"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function GlobalLoading() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [prevPath, setPrevPath] = useState(pathname)

  useEffect(() => {
    // Detect route changes
    if (pathname !== prevPath) {
      setIsLoading(true)
      setPrevPath(pathname)
      
      // Hide loading after route transition
      const timer = setTimeout(() => setIsLoading(false), 200)
      return () => clearTimeout(timer)
    }
  }, [pathname, prevPath])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9998] bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

