"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{background:"linear-gradient(160deg,#1a1030 0%,#2d1f50 50%,#1a1030 100%)"}}>
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[8px] rounded-full bg-gradient-to-r from-transparent via-brand-400/80 to-transparent blur-sm"/>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[120px] rounded-full bg-brand-500/15 blur-[60px]"/>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[620px] mx-4 my-8">
        <div className="h-[6px] bg-gradient-to-r from-brand-400 via-brand-500 to-accent-400 rounded-t-3xl"/>
        <div className="bg-white rounded-b-3xl shadow-2xl overflow-hidden flex">

          {/* Left — image */}
          <div className="relative w-[220px] flex-shrink-0 hidden sm:block">
            <Image src="/images/vendor-woman.jpg" alt="Sign up" fill className="object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5"/>
          </div>

          {/* Right — form */}
          <div className="flex-1 px-8 py-10">
            <h1 className="font-display text-[28px] font-bold text-surface-900 mb-6">Sign up</h1>

            <div className="space-y-3 mb-3">
              <input type="email" placeholder="Email" className="w-full border border-surface-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-surface-300 font-body"/>
              <input type="text" placeholder="Name" className="w-full border border-surface-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-surface-300 font-body"/>
              <input type="text" placeholder="Address" className="w-full border border-surface-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-surface-300 font-body"/>
              <div className="relative">
                <input type={showPass?"text":"password"} placeholder="Password" className="w-full border border-surface-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-surface-300 font-body pr-10"/>
                <button onClick={()=>setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer p-0">
                  {showPass?<EyeOff size={15} className="text-surface-400"/>:<Eye size={15} className="text-surface-400"/>}
                </button>
              </div>
              <div className="relative">
                <input type={showConfirm?"text":"password"} placeholder="Confirm Password" className="w-full border border-surface-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-surface-300 font-body pr-10"/>
                <button onClick={()=>setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer p-0">
                  {showConfirm?<EyeOff size={15} className="text-surface-400"/>:<Eye size={15} className="text-surface-400"/>}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 mb-5 cursor-pointer">
              <input type="checkbox" className="accent-brand-600 w-3.5 h-3.5 flex-shrink-0"/>
              <span className="text-[11.5px] text-surface-500">
                Agree to <a href="#" className="text-brand-600 no-underline hover:underline">terms & conditions</a>
              </span>
            </label>

            <button className="w-full bg-brand-600 text-white border-none rounded-xl py-3.5 text-[14px] font-semibold cursor-pointer hover:bg-brand-700 transition-all shadow-glow mb-4">
              Sign up
            </button>

            <p className="text-center text-[12px] text-surface-500">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-600 font-semibold no-underline hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
