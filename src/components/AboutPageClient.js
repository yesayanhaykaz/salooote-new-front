"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart, Users, Sparkles, Star, Award, Target,
  ChevronRight, ArrowRight, MapPin, TrendingUp, ShieldCheck,
} from "lucide-react";
import CountUp from "@/components/CountUp";

const T = {
  en: {
    home: "Home",
    crumb: "Our story",
    eyebrow: "About Salooote",
    title: "We make celebrations effortless.",
    subtitle: "Salooote connects families and businesses across Armenia with the best event vendors — cakes, catering, flowers, music, and more.",
    ctaPrimary: "Browse vendors",
    ctaSecondary: "Plan with AI",
    statsHeading: "Loved across Armenia",
    stats: [
      { label: "Events planned", end: "15K+" },
      { label: "Verified vendors", end: "850+" },
      { label: "Cities covered", end: "50+" },
      { label: "Avg. rating", end: "4.9" },
    ],
    missionTitle: "Our Mission",
    missionP1: "Every celebration — birthday, wedding, corporate event, or quiet family gathering — deserves to be memorable. Yet planning one is often overwhelming.",
    missionP2: "We built Salooote to change that. By bringing together Armenia's best vendors in one trusted marketplace, we make it effortless to plan, book, and enjoy any event.",
    journeyTitle: "Our journey",
    journey: [
      { year: "2022", title: "Founded", desc: "Salooote was born in Yerevan with a simple mission: make event planning accessible to everyone in Armenia." },
      { year: "2023", title: "First 1,000 vendors", desc: "We hit a major milestone — 1,000 verified vendors on the platform, from bakers to photographers." },
      { year: "2024", title: "Launched AI Planner", desc: "Our AI-powered event planner helps customers discover and book vendors faster than ever." },
      { year: "2025", title: "Expanded across Armenia", desc: "Salooote now serves 50+ cities, bringing world-class event services to every corner of Armenia." },
    ],
    valuesTitle: "Our values",
    values: [
      { title: "Vendor-first", desc: "We grow when our vendors grow. Every feature is built with vendor success in mind.", icon: Heart },
      { title: "Transparency", desc: "Clear pricing, honest reviews, and no hidden fees — always.", icon: ShieldCheck },
      { title: "Joy", desc: "Celebrations should be stress-free. We handle the logistics so you can focus on the moments.", icon: Sparkles },
    ],
    teamTitle: "Meet the team",
    teamSubtitle: "Builders, dreamers, planners — based in Yerevan.",
    team: [
      { name: "Ani Petrosyan", role: "Co-Founder & CEO" },
      { name: "Davit Harutyunyan", role: "Co-Founder & CTO" },
      { name: "Narine Hovhannisyan", role: "Head of Vendor Relations" },
      { name: "Gor Mkrtchyan", role: "Head of Product" },
    ],
    finalTitle: "Plan your next celebration with us",
    finalSubtitle: "From intimate engagements to grand weddings — find trusted vendors and beautiful ideas.",
    finalCta: "Start planning",
  },
  hy: {
    home: "Գլխավոր",
    crumb: "Մեր պատմությունը",
    eyebrow: "Salooote-ի մասին",
    title: "Մենք դարձնում ենք տոները հեշտ։",
    subtitle: "Salooote-ը կապում է ընտանիքներին ու ընկերություններին Հայաստանում լավագույն մատակարարների հետ՝ տորթեր, քեյթրինգ, ծաղիկներ, երաժշտություն և ավելին։",
    ctaPrimary: "Տեսնել մատակարարներին",
    ctaSecondary: "Պլանավորել AI-ի հետ",
    statsHeading: "Սիրված Հայաստանում",
    stats: [
      { label: "Կազմակերպված միջոցառում", end: "15K+" },
      { label: "Ստուգված մատակարար", end: "850+" },
      { label: "Քաղաք", end: "50+" },
      { label: "Միջին վարկանիշ", end: "4.9" },
    ],
    missionTitle: "Մեր առաքելությունը",
    missionP1: "Յուրաքանչյուր տոն՝ ծնունդ, հարսանիք, կորպորատիվ միջոցառում կամ հանգիստ ընտանեկան հանդիպում, արժե անմոռանալի լինել։ Բայց պլանավորելը հաճախ հոգնեցնող է։",
    missionP2: "Մենք ստեղծել ենք Salooote-ը՝ դա փոխելու համար։ Հայաստանի լավագույն մատակարարներին միավորելով մեկ վստահելի հարթակում՝ մենք դարձնում ենք միջոցառման պլանավորումը, ամրագրումը և վայելելը հեշտ։",
    journeyTitle: "Մեր ճանապարհը",
    journey: [
      { year: "2022", title: "Հիմնադրում", desc: "Salooote-ը ծնվեց Երևանում պարզ առաքելությամբ՝ դարձնել միջոցառումների պլանավորումը մատչելի բոլորին Հայաստանում։" },
      { year: "2023", title: "Առաջին 1,000 մատակարար", desc: "Մենք հասանք կարևոր նշանակետի՝ 1,000 ստուգված մատակարար հարթակում։" },
      { year: "2024", title: "AI Պլանավորող", desc: "Մեր AI-ով աշխատող պլանավորողը օգնում է գտնել ու ամրագրել մատակարարներին երբեք չտեսնված արագությամբ։" },
      { year: "2025", title: "Ընդլայնում ողջ Հայաստանում", desc: "Salooote-ն այժմ սպասարկում է 50+ քաղաք՝ որակյալ ծառայություններ բերելով Հայաստանի ամեն անկյուն։" },
    ],
    valuesTitle: "Մեր արժեքները",
    values: [
      { title: "Մատակարարը առաջին հերթին", desc: "Մենք աճում ենք, երբ մեր մատակարարներն աճում են։ Ամեն ֆունկցիա կառուցված է նրանց հաջողության համար։", icon: Heart },
      { title: "Թափանցիկություն", desc: "Հստակ գներ, ազնիվ կարծիքներ, և երբեք թաքնված վճարներ։", icon: ShieldCheck },
      { title: "Ուրախություն", desc: "Տոները պետք է լինեն առանց սթրեսի։ Մենք հոգում ենք լոգիստիկայի մասին, որ դուք վայելեք պահերը։", icon: Sparkles },
    ],
    teamTitle: "Ծանոթացեք թիմին",
    teamSubtitle: "Կառուցողներ, երազողներ, պլանավորողներ՝ Երևանից։",
    team: [
      { name: "Անի Պետրոսյան", role: "Համահիմնադիր և CEO" },
      { name: "Դավիթ Հարությունյան", role: "Համահիմնադիր և CTO" },
      { name: "Նարինե Հովհաննիսյան", role: "Մատակարարների ղեկավար" },
      { name: "Գոռ Մկրտչյան", role: "Արտադրանքի ղեկավար" },
    ],
    finalTitle: "Պլանավորեք Ձեր հաջորդ տոնը մեզ հետ",
    finalSubtitle: "Փոքր նշանդրեքից մինչև մեծ հարսանիք՝ գտեք վստահելի մատակարարներ։",
    finalCta: "Սկսել",
  },
  ru: {
    home: "Главная",
    crumb: "Наша история",
    eyebrow: "О Salooote",
    title: "Мы делаем праздники простыми.",
    subtitle: "Salooote соединяет семьи и бизнес по всей Армении с лучшими поставщиками — торты, кейтеринг, цветы, музыка и многое другое.",
    ctaPrimary: "Все поставщики",
    ctaSecondary: "Спланировать с AI",
    statsHeading: "Любимы по всей Армении",
    stats: [
      { label: "Спланированных мероприятий", end: "15K+" },
      { label: "Проверенных поставщиков", end: "850+" },
      { label: "Городов", end: "50+" },
      { label: "Средний рейтинг", end: "4.9" },
    ],
    missionTitle: "Наша миссия",
    missionP1: "Каждый праздник — день рождения, свадьба, корпоратив или семейный ужин — заслуживает быть запоминающимся. Но планировать его часто непросто.",
    missionP2: "Мы создали Salooote, чтобы это изменить. Объединяя лучших поставщиков Армении на одной надёжной платформе, мы делаем планирование, бронирование и сам праздник лёгкими.",
    journeyTitle: "Наш путь",
    journey: [
      { year: "2022", title: "Основание", desc: "Salooote родился в Ереване с простой миссией: сделать планирование мероприятий доступным каждому в Армении." },
      { year: "2023", title: "Первые 1,000 поставщиков", desc: "Мы достигли важной отметки — 1,000 проверенных поставщиков, от пекарей до фотографов." },
      { year: "2024", title: "Запуск AI-планировщика", desc: "Наш AI-планировщик помогает находить и бронировать поставщиков быстрее, чем когда-либо." },
      { year: "2025", title: "Расширение по Армении", desc: "Salooote теперь работает в 50+ городах, принося качественные услуги в каждый уголок." },
    ],
    valuesTitle: "Наши ценности",
    values: [
      { title: "Поставщик в приоритете", desc: "Мы растём, когда растут наши поставщики. Каждая функция создана для их успеха.", icon: Heart },
      { title: "Прозрачность", desc: "Понятные цены, честные отзывы, никаких скрытых комиссий.", icon: ShieldCheck },
      { title: "Радость", desc: "Праздник должен быть без стресса. Мы берём на себя логистику, а вы наслаждаетесь моментами.", icon: Sparkles },
    ],
    teamTitle: "Команда",
    teamSubtitle: "Создатели, мечтатели, планировщики — из Еревана.",
    team: [
      { name: "Ани Петросян", role: "Сооснователь и CEO" },
      { name: "Давит Арутюнян", role: "Сооснователь и CTO" },
      { name: "Нарине Овханнисян", role: "Глава отношений с поставщиками" },
      { name: "Гор Мкртчян", role: "Глава продукта" },
    ],
    finalTitle: "Спланируйте свой следующий праздник с нами",
    finalSubtitle: "От уютных помолвок до больших свадеб — проверенные поставщики и красивые идеи.",
    finalCta: "Начать",
  },
};

export default function AboutPageClient({ lang = "en" }) {
  const t = T[lang] || T.en;

  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/wedding-arch-beach.jpg"
            alt="Salooote celebration"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-rose-600/85 via-pink-600/80 to-fuchsia-600/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
          <div
            className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />
        </div>

        <div className="relative max-w-container mx-auto px-6 md:px-8 pt-8 pb-20 md:pt-10 md:pb-28">
          <nav className="flex items-center gap-2 text-white/85 text-sm mb-10">
            <Link href={`/${lang}`} className="hover:text-white no-underline text-white/85 transition-colors">{t.home}</Link>
            <ChevronRight size={12} className="opacity-50" />
            <span className="text-white font-medium">{t.crumb}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full pl-2 pr-3.5 py-1 mb-5">
              <span className="w-7 h-7 rounded-full bg-white/95 flex items-center justify-center">
                <Heart size={14} className="text-rose-600" strokeWidth={2.4} />
              </span>
              <span className="text-white text-xs font-semibold tracking-wide uppercase">{t.eyebrow}</span>
            </div>
            <h1 className="font-display text-white text-[44px] md:text-[68px] leading-[1.02] font-black tracking-tight mb-4">
              {t.title}
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed">
              {t.subtitle}
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link
                href={`/${lang}/vendor`}
                className="inline-flex items-center gap-2 bg-white text-surface-900 hover:bg-white/95 px-5 py-3 rounded-full font-semibold text-sm shadow-lg shadow-black/10 transition-all hover:scale-[1.02] no-underline"
              >
                {t.ctaPrimary} <ArrowRight size={16} />
              </Link>
              <Link
                href={`/${lang}/planner`}
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white/25 px-5 py-3 rounded-full font-semibold text-sm transition-all no-underline"
              >
                <Sparkles size={16} /> {t.ctaSecondary}
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-6 bg-white" style={{ clipPath: "ellipse(70% 100% at 50% 100%)" }} />
      </section>

      {/* Stats */}
      <section className="max-w-container mx-auto px-6 md:px-8 py-14">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-full px-3 py-1 mb-3">
            <TrendingUp size={11} className="text-rose-500" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-rose-600">{t.statsHeading}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {t.stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-3xl py-7 px-4 text-center"
            >
              <p className="text-3xl md:text-4xl font-black text-rose-600 mb-1 font-display"><CountUp end={stat.end} /></p>
              <p className="text-xs md:text-sm text-surface-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-container mx-auto px-6 md:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-rose-500 to-pink-500" />
              <h2 className="text-2xl md:text-[34px] font-bold text-surface-900 tracking-tight">{t.missionTitle}</h2>
            </div>
            <p className="text-surface-700 text-base md:text-lg leading-[1.75] mb-4">{t.missionP1}</p>
            <p className="text-surface-700 text-base md:text-lg leading-[1.75]">{t.missionP2}</p>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden ring-1 ring-rose-100">
            <Image
              src="/images/wedding-cake.jpg"
              alt="Mission"
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 via-transparent to-amber-200/10" />
          </div>
        </div>
      </section>

      {/* Journey timeline */}
      <section className="bg-gradient-to-b from-rose-50/40 to-white py-16 md:py-20">
        <div className="max-w-container mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-[40px] font-display font-black text-surface-900 tracking-tight mb-3">{t.journeyTitle}</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {t.journey.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex gap-5 md:gap-7"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center text-sm font-black shadow-lg shadow-rose-200 flex-shrink-0">
                    {item.year.slice(2)}
                  </div>
                  {i < t.journey.length - 1 && <div className="w-px flex-1 bg-gradient-to-b from-rose-300 to-rose-100 mt-2" />}
                </div>
                <div className="pb-10 flex-1">
                  <p className="text-xs text-rose-600 font-bold tracking-widest uppercase mb-1">{item.year}</p>
                  <p className="font-bold text-surface-900 text-lg md:text-xl mb-1.5">{item.title}</p>
                  <p className="text-sm md:text-base text-surface-600 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-container mx-auto px-6 md:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-[40px] font-display font-black text-surface-900 tracking-tight mb-3">{t.valuesTitle}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {t.values.map((val, i) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white border border-surface-200 rounded-3xl p-7 hover:border-rose-300 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center mb-5 shadow-md shadow-rose-200">
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                <h3 className="font-bold text-surface-900 text-lg mb-2">{val.title}</h3>
                <p className="text-sm md:text-[15px] text-surface-600 leading-[1.7]">{val.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Team */}
      <section className="bg-surface-50 py-16 md:py-20">
        <div className="max-w-container mx-auto px-6 md:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-[40px] font-display font-black text-surface-900 tracking-tight mb-3">{t.teamTitle}</h2>
            <p className="text-surface-500 text-base">{t.teamSubtitle}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {t.team.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-center"
              >
                <div
                  className="w-20 h-20 md:w-24 md:h-24 rounded-3xl mx-auto mb-3 flex items-center justify-center text-white font-black text-2xl shadow-md shadow-rose-100"
                  style={{ background: "linear-gradient(135deg, #e11d5c, #f43f7e)" }}
                >
                  {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <p className="font-bold text-surface-900 text-sm md:text-base">{m.name}</p>
                <p className="text-xs md:text-sm text-surface-500 mt-0.5">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-container mx-auto px-6 md:px-8 py-16 md:py-20">
        <Link href={`/${lang}/planner`} className="block no-underline group">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-600 p-8 md:p-12 text-white">
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">{t.finalTitle}</h2>
                <p className="text-white/90 text-base md:text-lg max-w-xl leading-relaxed">{t.finalSubtitle}</p>
              </div>
              <div className="flex-shrink-0">
                <div className="inline-flex items-center gap-2 bg-white text-rose-600 px-6 py-3.5 rounded-full font-bold text-sm shadow-xl group-hover:scale-[1.04] transition-transform">
                  <Sparkles size={16} /> {t.finalCta} <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>
    </main>
  );
}
