"use client";

import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false); // Start closed by default

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full py-4 hidden md:flex md:flex-col bg-card border-r border-border w-[300px] flex-shrink-0 overflow-visible",
        open ? "px-4" : "px-2",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "88px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      {/* Mobile Header Bar */}
      <div
        className={cn(
          "h-14 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-card border-b border-border w-full fixed top-0 left-0 right-0 z-50"
        )}
        {...props}
      >
        <div className="flex justify-start z-20 w-full items-center">
          <Menu
            className="h-6 w-6 text-foreground cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/50 z-[90] md:hidden"
            />
            {/* Sidebar Content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-[280px] top-0 left-0 bg-card border-r border-border z-[100] flex flex-col justify-between p-4 md:hidden overflow-y-auto",
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute right-4 top-4 z-50 text-foreground cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </div>
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  onClick,
  ...props
}: {
  link: Links;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      onClick(e)
    }
  }

  return (
    <Link
      href={link.href}
      onClick={handleClick}
      className={cn(
        "flex items-center justify-start rounded-md transition-colors overflow-visible",
        open ? "gap-3 py-2 px-2" : "justify-center py-2 px-0 w-full",
        className
      )}
      {...props}
    >
      <div className="flex-shrink-0 overflow-visible">
        {link.icon}
      </div>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
          width: animate ? (open ? "auto" : 0) : "auto",
        }}
        className="text-foreground text-sm font-medium group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0 overflow-hidden"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};

