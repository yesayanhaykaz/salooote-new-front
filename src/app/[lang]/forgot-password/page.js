"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Loader2,
  Sparkles, ShieldCheck, Star, Users,
} from "lucide-react";
import { authAPI } from "@/lib/api";

const T = {
  en: {
    title: "Forgot your password?",
    subtitle: "No worries. Enter your email and we'll send you a reset link.",
    email: "Email address",
    submit: "Send reset link",
    sending: "Sending…",
    backToSignIn: "Back to sign in",
    sentTitle: "Check your email",
    sentBody1: "If",
    sentBody2: "is registered, we've sent a password reset link.",
    sentSpam: "Didn't get it? Check your spam folder or try again below.",
    tryDifferent: "Try a different email",
    error: "Something went wrong. Please try again.",
    secure: "Secure & encrypted",
    panelEyebrow: "Account recovery",
    panelTitle: "Forgot something? We've got you.",
    panelSubtitle: "Enter your email and we'll send you a secure link to reset your password — no fuss, no waiting.",
    panelStat1: "Bank-grade encryption",
    panelStat2: "Instant email delivery",
    panelStat3: "One-click reset",
    trustReturn: "Trusted by thousands across Armenia",
  },
  hy: {
    title: "Մոռացե՞լ ես գաղտնաբառը։",
    subtitle: "Ոչինչ։ Մուտքագրիր էլ-հասցեդ, մենք կուղարկենք վերականգնման հղում։",
    email: "Էլ-հասցե",
    submit: "Ուղարկել հղումը",
    sending: "Ուղարկվում է…",
    backToSignIn: "Վերադառնալ մուտքին",
    sentTitle: "Ստուգիր փոստդ",
    sentBody1: "Եթե",
    sentBody2: "գրանցված է, մենք ուղարկեցինք գաղտնաբառի վերականգնման հղում։",
    sentSpam: "Չի՞ եկել։ Ստուգիր սպամ թղթապանակը կամ կրկին փորձիր ներքևում։",
    tryDifferent: "Փորձել այլ էլ-հասցե",
    error: "Ինչ-որ բան սխալ ընթացավ։ Կրկին փորձեք։",
    secure: "Ապահով և գաղտնագրված",
    panelEyebrow: "Հաշվի վերականգնում",
    panelTitle: "Մոռացե՞լ ես մի բան։ Մենք քեզ կօգնենք։",
    panelSubtitle: "Մուտքագրիր էլ-հասցեդ, մենք կուղարկենք ապահով հղում՝ գաղտնաբառը վերականգնելու համար։",
    panelStat1: "Բանկային մակարդակի գաղտնագրում",
    panelStat2: "Ակնթարթային էլ-փոստ",
    panelStat3: "Մեկ սեղմումով վերականգնում",
    trustReturn: "Վստահված է հազարավորների կողմից Հայաստանում",
  },
  ru: {
    title: "Забыли пароль?",
    subtitle: "Не беда. Введите email — мы отправим ссылку для сброса.",
    email: "Email адрес",
    submit: "Отправить ссылку",
    sending: "Отправка…",
    backToSignIn: "Назад ко входу",
    sentTitle: "Проверьте почту",
    sentBody1: "Если",
    sentBody2: "зарегистрирован, мы отправили ссылку для сброса пароля.",
    sentSpam: "Не пришло? Проверьте папку «Спам» или попробуйте ещё раз ниже.",
    tryDifferent: "Попробовать другой email",
    error: "Что-то пошло не так. Попробуйте ещё раз.",
    secure: "Безопасно и зашифровано",
    panelEyebrow: "Восстановление аккаунта",
    panelTitle: "Что-то забыли? Мы поможем.",
    panelSubtitle: "Введите email — мы отправим безопасную ссылку для сброса пароля. Без лишних шагов.",
    panelStat1: "Шифрование банковского уровня",
    panelStat2: "Мгновенная доставка email",
    panelStat3: "Сброс в один клик",
    trustReturn: "Нам доверяют тысячи по всей Армении",
  },
};

export default function ForgotPasswordPage() {
  const { lang } = useParams();
  const t = T[lang] || T.en;
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
      setError(err.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/60 via-white to-rose-50/40 flex items-stretch">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] w-full">
        {/* Left brand panel — same as Login */}
        <BrandPanel t={t} />

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
              {sent ? (
                /* ── Success state ── */
                <motion.div
                  className="text-center py-2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={30} className="text-emerald-500" />
                  </div>
                  <h1 className="font-display text-[26px] md:text-[28px] font-bold text-surface-900 mb-2 tracking-tight">{t.sentTitle}</h1>
                  <p className="text-surface-500 text-[14px] mb-2">
                    {t.sentBody1} <span className="font-semibold text-surface-800">{email}</span> {t.sentBody2}
                  </p>
                  <p className="text-surface-400 text-[12.5px] mb-7">{t.sentSpam}</p>

                  <div className="space-y-3">
                    <button
                      onClick={() => { setSent(false); setEmail(""); }}
                      className="w-full border border-surface-200 bg-white text-surface-700 rounded-2xl py-3.5 text-[14px] font-semibold cursor-pointer hover:bg-surface-50 hover:border-surface-300 transition-colors"
                    >
                      {t.tryDifferent}
                    </button>
                    <Link href={`/${lang}/login`} className="no-underline block">
                      <button className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-700 hover:to-rose-600 text-white border-none rounded-2xl py-3.5 text-[14px] font-semibold cursor-pointer transition-all shadow-glow">
                        <ArrowLeft size={14} /> {t.backToSignIn}
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                /* ── Form state ── */
                <>
                  <div className="mb-7">
                    <h1 className="font-display text-[26px] md:text-[30px] font-bold text-surface-900 mb-1.5 tracking-tight">{t.title}</h1>
                    <p className="text-surface-500 text-[14px]">{t.subtitle}</p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[13px] mb-4">
                      <AlertCircle size={15} className="flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-surface-700 mb-1.5">{t.email}</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setError(""); }}
                          placeholder="you@example.com"
                          autoComplete="email"
                          autoFocus
                          required
                          className="w-full pl-11 pr-4 py-3.5 border border-surface-200 rounded-2xl text-[14px] bg-white placeholder:text-surface-300 outline-none focus:border-brand-400 focus:ring-2 focus:ring-rose-100 transition-all"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading || !email.trim()}
                      whileHover={email && !loading ? { scale: 1.01 } : {}}
                      whileTap={email && !loading ? { scale: 0.98 } : {}}
                      className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-700 hover:to-rose-600 text-white border-none rounded-2xl py-3.5 text-[14px] font-semibold cursor-pointer transition-all shadow-glow disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading
                        ? <><Loader2 size={15} className="animate-spin" /> {t.sending}</>
                        : <>{t.submit} <ArrowRight size={15} /></>
                      }
                    </motion.button>

                    <div className="flex items-center justify-center gap-2 pt-1 text-[11.5px] text-surface-400">
                      <ShieldCheck size={13} className="text-emerald-500" />
                      {t.secure}
                    </div>
                  </form>

                  <div className="mt-7 text-center">
                    <Link
                      href={`/${lang}/login`}
                      className="inline-flex items-center gap-1.5 text-[13.5px] text-surface-500 hover:text-brand-600 no-underline transition-colors font-medium"
                    >
                      <ArrowLeft size={14} /> {t.backToSignIn}
                    </Link>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandPanel({ t }) {
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
            {t.panelEyebrow}
          </div>
          <h2 className="font-display text-[32px] xl:text-[40px] font-bold leading-[1.1] tracking-tight mb-5">
            {t.panelTitle}
          </h2>
          <p className="text-white/80 text-[15px] leading-relaxed mb-8">
            {t.panelSubtitle}
          </p>

          <ul className="space-y-3 text-[14px]">
            <Stat icon={ShieldCheck} text={t.panelStat1} />
            <Stat icon={Mail} text={t.panelStat2} />
            <Stat icon={Sparkles} text={t.panelStat3} />
          </ul>
        </div>

        <p className="text-white/60 text-[12.5px]">{t.trustReturn}</p>
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
