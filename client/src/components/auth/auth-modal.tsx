"use client";

import Image from "next/image";
import { useEffect } from "react";
import { LoginForm, SignupForm } from "@/components/auth/auth-forms";
import { useAuth } from "@/components/providers/auth-provider";

export function AuthModal() {
  const { authOpen, authView, closeAuth, user } = useAuth();

  useEffect(() => {
    if (!authOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuth();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [authOpen, closeAuth]);

  useEffect(() => {
    if (user && authOpen) closeAuth();
  }, [user, authOpen, closeAuth]);

  if (!authOpen) return null;

  const isSignup = authView === "signup";

  return (
    <div className="fixed inset-0 z-[70] hidden items-center justify-center bg-black/20 lg:flex" onClick={closeAuth}>
      <div
        className={`relative w-[796px] rounded-[4px] bg-white px-16 py-6 shadow-[0_8px_40px_rgba(0,0,0,0.12)] ${isSignup ? "min-h-[537px]" : "min-h-[330px]"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeAuth}
          className="absolute right-5 top-4 size-6"
          aria-label="Close"
        >
          <Image src="/icons/close-auth.png" alt="" width={24} height={24} className="size-6 object-contain opacity-50" />
        </button>
        <div className={`grid grid-cols-[220px_265px] justify-between ${isSignup ? "min-h-[489px]" : ""}`}>
          {isSignup ? <SignupForm variant="desktop" /> : <LoginForm variant="desktop" />}
        </div>
      </div>
    </div>
  );
}
