"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, Sparkles, ShieldCheck, Star, Users } from "lucide-react";
import { authAPI, saveTokens, saveUser, isLoggedIn } from "@/lib/api";

function LoginForm({ dict, lang }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirect") || null;
  const a = dict?.auth || {};

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace(redirectTo || `/${lang}/account`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      if (redirectTo) { router.push(redirectTo); return; }
      router.push(`/${lang}/account`);
    } catch (err) {
      setError(err.message || a.loginFailed || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/60 via-white to-rose-50/40 flex items-stretch">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] w-full">
        {/* Left brand panel */}
        <BrandPanel a={a} />

        {/* Form column */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-8 md:py-16 relative">
          <div className="absolute inset-0 -z-10 overflow-hidden lg:hidden">
            <div className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-rose-200/40 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-brand-200/40 blur-3xl" />
          </div>
          <div className="w-full max-w-[440px]">
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
                <h1 className="font-display text-[26px] md:text-[30px] font-bold text-surface-900 mb-1.5 tracking-tight">{a.welcomeBack || "Welcome back"}</h1>
                <p className="text-surface-500 text-[14px]">{a.signInSubtitle || "Sign in to your Salooote account"}</p>
              </div>

              <SocialButtons a={a} />

              <Divider label={a.orContinueWith || "or continue with"} />

              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[13px] mb-4">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold text-surface-700 mb-1.5">{a.email || "Email"}</label>
                  <InputWithIcon icon={Mail}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="w-full pl-11 pr-4 py-3.5 border border-surface-200 rounded-2xl text-[14px] bg-white placeholder:text-surface-300 outline-none focus:border-brand-400 focus:ring-2 focus:ring-rose-100 transition-all"
                    />
                  </InputWithIcon>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[12px] font-semibold text-surface-700">{a.password || "Password"}</label>
                    <Link href={`/${lang}/forgot-password`} className="text-[12px] text-brand-600 font-semibold no-underline hover:underline">
                      {a.forgotPassword || "Forgot password?"}
                    </Link>
                  </div>
                  <InputWithIcon icon={Lock}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      className="w-full pl-11 pr-12 py-3.5 border border-surface-200 rounded-2xl text-[14px] bg-white placeholder:text-surface-300 outline-none focus:border-brand-400 focus:ring-2 focus:ring-rose-100 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-700 transition-colors bg-transparent border-none cursor-pointer p-0"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </InputWithIcon>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-700 hover:to-rose-600 text-white border-none rounded-2xl py-3.5 text-[14px] font-semibold cursor-pointer transition-all shadow-glow disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>{a.signInButton || "Sign in"} <ArrowRight size={15} /></>
                  )}
                </motion.button>

                <div className="flex items-center justify-center gap-2 pt-1 text-[11.5px] text-surface-400">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  {a.secureLogin || "Secure & encrypted"}
                </div>
              </form>

              <p className="text-center text-[13.5px] text-surface-500 mt-7">
                {a.noAccount || "Don't have an account?"}{" "}
                <Link href={`/${lang}/signup`} className="text-brand-600 font-semibold no-underline hover:underline">
                  {a.createAccount || "Create account"}
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
        src="/images/wedding-cake.jpg"
        alt=""
        fill
        sizes="50vw"
        className="object-cover opacity-25 mix-blend-overlay"
        priority={false}
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

function SocialButtons({ a }) {
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

export default function LoginPageClient({ dict, lang }) {
  return (
    <Suspense fallback={null}>
      <LoginForm dict={dict} lang={lang} />
    </Suspense>
  );
}
