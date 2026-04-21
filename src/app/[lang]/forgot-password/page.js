"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { authAPI } from "@/lib/api";

export default function ForgotPasswordPage() {
  const { lang } = useParams();
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setLoading(true);
    try {
      await authAPI.forgotPassword(email.trim().toLowerCase());
      setSent(true);
    } catch (err) {
      // Backend always returns success to avoid email enumeration,
      // but handle network/server errors
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4 py-16">

      {/* Background blobs */}
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

        <motion.div
          className="bg-white rounded-2xl border border-surface-200 p-8 shadow-sm"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {sent ? (
            /* ── Success state ── */
            <motion.div
              className="text-center py-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-surface-900 mb-2">Check your email</h1>
              <p className="text-surface-400 text-sm mb-2">
                If <span className="font-semibold text-surface-700">{email}</span> is registered, we've sent a password reset link.
              </p>
              <p className="text-surface-400 text-xs mb-8">
                Didn't get it? Check your spam folder or try again below.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => { setSent(false); setEmail(""); }}
                  className="w-full border border-surface-200 bg-white text-surface-700 rounded-xl py-3 text-sm font-semibold cursor-pointer hover:bg-surface-50 transition-colors"
                >
                  Try a different email
                </button>
                <Link href={`/${lang}/login`} className="no-underline block">
                  <button className="w-full bg-brand-600 text-white border-none rounded-xl py-3 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors flex items-center justify-center gap-2">
                    <ArrowLeft size={14} /> Back to Sign In
                  </button>
                </Link>
              </div>
            </motion.div>
          ) : (
            /* ── Form state ── */
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-bold text-surface-900 mb-1">Forgot your password?</h1>
                <p className="text-surface-400 text-sm">
                  No worries. Enter your email and we'll send you a reset link.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm mb-5">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                    <motion.input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="you@example.com"
                      required
                      autoFocus
                      whileFocus={{ borderColor: "#e11d5c" }}
                      className="w-full pl-10 pr-4 py-3 border border-surface-200 rounded-xl text-sm bg-surface-50 placeholder:text-surface-300 outline-none transition-colors"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading || !email.trim()}
                  whileHover={email ? { scale: 1.02, boxShadow: "0 10px 28px -4px rgba(225,29,92,0.36)" } : {}}
                  whileTap={email ? { scale: 0.97 } : {}}
                  className="w-full bg-brand-600 text-white border-none rounded-xl py-3.5 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading
                    ? <><Loader2 size={15} className="animate-spin" /> Sending…</>
                    : "Send Reset Link"
                  }
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href={`/${lang}/login`}
                  className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-brand-600 no-underline transition-colors font-medium"
                >
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
