"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{background:"linear-gradient(160deg,#1a1030 0%,#2d1f50 50%,#1a1030 100%)"}}>
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[8px] rounded-full bg-gradient-to-r from-transparent via-brand-400/80 to-transparent blur-sm"/>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[120px] rounded-full bg-brand-500/15 blur-[60px]"/>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[600px] mx-4">
        {/* Purple top strip inside card */}
        <div className="h-[6px] bg-gradient-to-r from-brand-400 via-brand-500 to-accent-400 rounded-t-3xl"/>
        <div className="bg-white rounded-b-3xl shadow-2xl overflow-hidden flex">

          {/* Left — image */}
          <div className="relative w-[220px] flex-shrink-0 hidden sm:block">
            <Image src="/images/party-balloons2.jpg" alt="Login" fill className="object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5"/>
          </div>

          {/* Right — form */}
          <div className="flex-1 px-8 py-10">
            <h1 className="font-display text-[28px] font-bold text-surface-900 mb-6">Login</h1>

            {/* Google */}
            <button className="w-full flex items-center justify-center gap-2.5 border border-surface-200 rounded-xl py-3 text-[13px] font-semibold text-surface-700 hover:bg-surface-50 transition-all cursor-pointer bg-white mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with google
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-surface-100"/>
              <span className="text-surface-400 text-[11px]">or</span>
              <div className="flex-1 h-px bg-surface-100"/>
            </div>

            <div className="space-y-3 mb-3">
              <input type="email" placeholder="Email" className="w-full border border-surface-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-surface-300 font-body"/>
              <div className="relative">
                <input type={showPass?"text":"password"} placeholder="Password" className="w-full border border-surface-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-surface-300 font-body pr-10"/>
                <button onClick={()=>setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer p-0">
                  {showPass?<EyeOff size={15} className="text-surface-400"/>:<Eye size={15} className="text-surface-400"/>}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-brand-600 w-3.5 h-3.5"/>
                <span className="text-[11.5px] text-surface-500">Remember me</span>
              </label>
              <a href="#" className="text-[11.5px] text-brand-600 font-semibold no-underline hover:underline">Forgot Password?</a>
            </div>

            <button className="w-full bg-brand-600 text-white border-none rounded-xl py-3.5 text-[14px] font-semibold cursor-pointer hover:bg-brand-700 transition-all shadow-glow mb-4">
              Login
            </button>

            <p className="text-center text-[12px] text-surface-500">
              Don't have an account?{" "}
              <Link href="/signup" className="text-brand-600 font-semibold no-underline hover:underline">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
