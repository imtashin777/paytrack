"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Github,
  Lock,
  Mail,
  ArrowRight,
  Chrome,
} from "lucide-react";
import Link from "next/link";

interface LoginCardSectionProps {
  onSubmit?: (data: { email: string; password: string; rememberMe?: boolean }) => Promise<void>;
  error?: string;
  loading?: boolean;
  mode?: "login" | "signup";
}

export default function LoginCardSection({ 
  onSubmit, 
  error, 
  loading,
  mode = "login"
}: LoginCardSectionProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    type P = { x: number; y: number; v: number; o: number };
    let ps: P[] = [];
    let raf = 0;

    const make = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      v: Math.random() * 0.25 + 0.05,
      o: Math.random() * 0.35 + 0.15,
    });

    const init = () => {
      ps = [];
      const count = Math.floor((canvas.width * canvas.height) / 9000);
      for (let i = 0; i < count; i++) ps.push(make());
    };

    const draw = () => {
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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit({ email, password, rememberMe });
    }
  };

  return (
    <section className="fixed inset-0 bg-white text-zinc-900">
      <style>{`
        .accent-lines{position:absolute;inset:0;pointer-events:none;opacity:.7}
        .hline,.vline{position:absolute;background:#e4e4e7;will-change:transform,opacity}
        .hline{left:0;right:0;height:1px;transform:scaleX(0);transform-origin:50% 50%;animation:drawX .8s cubic-bezier(.22,.61,.36,1) forwards}
        .vline{top:0;bottom:0;width:1px;transform:scaleY(0);transform-origin:50% 0%;animation:drawY .9s cubic-bezier(.22,.61,.36,1) forwards}
        .hline:nth-child(1){top:18%;animation-delay:.12s}
        .hline:nth-child(2){top:50%;animation-delay:.22s}
        .hline:nth-child(3){top:82%;animation-delay:.32s}
        .vline:nth-child(4){left:22%;animation-delay:.42s}
        .vline:nth-child(5){left:50%;animation-delay:.54s}
        .vline:nth-child(6){left:78%;animation-delay:.66s}
        .hline::after,.vline::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(0,0,0,.1),transparent);opacity:0;animation:shimmer .9s ease-out forwards}
        .hline:nth-child(1)::after{animation-delay:.12s}
        .hline:nth-child(2)::after{animation-delay:.22s}
        .hline:nth-child(3)::after{animation-delay:.32s}
        .vline:nth-child(4)::after{animation-delay:.42s}
        .vline:nth-child(5)::after{animation-delay:.54s}
        .vline:nth-child(6)::after{animation-delay:.66s}
        @keyframes drawX{0%{transform:scaleX(0);opacity:0}60%{opacity:.95}100%{transform:scaleX(1);opacity:.7}}
        @keyframes drawY{0%{transform:scaleY(0);opacity:0}60%{opacity:.95}100%{transform:scaleY(1);opacity:.7}}
        @keyframes shimmer{0%{opacity:0}35%{opacity:.25}100%{opacity:0}}

        /* === Card minimal fade-up animation === */
        .card-animate {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.8s cubic-bezier(.22,.61,.36,1) 0.4s forwards;
        }
        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Subtle vignette */}
      <div className="absolute inset-0 pointer-events-none [background:radial-gradient(80%_60%_at_50%_30%,rgba(0,0,0,0.02),transparent_60%)]" />

      {/* Animated accent lines */}
      <div className="accent-lines">
        <div className="hline" />
        <div className="hline" />
        <div className="hline" />
        <div className="vline" />
        <div className="vline" />
        <div className="vline" />
      </div>

      {/* Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-30 mix-blend-multiply pointer-events-none"
      />

      {/* Header */}
      <header className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-4 border-b border-zinc-200">
        <Link href="/" className="text-xs tracking-[0.14em] uppercase text-zinc-600 hover:text-zinc-900 font-semibold">
          PayTrack
        </Link>
        <Button
          variant="outline"
          className="h-9 rounded-lg border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50"
          asChild
        >
          <Link href="/">
            <span className="mr-2">Contact</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </header>

      {/* Centered Login Card */}
      <div className="h-full w-full grid place-items-center px-4">
        <Card className="card-animate w-full max-w-sm border-zinc-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-zinc-900">
              {mode === "signup" ? "Create an account" : "Welcome back"}
            </CardTitle>
            <CardDescription className="text-zinc-600">
              {mode === "signup" 
                ? "Sign up to get started" 
                : "Sign in to your account"}
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-5">
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-zinc-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-zinc-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-zinc-500 hover:text-zinc-700"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {mode === "login" && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      className="border-zinc-300 data-[state=checked]:bg-zinc-900 data-[state=checked]:text-zinc-50"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                      disabled={loading}
                    />
                    <Label htmlFor="remember" className="text-zinc-600">
                      Remember me
                    </Label>
                  </div>
                  <Link href="#" className="text-sm text-zinc-600 hover:text-zinc-900">
                    Forgot password?
                  </Link>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-10 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800"
                disabled={loading}
              >
                {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Continue"}
              </Button>
            </form>

            <div className="relative">
              <Separator className="bg-zinc-800" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-zinc-900/70 px-2 text-[11px] uppercase tracking-widest text-zinc-500">
                or
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-lg border-zinc-800 bg-zinc-950 text-zinc-50 hover:bg-zinc-900/80"
                disabled={loading}
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-lg border-zinc-800 bg-zinc-950 text-zinc-50 hover:bg-zinc-900/80"
                disabled={loading}
              >
                <Chrome className="h-4 w-4 mr-2" />
                Google
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-center text-sm text-zinc-400">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <Link href="/auth/signin" className="ml-1 text-zinc-200 hover:underline">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" className="ml-1 text-zinc-200 hover:underline">
                  Create one
                </Link>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
