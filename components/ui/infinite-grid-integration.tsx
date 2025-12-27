"use client"

import React, { useState, useRef, useEffect } from 'react';
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame 
} from "framer-motion";
import { ArrowRight, LogIn, Settings2, Zap, FileText, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

/**
 * Helper component for the SVG grid pattern.
 */
const GridPattern = ({ offsetX, offsetY, size, mounted }: { offsetX: any; offsetY: any; size: number; mounted: boolean }) => {
  if (!mounted) {
    return (
      <svg className="w-full h-full">
        <defs>
          <pattern
            id="grid-pattern-static"
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${size} 0 L 0 0 0 ${size}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-muted-foreground" 
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern-static)" />
      </svg>
    );
  }

  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id="grid-pattern"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground" 
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
};

/**
 * The Infinite Grid Component
 * Displays a scrolling background grid that reveals an active layer on mouse hover.
 */
export const InfiniteGrid = () => {
  const [gridSize, setGridSize] = useState(40);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track mouse position with Motion Values for performance (avoids React re-renders)
  // Always call hooks unconditionally
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mounted) return;
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  // Grid offsets for infinite scroll animation
  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);
  const speedX = 0.5; 
  const speedY = 0.5;

  useAnimationFrame((time, delta) => {
    if (!mounted) return;
    // Throttle to ~30fps for better performance
    if (delta < 33) return;
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    // Reset offset at pattern width to simulate infinity
    gridOffsetX.set((currentX + speedX) % gridSize);
    gridOffsetY.set((currentY + speedY) % gridSize);
  });

  // Create a dynamic radial mask for the "flashlight" effect
  // Always call hooks unconditionally
  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  // Canvas particles effect
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!mounted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    type P = { x: number; y: number; v: number; o: number };
    let ps: P[] = [];
    let raf = 0;
    let lastTime = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const make = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      v: Math.random() * 0.25 + 0.05,
      o: Math.random() * 0.35 + 0.15,
    });

    const init = () => {
      ps = [];
      const count = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < count; i++) ps.push(make());
    };

    const draw = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ps.forEach((p) => {
          p.y -= p.v;
          if (p.y < 0) {
            p.x = Math.random() * canvas.width;
            p.y = canvas.height + Math.random() * 40;
            p.v = Math.random() * 0.25 + 0.05;
            p.o = Math.random() * 0.35 + 0.15;
          }
          ctx.fillStyle = `rgba(0,0,0,${p.o})`;
          ctx.fillRect(p.x, p.y, 0.7, 2.2);
        });
        lastTime = currentTime;
      }
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      setSize();
      init();
    };

    window.addEventListener("resize", onResize);
    init();
    raf = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [mounted]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-background"
      )}
    >
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1 sm:gap-2 hover:opacity-80 transition-opacity">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="text-xl sm:text-2xl font-bold">PayTrack</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Layer 1: Subtle background grid (always visible) */}
      <div className="absolute inset-0 z-0 opacity-[0.05]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} size={gridSize} mounted={mounted} />
      </div>

      {/* Layer 2: Highlighted grid (revealed by mouse mask) */}
      {mounted && (
        <motion.div 
          className="absolute inset-0 z-0 opacity-40"
          style={{ maskImage, WebkitMaskImage: maskImage }}
        >
          <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} size={gridSize} mounted={mounted} />
        </motion.div>
      )}

      {/* Decorative Blur Spheres */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full bg-orange-500/40 dark:bg-orange-600/20 blur-[120px]" />
        <div className="absolute right-[10%] top-[-10%] w-[20%] h-[20%] rounded-full bg-primary/30 blur-[100px]" />
        <div className="absolute left-[-10%] bottom-[-20%] w-[40%] h-[40%] rounded-full bg-blue-500/40 dark:bg-blue-600/20 blur-[120px]" />
      </div>

      {/* Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-30 mix-blend-multiply pointer-events-none"
      />

      {/* Grid Density Control Panel - Hidden on mobile */}
      {mounted && (
        <div className="absolute bottom-10 right-10 z-30 pointer-events-auto hidden md:block">
          <div className="bg-background/80 backdrop-blur-md border border-border p-4 rounded-xl shadow-2xl space-y-3 min-w-[200px]">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Settings2 className="w-4 h-4" />
              Grid Density
            </div>
            <input 
              type="range" 
              min="20" 
              max="100" 
              value={gridSize} 
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
              <span>Dense</span>
              <span>Sparse ({gridSize}px)</span>
            </div>
          </div>
        </div>
      )}

      {/* Content - Always visible */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto space-y-6 md:space-y-8 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium mb-2 md:mb-4">
          <Zap className="h-3 w-3 md:h-4 md:w-4" />
          <span>Simple Invoice & Payment Tracking</span>
        </div>
        
        <div className="space-y-3 md:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-foreground drop-shadow-sm">
            Never Forget Who Paid
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight text-primary">
            Track Invoices Like a Pro
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-muted-foreground max-w-2xl mx-auto px-2">
            PayTrack helps freelancers in Asia manage invoices and payments effortlessly. 
            No complex accounting. Just simple, honest tracking.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto pointer-events-auto px-4 sm:px-0">
          <button 
              onClick={() => router.push('/auth/signup')}
              className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-primary text-primary-foreground font-semibold rounded-md shadow-md border-2 border-transparent transition-all hover:scale-105 hover:-translate-y-1 text-base md:text-lg w-full sm:w-auto"
          >
              Start Free Trial
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          
          <button 
              onClick={() => router.push('/auth/signin')}
              className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-secondary text-secondary-foreground font-semibold rounded-md border-2 border-transparent transition-all hover:scale-105 hover:-translate-y-1 text-base md:text-lg w-full sm:w-auto"
          >
              <LogIn className="w-4 h-4 md:w-5 md:h-5" />
              Sign In
          </button>
        </div>
        
        <p className="text-xs md:text-sm text-muted-foreground pt-2 md:pt-4 px-4">
          Free plan: 1,000 invoices total • No credit card required
        </p>
      </div>
    </div>
  );
};

export default InfiniteGrid;
