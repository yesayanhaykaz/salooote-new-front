"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle,
  Sparkles, ShieldCheck, Star, Users,
} from "lucide-react";
import { authAPI, saveTokens, saveUser } from "@/lib/api";

export default function SignupPageClient({ dict, lang }) {
  const a = dict?.auth || {};
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

  const strengthColors = ["bg-surface-200", "bg-red-400", "bg-amber-400", "bg-yellow-400", "bg-emerald-500"];
  const strengthLabels = ["", a.weak || "Weak", a.fair || "Fair", a.good || "Good", a.strong || "Strong"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return;
    setError("");

    const nameParts = form.name.trim().split(/\s+/);
    const first_name = nameParts[0] || "";
    const last_name  = nameParts.slice(1).join(" ") || first_name;

    if (!first_name) { setError(a.fillName || "Please enter your full name."); return; }
    if (form.password.length < 8) { setError(a.minPassword || "Password must be at least 8 characters."); return; }
    if (form.password !== form.confirm) { setError(a.passwordMismatch || "Passwords do not match."); return; }

    setLoading(true);
    try {
      const res = await authAPI.register({
        first_name, last_name,
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
      setError(err.message || a.registerFailed || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/60 via-white to-rose-50/40 flex items-stretch">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] w-full">
        {/* Brand panel */}
        <BrandPanel a={a} />

        {/* Form */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-8 md:py-14 relative">
          <div className="absolute inset-0 -z-10 overflow-hidden lg:hidden">
            <div className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-rose-200/40 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-brand-200/40 blur-3xl" />
          </div>

          <div className="w-full max-w-[460px]">
            <Link href={`/${lang}`} className="inline-flex items-center gap-2 mb-7 lg:hidden no-underline group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-rose-500 flex items-center justify-center shadow-glow">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-[18px] text-surface-900 group-hover:text-brand-700">Salooote</span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white rounded-3xl border border-surface-100 shadow-soft p-7 md:p-9"
            >
              <div className="mb-7">
                <h1 className="font-display text-[26px] md:text-[30px] font-bold text-surface-900 mb-1.5 tracking-tight">{a.createTitle || "Create your account"}</h1>
                <p className="text-surface-500 text-[14px]">{a.createSubtitle || "Join thousands planning their perfect events"}</p>
              </div>

              <SocialButtons />

              <Divider label={a.orContinueWith || "or continue with"} />

              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[13px] mb-4">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold text-surface-700 mb-1.5">{a.fullName || "Full name"}</label>
                  <InputWithIcon icon={User}>
                    <input
                      type="text" name="name" value={form.name} onChange={handleChange}
                      placeholder={a.namePlaceholder || "Anna Smith"}
                      autoComplete="name" required
                      className="w-full pl-11 pr-4 py-3.5 border border-surface-200 rounded-2xl text-[14px] bg-white placeholder:text-surface-300 outline-none focus:border-brand-400 focus:ring-2 focus:ring-rose-100 transition-all"
                    />
                  </InputWithIcon>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-surface-700 mb-1.5">{a.email || "Email"}</label>
                  <InputWithIcon icon={Mail}>
                    <input
                      type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email" required
                      className="w-full pl-11 pr-4 py-3.5 border border-surface-200 rounded-2xl text-[14px] bg-white placeholder:text-surface-300 outline-none focus:border-brand-400 focus:ring-2 focus:ring-rose-100 transition-all"
                    />
                  </InputWithIcon>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-surface-700 mb-1.5">{a.password || "Password"}</label>
                  <InputWithIcon icon={Lock}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password" value={form.password} onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete="new-password" required
                      className="w-full pl-11 pr-12 py-3.5 border border-surface-200 rounded-2xl text-[14px] bg-white placeholder:text-surface-300 outline-none focus:border-brand-400 focus:ring-2 focus:ring-rose-100 transition-all"
                    />
                    <button
                      type="button" onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-700 transition-colors bg-transparent border-none cursor-pointer p-0"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </InputWithIcon>

                  {form.password ? (
                    <motion.div className="mt-2.5" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i <= passwordStrength ? strengthColors[passwordStrength] : "bg-surface-100"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-[11.5px] text-surface-500">
                        <span className="font-semibold text-surface-700">{a.passwordStrength || "Password strength"}:</span>{" "}
                        {strengthLabels[passwordStrength]}
                      </p>
                    </motion.div>
                  ) : (
                    <p className="text-[11.5px] text-surface-400 mt-1.5">{a.passwordHint || "8+ characters with letters, numbers and a symbol"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-surface-700 mb-1.5">{a.confirmPassword || "Confirm password"}</label>
                  <InputWithIcon icon={Lock}>
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirm" value={form.confirm} onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete="new-password" required
                      className={`w-full pl-11 pr-12 py-3.5 border rounded-2xl text-[14px] bg-white placeholder:text-surface-300 outline-none focus:ring-2 focus:ring-rose-100 transition-all ${
                        form.confirm && form.password !== form.confirm
                          ? "border-red-300 focus:border-red-400"
                          : "border-surface-200 focus:border-brand-400"
                      }`}
                    />
                    {form.confirm && form.password === form.confirm && (
                      <CheckCircle2 size={15} className="absolute right-12 top-1/2 -translate-y-1/2 text-emerald-500" />
                    )}
                    <button
                      type="button" onClick={() => setShowConfirm(!showConfirm)}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-700 transition-colors bg-transparent border-none cursor-pointer p-0"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </InputWithIcon>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group select-none pt-1">
                  <input
                    type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                    className="sr-only peer"
                  />
                  <span
                    className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      agreed ? "bg-brand-600 border-brand-600" : "bg-white border-surface-300 group-hover:border-brand-300"
                    }`}
                  >
                    {agreed && (
                      <svg width="11" height="9" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className="text-[13px] text-surface-600 leading-snug">
                    {a.agreeTerms || "I agree to the"}{" "}
                    <Link href={`/${lang}/terms`} className="text-brand-600 no-underline hover:underline font-semibold">{a.terms || "Terms of Service"}</Link>
                    {" "}{a.and || "and"}{" "}
                    <Link href={`/${lang}/privacy`} className="text-brand-600 no-underline hover:underline font-semibold">{a.privacy || "Privacy Policy"}</Link>
                  </span>
                </label>

                <motion.button
                  type="submit"
                  disabled={loading || !agreed}
                  whileHover={agreed ? { scale: 1.01 } : {}}
                  whileTap={agreed ? { scale: 0.98 } : {}}
                  className="w-full mt-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-700 hover:to-rose-600 text-white border-none rounded-2xl py-3.5 text-[14px] font-semibold cursor-pointer transition-all shadow-glow disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>{a.createButton || "Create account"} <ArrowRight size={15} /></>
                  )}
                </motion.button>

                <div className="flex items-center justify-center gap-2 text-[11.5px] text-surface-400 pt-1">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  {a.secureLogin || "Secure & encrypted"}
                </div>
              </form>

              <p className="text-center text-[13.5px] text-surface-500 mt-7">
                {a.alreadyAccount || "Already have an account?"}{" "}
                <Link href={`/${lang}/login`} className="text-brand-600 font-semibold no-underline hover:underline">
                  {a.signInButton || "Sign in"}
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandPanel({ a }) {
  return (
    <div className="hidden lg:flex relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-600 to-rose-500" />
      <div className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-[480px] w-[480px] rounded-full bg-amber-300/20 blur-3xl" />
      <Image
        src="/images/party-balloons2.jpg"
        alt=""
        fill
        sizes="50vw"
        className="object-cover opacity-25 mix-blend-overlay"
      />
      <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full">
        <Link href="/" className="inline-flex items-center gap-2.5 no-underline w-fit">
          <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-[20px] text-white">Salooote</span>
        </Link>

        <div className="max-w-[440px]">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-3 py-1 text-[11.5px] font-semibold mb-5">
            <Sparkles size={13} />
            {a.panelEyebrow || "Plan your celebration"}
          </div>
          <h2 className="font-display text-[32px] xl:text-[40px] font-bold leading-[1.1] tracking-tight mb-5">
            {a.panelTitle || "Every dream event starts with one click."}
          </h2>
          <p className="text-white/80 text-[15px] leading-relaxed mb-8">
            {a.panelSubtitle || "Cakes, vendors, photographers, venues — all in one place. Salooote makes planning unforgettable moments effortless."}
          </p>

          <ul className="space-y-3 text-[14px]">
            <Stat icon={Users} text={a.panelStat1 || "850+ verified vendors"} />
            <Stat icon={Star} text={a.panelStat2 || "12,000+ happy customers"} />
            <Stat icon={Sparkles} text={a.panelStat3 || "AI-powered planning"} />
          </ul>
        </div>

        <p className="text-white/60 text-[12.5px]">
          {a.trustReturn || "Trusted by event planners across Armenia"}
        </p>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, text }) {
  return (
    <li className="flex items-center gap-3">
      <span className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-white" />
      </span>
      <span className="text-white/90 font-medium">{text}</span>
    </li>
  );
}

function InputWithIcon({ icon: Icon, children }) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
      {children}
    </div>
  );
}

function Divider({ label }) {
  return (
    <div className="relative flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-surface-100" />
      <span className="text-[11px] text-surface-400 font-semibold uppercase tracking-wider">{label}</span>
      <div className="flex-1 h-px bg-surface-100" />
    </div>
  );
}

function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-3 mb-1">
      <button
        type="button"
        className="flex items-center justify-center gap-2 px-4 py-3 border border-surface-200 rounded-2xl text-[13px] font-semibold text-surface-700 bg-white hover:border-brand-200 hover:bg-rose-50/40 cursor-pointer transition-all"
      >
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google
      </button>
      <button
        type="button"
        className="flex items-center justify-center gap-2 px-4 py-3 border border-surface-200 rounded-2xl text-[13px] font-semibold text-surface-700 bg-white hover:border-brand-200 hover:bg-rose-50/40 cursor-pointer transition-all"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Facebook
      </button>
    </div>
  );
}
