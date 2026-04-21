"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { authAPI, saveTokens, saveUser } from "@/lib/api";

export default function LoginPageClient({ dict, lang }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      saveTokens(res.data.access_token, res.data.refresh_token);
      saveUser(res.data.user);
      const role = res.data.user?.role;
      if (role === "admin")  { router.push("/admin");  return; }
      if (role === "vendor") { router.push("/vendor"); return; }
      router.push(`/${lang}/account`);
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4 py-16">

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-brand-100/40 blur-3xl -top-40 -right-40"
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-brand-50 blur-3xl bottom-0 -left-20"
          animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="relative w-full max-w-[440px]">


        {/* Card */}
        <motion.div
          className="bg-white rounded-2xl border border-surface-200 p-8 shadow-sm"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-surface-900 mb-1">{dict.auth.welcomeBack}</h1>
            <p className="text-surface-400 text-sm">{dict.auth.signInSubtitle}</p>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2.5 px-4 py-3 border border-surface-200 rounded-xl text-sm font-medium text-surface-700 bg-white cursor-pointer transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {dict.auth.googleButton}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2.5 px-4 py-3 border border-surface-200 rounded-xl text-sm font-medium text-surface-700 bg-white cursor-pointer transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              {dict.auth.facebookButton}
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-surface-200" />
            <span className="text-xs text-surface-400 font-medium">{dict.auth.orContinueWith}</span>
            <div className="flex-1 h-px bg-surface-200" />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm mb-4">
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">{dict.auth.email}</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                <motion.input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  whileFocus={{ borderColor: "#e11d5c" }}
                  className="w-full pl-10 pr-4 py-3 border border-surface-200 rounded-xl text-sm bg-surface-50 placeholder:text-surface-300 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-surface-700">{dict.auth.password}</label>
                <Link href={`/${lang}/forgot-password`} className="text-xs text-brand-600 no-underline hover:underline">
                  {dict.auth.forgotPassword}
                </Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                <motion.input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  whileFocus={{ borderColor: "#e11d5c" }}
                  className="w-full pl-10 pr-11 py-3 border border-surface-200 rounded-xl text-sm bg-surface-50 placeholder:text-surface-300 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-700 transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 28px -4px rgba(225,29,92,0.36)" }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-brand-600 text-white border-none rounded-xl py-3.5 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  {dict.auth.signInButton} <ArrowRight size={15} />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-surface-400 mt-6">
            {dict.auth.noAccount}{" "}
            <Link href={`/${lang}/signup`} className="text-brand-600 font-semibold no-underline hover:underline">
              {dict.auth.createAccount}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
