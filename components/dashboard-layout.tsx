"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  CreditCard,
  Settings,
} from "lucide-react"
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar"
import { FileText as FileTextIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [open, setOpen] = useState(false) // Start closed by default

  // No loading check - render immediately
  // Server-side already verified authentication

  // Create links array with active state
  const links = navigation.map((item) => {
    const isActive = pathname === item.href
    const IconComponent = item.icon
    return {
      label: item.name,
      href: item.href,
      icon: (
        <div className={cn(
          "h-10 w-10 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors",
          isActive 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        )}>
          <IconComponent className="h-5 w-5" />
        </div>
      ),
      isActive,
    }
  })

  // Get user email or default
  const userEmail = session?.user?.email || "User"
  const userInitials = userEmail
    .split("@")[0]
    .substring(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row w-full">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Logo */}
            {open ? <PayTrackLogo /> : <PayTrackLogoIcon />}

            {/* Navigation Links */}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  className={cn(
                    link.isActive && "bg-accent text-accent-foreground"
                  )}
                />
              ))}
            </div>
          </div>

          {/* User Section & Sign Out */}
          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            {/* User Avatar/Email */}
            <SidebarLink
              link={{
                label: userEmail,
                href: "#",
                icon: (
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                    {userInitials}
                  </div>
                ),
              }}
              className="cursor-default hover:bg-transparent"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault()
              }}
            />

            {/* Sign Out */}
            <SidebarLink
              link={{
                label: "Sign Out",
                href: "#",
                icon: (
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg flex-shrink-0 bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <LogOut className="h-5 w-5" />
                  </div>
                ),
              }}
              className="text-muted-foreground"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault()
                signOut({ callbackUrl: "/auth/signin" })
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area - Premium Wide Layout */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background text-foreground w-full min-w-0 pt-14 md:pt-0">
        <div className="flex-1 overflow-y-auto overflow-x-hidden w-full">
          {children}
        </div>
      </main>
    </div>
  )
}

// PayTrack Logo Component (Expanded)
export const PayTrackLogo = () => {
  return (
    <Link
      href="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-foreground py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 flex items-center justify-center">
        <FileTextIcon className="h-3 w-3 text-primary-foreground" />
      </div>
      <span className="font-bold text-foreground whitespace-pre">
        PayTrack
      </span>
    </Link>
  )
}

// PayTrack Logo Icon (Collapsed)
export const PayTrackLogoIcon = () => {
  return (
    <Link
      href="/dashboard"
      className="font-normal flex items-center justify-center text-sm text-foreground py-1 relative z-20 w-full"
    >
      <div className="h-10 w-10 bg-primary rounded-lg flex-shrink-0 flex items-center justify-center">
        <FileTextIcon className="h-5 w-5 text-primary-foreground" />
      </div>
    </Link>
  )
}
