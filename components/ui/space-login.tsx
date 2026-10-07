"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, KeyRound, Loader2, Check } from "lucide-react";
import {
  cn,
  GlassInput,
  type GlassVariant,
} from "@/components/ui/liquid-glass";

export { cn, Glass, GlassInput, GLASS_PRESETS, useDarkMode } from "@/components/ui/liquid-glass";
export type { GlassVariant, GlassProps, GlassInputProps } from "@/components/ui/liquid-glass";

export type AuthMode = "signin" | "signup" | "reset";

export interface SpaceLoginProps {
  title?: string;
  subtitle?: string;
  astronautSrc?: string;
  mode?: AuthMode;
  onSubmit?: (data: {
    email: string;
    password: string;
    rememberMe: boolean;
    name?: string;
  }) => Promise<void> | void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  onBackToSignIn?: () => void;
  onSocialLogin?: (
    provider: "google" | "github" | "facebook" | "windows" | "passkey"
  ) => void;
  className?: string;
  defaultEmail?: string;
  showSocialButtons?: boolean;
  glassVariant?: GlassVariant;
}

export const DEFAULT_ASTRONAUT_IMAGE = "/assets/earth.png";

function SparkleStar({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-4 h-4 pointer-events-none select-none", className)}
      style={style}
    >
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-4 h-4", className)} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-4 h-4", className)} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-4 h-4", className)} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function WindowsIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-4 h-4", className)} fill="currentColor" viewBox="0 0 24 24">
      <path d="M0 3.449L9.75 2.1v9.451H0V3.449zm10.75-1.551L24 0v11.551h-13.25V1.898zM0 12.449h9.75v9.451L0 20.551v-8.102zm10.75 0H24V24l-13.25-1.898v-9.653z" />
    </svg>
  );
}

function CosmicStarfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      baseOpacity: number;
      twinkleSpeed: number;
      color: string;
      isSparkle?: boolean;
    }

    let stars: Star[] = [];
    const starColors = ["#ffffff", "#e0f2fe", "#fdf4ff", "#fbcfe8", "#bae6fd"];

    const initStars = () => {
      stars = [];
      const count = Math.floor((width * height) / 3200);
      for (let i = 0; i < count; i++) {
        const isSparkle = Math.random() < 0.08;
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        const baseOpacity = isSparkle
          ? 0.6 + Math.random() * 0.4
          : 0.2 + Math.random() * 0.7;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: isSparkle ? Math.random() * 1.8 + 1.2 : Math.random() * 1.3 + 0.5,
          opacity: baseOpacity,
          baseOpacity,
          twinkleSpeed: 0.008 + Math.random() * 0.02,
          color,
          isSparkle,
        });
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener("resize", handleResize);
    initStars();

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - width / 2) * 0.03;
      targetMouseY = (e.clientY - height / 2) * 0.03;
    };

    window.addEventListener("mousemove", handleMouseMove);

    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      life: number;
    }

    let shootingStars: ShootingStar[] = [];
    let tick = 0;

    const maybeAddShootingStar = () => {
      if (Math.random() < 0.012 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.5),
          length: Math.random() * 80 + 40,
          speed: Math.random() * 9 + 7,
          angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
          life: 1,
        });
      }
    };

    const render = () => {
      tick++;
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.opacity =
          star.baseOpacity + Math.sin(tick * star.twinkleSpeed + i) * 0.35;
        const boundedOpacity = Math.max(0.1, Math.min(1, star.opacity));
        const posX = star.x + currentMouseX * (star.size * 0.8);
        const posY = star.y + currentMouseY * (star.size * 0.8);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = boundedOpacity;

        if (star.isSparkle) {
          const s = star.size * 2.2;
          ctx.beginPath();
          ctx.moveTo(posX, posY - s);
          ctx.lineTo(posX + s * 0.25, posY - s * 0.25);
          ctx.lineTo(posX + s, posY);
          ctx.lineTo(posX + s * 0.25, posY + s * 0.25);
          ctx.lineTo(posX, posY + s);
          ctx.lineTo(posX - s * 0.25, posY + s * 0.25);
          ctx.lineTo(posX - s, posY);
          ctx.lineTo(posX - s * 0.25, posY - s * 0.25);
          ctx.closePath();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(posX, posY, star.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(posX, posY, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      maybeAddShootingStar();

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.life -= 0.015;
        if (ss.life <= 0 || ss.x > width + 100 || ss.y > height + 100) {
          shootingStars.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${ss.life * 0.8})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(
          ss.x - Math.cos(ss.angle) * ss.length,
          ss.y - Math.sin(ss.angle) * ss.length
        );
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
}

export function SpaceLogin({
  title = "Sign In",
  subtitle,
  astronautSrc = DEFAULT_ASTRONAUT_IMAGE,
  mode = "signin",
  onSubmit,
  onForgotPassword,
  onSignUp,
  onBackToSignIn,
  onSocialLogin,
  className,
  defaultEmail = "",
  showSocialButtons = true,
  glassVariant = "default",
}: SpaceLoginProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const copy = {
    signin: { idle: "Sign In", loading: "Signing in...", success: "Welcome Back!" },
    signup: { idle: "Create Account", loading: "Creating account...", success: "Account created" },
    reset: { idle: "Update Password", loading: "Updating...", success: "Password updated" },
  }[mode];

  const handleGlobalMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || isLoading) return;

    if (mode === "signup" && !name.trim()) {
      setFormError("Enter your name.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    if ((mode === "signup" || mode === "reset") && password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setFormError(null);
    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit({ email, password, rememberMe, name: name.trim() });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
      setIsSuccess(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onMouseMove={handleGlobalMouseMove}
      className={cn(
        "relative min-h-screen w-full bg-[#03060f] text-white flex flex-col items-center justify-center overflow-hidden px-4 select-none",
        className
      )}
    >
      <CosmicStarfield />

      <a
        href="/"
        className="absolute top-5 left-5 z-30 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
      >
        ← Back to home
      </a>

      <div className="absolute -bottom-48 sm:-bottom-56 md:-bottom-64 left-1/2 -translate-x-1/2 w-[160vw] max-w-[1900px] h-[480px] sm:h-[550px] md:h-[620px] pointer-events-none z-0">
        <div
          className="w-full h-full rounded-[100%]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(224, 102, 70, 0.95) 0%, rgba(199, 81, 58, 0.75) 20%, rgba(67, 142, 145, 0.5) 42%, rgba(20, 48, 70, 0.25) 60%, transparent 80%)",
            filter: "blur(32px)",
          }}
        />
        <div
          className="absolute inset-0 rounded-[100%] opacity-40 mix-blend-screen"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(255, 170, 110, 0.6) 0%, rgba(94, 219, 210, 0.4) 30%, transparent 65%)",
            filter: "blur(48px)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex items-center justify-center">
        <motion.div
          animate={{ x: mousePos.x * 1.5, y: mousePos.y * 1.5 }}
          transition={{ type: "spring", damping: 30, stiffness: 60 }}
          className="hidden md:block absolute left-2 lg:left-12 xl:left-20 top-1/2 -translate-y-[65%] pointer-events-none z-20"
        >
          <motion.div
            animate={{ y: [-12, 14, -12], rotate: [-2, 3, -2] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <img
              src={astronautSrc}
              alt="Earth"
              className="w-40 sm:w-44 lg:w-52 h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] select-none"
              draggable={false}
            />
            <motion.div
              animate={{ scale: [0.85, 1.25, 0.85], opacity: [0.65, 1, 0.65] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-3 top-1/2 -translate-y-1/2"
            >
              <SparkleStar className="w-6 h-6 text-[#ff4bb8] drop-shadow-[0_0_12px_#ff4bb8]" />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-[420px] mx-auto flex flex-col items-center"
        >
          <h1 className="text-4xl sm:text-[42px] font-extrabold tracking-tight text-white mb-8 sm:mb-9 text-center drop-shadow-sm font-sans">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm text-neutral-400 -mt-6 mb-7 text-center">
              {subtitle}
            </p>
          )}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            {mode === "signup" && (
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="space-name"
                  className="text-base font-semibold text-neutral-200 tracking-wide select-none"
                >
                  Name
                </label>
                <GlassInput
                  id="space-name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant={glassVariant}
                  borderRadius={14}
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label
                htmlFor="space-email"
                className="text-base font-semibold text-neutral-200 tracking-wide select-none"
              >
                Email
              </label>
              <GlassInput
                id="space-email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant={glassVariant}
                borderRadius={14}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="space-password"
                className="text-base font-semibold text-neutral-200 tracking-wide select-none"
              >
                {mode === "reset" ? "New password" : "Password"}
              </label>
              <GlassInput
                id="space-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant={glassVariant}
                borderRadius={14}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="p-1 text-neutral-400 hover:text-neutral-200 focus:outline-none transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 transition-transform active:scale-90" />
                    ) : (
                      <Eye className="w-5 h-5 transition-transform active:scale-90" />
                    )}
                  </button>
                }
              />
            </div>

            {(mode === "signup" || mode === "reset") && (
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="space-confirm"
                  className="text-base font-semibold text-neutral-200 tracking-wide select-none"
                >
                  Confirm password
                </label>
                <GlassInput
                  id="space-confirm"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  variant={glassVariant}
                  borderRadius={14}
                />
              </div>
            )}

            {mode === "signin" && (
            <div className="flex items-center justify-between text-xs sm:text-[13px] pt-1">
              <button
                type="button"
                aria-pressed={rememberMe}
                onClick={() => setRememberMe((value) => !value)}
                className="flex items-center gap-2 cursor-pointer group select-none"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "w-4 h-4 rounded-[4px] border transition-all duration-150 flex items-center justify-center",
                    rememberMe
                      ? "bg-neutral-200 border-neutral-200 text-black"
                      : "border-neutral-600 bg-white/5 group-hover:border-neutral-400"
                  )}
                >
                  {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                </span>
                <span className="text-neutral-300 group-hover:text-white transition-colors">
                  Remember me
                </span>
              </button>

              <button
                type="button"
                onClick={onForgotPassword}
                className="text-neutral-300 hover:text-white font-medium transition-colors hover:underline underline-offset-4 select-none"
              >
                Forget Password ?
              </button>
            </div>
            )}

            {formError && (
              <p role="alert" className="text-sm text-red-300 text-center -mb-1">
                {formError}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={isLoading || isSuccess}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative w-full h-12 mt-2 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center overflow-hidden shadow-lg select-none",
                isSuccess
                  ? "bg-emerald-600 text-white shadow-emerald-500/25"
                  : "bg-[#252831] hover:bg-[#2d313c] active:bg-[#22252e] text-neutral-100 hover:text-white border border-white/10 hover:border-white/20 shadow-black/40"
              )}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-300" />
                    <span>{copy.loading}</span>
                  </motion.div>
                ) : isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-white"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{copy.success}</span>
                  </motion.div>
                ) : (
                  <motion.span
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {copy.idle}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <div className="text-center text-xs sm:text-[13px] text-neutral-400 mt-1">
              {mode === "signin" ? (
                <>
                  <span>Don’t Have an Account ? </span>
                  <button
                    type="button"
                    onClick={onSignUp}
                    className="text-white font-bold hover:underline underline-offset-4 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              ) : mode === "signup" ? (
                <>
                  <span>Already have an account? </span>
                  <button
                    type="button"
                    onClick={onSignUp}
                    className="text-white font-bold hover:underline underline-offset-4 transition-colors"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onBackToSignIn}
                  className="text-white font-bold hover:underline underline-offset-4 transition-colors"
                >
                  Back to Sign In
                </button>
              )}
            </div>

            {showSocialButtons && mode !== "reset" && (
              <div className="w-full flex items-center gap-3 my-1">
                <div className="flex-1 h-[1px] bg-white/[0.08]" />
              </div>
            )}

            {showSocialButtons && mode !== "reset" && (
              <div className="flex items-center justify-center gap-2.5 sm:gap-3 w-full">
                {(
                  [
                    ["google", GoogleIcon, "Sign in with Google"],
                    ["github", GitHubIcon, "Sign in with GitHub"],
                    ["facebook", FacebookIcon, "Sign in with Facebook"],
                    ["windows", WindowsIcon, "Sign in with Windows"],
                  ] as const
                ).map(([provider, Icon, label]) => (
                  <motion.button
                    key={provider}
                    type="button"
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSocialLogin?.(provider)}
                    aria-label={label}
                    className="w-10 h-10 rounded-xl bg-[#242730]/80 hover:bg-[#2e323e] border border-white/10 hover:border-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors backdrop-blur-md shadow-md"
                  >
                    <Icon className={provider === "windows" ? "w-3.5 h-3.5" : "w-4 h-4"} />
                  </motion.button>
                ))}
                <motion.button
                  type="button"
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSocialLogin?.("passkey")}
                  aria-label="Sign in with Passkey"
                  className="w-10 h-10 rounded-xl bg-[#242730]/80 hover:bg-[#2e323e] border border-white/10 hover:border-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors backdrop-blur-md shadow-md"
                >
                  <KeyRound className="w-4 h-4 -rotate-45" />
                </motion.button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default SpaceLogin;
