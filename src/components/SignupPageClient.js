"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { authAPI, saveTokens, saveUser } from "@/lib/api";

export default function SignupPageClient({ dict, lang }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthColors = ["bg-surface-200", "bg-red-400", "bg-amber-400", "bg-yellow-400", "bg-green-500"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return;
    setError("");

    // Split full name into first/last
    const nameParts = form.name.trim().split(/\s+/);
    const first_name = nameParts[0] || "";
    const last_name  = nameParts.slice(1).join(" ") || first_name; // fallback: repeat if single word

    if (!first_name) { setError("Please enter your full name."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    try {
      const res = await authAPI.register({
        first_name,
        last_name,
        email: form.email.trim(),
        password: form.password,
      });
      const data = res?.data || res;
      if (data?.access_token) {
        saveTokens(data.access_token, data.refresh_token);
        if (data.user) saveUser(data.user);
      }
      router.push(`/${lang}/account`);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4 py-16">

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-brand-100/40 blur-3xl -top-40 -left-40"
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-brand-50 blur-3xl bottom-0 -right-20"
          animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="relative w-full max-w-[480px]">


        {/* Card */}
        <motion.div
          className="bg-white rounded-2xl border border-surface-200 p-8 shadow-sm"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-surface-900 mb-1">{dict.auth.createTitle}</h1>
            <p className="text-surface-400 text-sm">{dict.auth.createSubtitle}</p>
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

            {/* Full name */}
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">{dict.auth.fullName}</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                <motion.input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Anna Smith"
                  required
                  whileFocus={{ borderColor: "#e11d5c" }}
                  className="w-full pl-10 pr-4 py-3 border border-surface-200 rounded-xl text-sm bg-surface-50 placeholder:text-surface-300 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">{dict.auth.email}</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                <motion.input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  whileFocus={{ borderColor: "#e11d5c" }}
                  className="w-full pl-10 pr-4 py-3 border border-surface-200 rounded-xl text-sm bg-surface-50 placeholder:text-surface-300 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">{dict.auth.password}</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                <motion.input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
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

              {/* Password strength */}
              {form.password && (
                <motion.div
                  className="mt-2"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= passwordStrength ? strengthColors[passwordStrength] : "bg-surface-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-surface-400">{strengthLabels[passwordStrength]}</p>
                </motion.div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">{dict.auth.confirmPassword}</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                <motion.input
                  type={showConfirm ? "text" : "password"}
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  whileFocus={{ borderColor: "#e11d5c" }}
                  className={`w-full pl-10 pr-11 py-3 border rounded-xl text-sm bg-surface-50 placeholder:text-surface-300 outline-none transition-colors ${
                    form.confirm && form.password !== form.confirm
                      ? "border-red-300 focus:border-red-400"
                      : "border-surface-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-700 transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                {form.confirm && form.password === form.confirm && form.password && (
                  <CheckCircle2 size={15} className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500" />
                )}
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="sr-only"
                />
                <motion.div
                  animate={{ backgroundColor: agreed ? "#e11d5c" : "#fff", borderColor: agreed ? "#e11d5c" : "#e2e8f0" }}
                  className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all"
                >
                  {agreed && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      width="10" height="8" viewBox="0 0 10 8" fill="none"
                    >
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </motion.div>
              </div>
              <span className="text-sm text-surface-500 leading-snug">
                {dict.auth.agreeTerms}{" "}
                <Link href={`/${lang}/terms`} className="text-brand-600 no-underline hover:underline font-medium">{dict.auth.terms}</Link>
                {" "}{dict.auth.and}{" "}
                <Link href={`/${lang}/privacy`} className="text-brand-600 no-underline hover:underline font-medium">{dict.auth.privacy}</Link>
              </span>
            </label>

            <motion.button
              type="submit"
              disabled={loading || !agreed}
              whileHover={agreed ? { scale: 1.02, boxShadow: "0 10px 28px -4px rgba(225,29,92,0.36)" } : {}}
              whileTap={agreed ? { scale: 0.97 } : {}}
              className="w-full bg-brand-600 text-white border-none rounded-xl py-3.5 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  {dict.auth.createButton} <ArrowRight size={15} />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-surface-400 mt-6">
            {dict.auth.alreadyAccount}{" "}
            <Link href={`/${lang}/login`} className="text-brand-600 font-semibold no-underline hover:underline">
              {dict.auth.signInButton}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
