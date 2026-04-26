"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart, PartyPopper, Users, Sparkles, Star, Gift,
  Cake, Baby, TreePine, Smile, Search, Wand2, ArrowRight, ChevronRight,
} from "lucide-react";

/* Localized strings */
const T = {
  en: {
    eyebrow: "Plan any occasion",
    title: "What are you celebrating?",
    subtitle: "From intimate engagements to grand weddings — find trusted vendors and gorgeous ideas for every Armenian celebration.",
    searchPlaceholder: "Search occasions… (wedding, birthday, baby tooth)",
    aiTitle: "Don't see your occasion?",
    aiSubtitle: "Tell Sali what you have in mind — get a personalized plan in seconds.",
    aiCta: "Open AI Planner",
    aiBadge: "AI Assistant",
    home: "Home",
    events: "Events",
    explore: "Explore",
    moreSoon: "More occasion types coming soon",
    empty: "No occasions match your search.",
    showAll: "Show all",
    featured: "Featured",
    intimate: "Intimate",
    grand: "Grand",
    family: "Family",
    seasonal: "Seasonal",
    all: "All",
  },
  hy: {
    eyebrow: "Պլանավորիր ցանկացած առիթ",
    title: "Ի՞նչ եք նշում",
    subtitle: "Փոքր նշանդրեքից մինչև մեծ հարսանիք՝ գտեք վստահելի մատակարարներ և գեղեցիկ գաղափարներ յուրաքանչյուր հայկական տոնի համար։",
    searchPlaceholder: "Փնտրել առիթներ… (հարսանիք, ծնունդ, ատամհատիկ)",
    aiTitle: "Չե՞ք գտնում Ձեր առիթը",
    aiSubtitle: "Պատմեք Sali-ին Ձեր մտքի մասին — ստացեք անձնավորված պլան վայրկյանների ընթացքում։",
    aiCta: "Բացել AI Պլանավորողը",
    aiBadge: "AI Օգնական",
    home: "Գլխավոր",
    events: "Միջոցառումներ",
    explore: "Բացահայտել",
    moreSoon: "Շուտով ավելի շատ առիթներ",
    empty: "Որոնման համար արդյունքներ չկան։",
    showAll: "Տեսնել բոլորը",
    featured: "Հատկանշավոր",
    intimate: "Փոքր առիթներ",
    grand: "Մեծ առիթներ",
    family: "Ընտանեկան",
    seasonal: "Սեզոնային",
    all: "Բոլորը",
  },
  ru: {
    eyebrow: "Спланируйте любой повод",
    title: "Что вы празднуете?",
    subtitle: "От уютной помолвки до грандиозной свадьбы — найдите проверенных поставщиков и красивые идеи для любого армянского торжества.",
    searchPlaceholder: "Поиск поводов… (свадьба, день рождения, зубик)",
    aiTitle: "Не нашли свой повод?",
    aiSubtitle: "Расскажите Sali, что задумали — получите персональный план за секунды.",
    aiCta: "Открыть AI-планировщик",
    aiBadge: "AI-Помощник",
    home: "Главная",
    events: "Мероприятия",
    explore: "Изучить",
    moreSoon: "Скоро больше поводов",
    empty: "Ничего не найдено.",
    showAll: "Показать все",
    featured: "Избранное",
    intimate: "Камерные",
    grand: "Большие",
    family: "Семейные",
    seasonal: "Сезонные",
    all: "Все",
  },
};

/* Event types — same source-of-truth as event detail page */
const EVENTS = [
  { slug: "wedding",            label: "Weddings",              labelHy: "Հարսանիքներ",            labelRu: "Свадьбы",                desc: "Make your big day unforgettable.",            descHy: "Անմոռանալի դարձրեք Ձեր մեծ օրը։",          descRu: "Сделайте день незабываемым.",         icon: Heart,        image: "/images/wedding-arch-beach.jpg",  accent: "from-rose-500 to-fuchsia-500",     featured: true,  groups: ["grand"] },
  { slug: "birthday",           label: "Birthdays",             labelHy: "Ծննդյան Տոներ",          labelRu: "Дни Рождения",            desc: "Celebrate every year in style.",              descHy: "Նշեք յուրաքանչյուր տարի ոճով։",            descRu: "Отмечайте каждый год стильно.",       icon: PartyPopper,  image: "/images/party-balloons.jpg",       accent: "from-sky-500 to-cyan-500",         featured: true,  groups: ["intimate", "family"] },
  { slug: "engagement",         label: "Engagements",           labelHy: "Նշանդրեքներ",            labelRu: "Помолвки",                desc: "Say yes to forever.",                         descHy: "Ասեք «այո» հավերժի համար։",                descRu: "Скажите «да» навсегда.",              icon: Sparkles,     image: "/images/flowers-roses.jpg",        accent: "from-violet-500 to-rose-500",      featured: true,  groups: ["intimate"] },
  { slug: "anniversary",        label: "Anniversaries",         labelHy: "Ամյակներ",                labelRu: "Юбилеи",                  desc: "Honor every milestone.",                      descHy: "Հարգեք յուրաքանչյուր նշանակալի օր։",       descRu: "Отмечайте каждую годовщину.",        icon: Star,         image: "/images/wedding-cake.jpg",         accent: "from-amber-500 to-orange-500",     featured: false, groups: ["intimate", "family"] },
  { slug: "kids-party",         label: "Kids' Parties",         labelHy: "Մանկական Տոներ",          labelRu: "Детские Праздники",       desc: "Magical moments for little ones.",            descHy: "Հեքիաթային պահեր փոքրիկների համար։",       descRu: "Волшебные моменты для малышей.",     icon: Gift,         image: "/images/party-balloons2.jpg",      accent: "from-emerald-500 to-cyan-500",     featured: true,  groups: ["family"] },
  { slug: "corporate",          label: "Corporate Events",      labelHy: "Կորպորատիվ",              labelRu: "Корпоративные",           desc: "Impress clients and teams.",                  descHy: "Տպավորեք հաճախորդներին ու թիմին։",         descRu: "Впечатлите клиентов и команду.",     icon: Users,        image: "/images/event-dinner.jpg",         accent: "from-slate-700 to-slate-500",      featured: false, groups: ["grand"] },
  { slug: "balloons",           label: "Balloons & Decor",      labelHy: "Փուչիկներ և Ձևավորում",   labelRu: "Шары и Оформление",       desc: "Find balloon pros for any party.",            descHy: "Գտեք փուչիկների մասնագետներ։",             descRu: "Найдите специалистов по шарам.",     icon: Sparkles,     image: "/images/balloons-blue.jpg",        accent: "from-rose-500 to-pink-500",        featured: false, groups: ["intimate"] },
  { slug: "cakes",              label: "Cakes & Pastry",        labelHy: "Տորթեր և Հրուշակեղեն",    labelRu: "Торты и Десерты",         desc: "Custom cakes from top pastry chefs.",         descHy: "Անհատական տորթեր լավագույններից։",         descRu: "Индивидуальные торты от лучших.",    icon: Cake,         image: "/images/wedding-cake2.jpg",        accent: "from-amber-500 to-rose-500",       featured: true,  groups: ["intimate", "family"] },
  { slug: "cartoon-characters", label: "Cartoon Characters",    labelHy: "Մուլտֆիլմի Հերոսներ",     labelRu: "Герои Мультфильмов",      desc: "Bring magic to your child's party.",          descHy: "Հեքիաթ կյանքի կոչեք երեխաների համար։",     descRu: "Подарите ребёнку сказку.",           icon: Smile,        image: "/images/party-hats.jpg",           accent: "from-violet-500 to-fuchsia-500",   featured: false, groups: ["family"] },
  { slug: "gifts",              label: "Gifts",                 labelHy: "Նվերներ",                 labelRu: "Подарки",                 desc: "Original gifts for any occasion.",            descHy: "Օրիգինալ նվերներ ցանկացած առիթի համար։",   descRu: "Оригинальные подарки.",              icon: Gift,         image: "/images/cookies-box.jpg",          accent: "from-teal-500 to-cyan-500",        featured: false, groups: ["intimate"] },
  { slug: "romantic",           label: "Romantic & Proposals",  labelHy: "Ռոմանտիկ առիթներ",        labelRu: "Романтика",               desc: "Unforgettable romantic moments.",             descHy: "Անմոռանալի ռոմանտիկ պահեր։",               descRu: "Незабываемая романтика.",            icon: Heart,        image: "/images/flowers-roses.jpg",        accent: "from-rose-600 to-red-500",         featured: false, groups: ["intimate"] },
  { slug: "baptism",            label: "Baptism",               labelHy: "Մկրտություն",             labelRu: "Крещение",                desc: "Honor this special family moment.",           descHy: "Հարգեք այս ընտանեկան պահը։",               descRu: "Отметьте семейное таинство.",        icon: Baby,         image: "/images/cupcakes.jpg",             accent: "from-sky-500 to-indigo-500",       featured: false, groups: ["family"] },
  { slug: "baby-tooth",         label: "Tooth Party",           labelHy: "Ատամհատիկ",                labelRu: "Праздник Зубика",         desc: "Celebrate baby's first tooth.",               descHy: "Տոնեք առաջին ատամը։",                      descRu: "Отметьте первый зубик.",             icon: Baby,         image: "/images/cookies-box2.jpg",         accent: "from-emerald-500 to-teal-500",     featured: false, groups: ["family"] },
  { slug: "christmas",          label: "New Year & Christmas",  labelHy: "Ամանոր և Սուրբ Ծնունդ",   labelRu: "Новый Год и Рождество",   desc: "Create the perfect festive mood.",            descHy: "Կատարյալ տոնական մթնոլորտ ստեղծեք։",       descRu: "Создайте праздничную атмосферу.",    icon: TreePine,     image: "/images/wedding-dance.jpg",        accent: "from-emerald-600 to-rose-500",     featured: false, groups: ["seasonal", "family"] },
];

const FILTERS = [
  { key: "all",      labelKey: "all" },
  { key: "intimate", labelKey: "intimate" },
  { key: "grand",    labelKey: "grand" },
  { key: "family",   labelKey: "family" },
  { key: "seasonal", labelKey: "seasonal" },
];

export default function EventsIndexClient({ lang }) {
  const t = T[lang] || T.en;
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const localized = (e) => ({
    label: lang === "hy" ? e.labelHy : lang === "ru" ? e.labelRu : e.label,
    desc: lang === "hy" ? e.descHy : lang === "ru" ? e.descRu : e.desc,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EVENTS.filter(e => {
      const inGroup = filter === "all" || (e.groups || []).includes(filter);
      if (!inGroup) return false;
      if (!q) return true;
      const loc = localized(e);
      return (
        loc.label.toLowerCase().includes(q) ||
        loc.desc.toLowerCase().includes(q) ||
        e.slug.includes(q)
      );
    });
  }, [query, filter, lang]);

  const featured = filtered.find(e => e.featured) || filtered[0];
  const rest = filtered.filter(e => e.slug !== featured?.slug);

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-amber-50 border-b border-rose-100">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #e11d5c 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-rose-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-container mx-auto px-6 md:px-8 pt-12 pb-16 md:pt-16 md:pb-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-surface-500 text-sm mb-8">
            <Link href={`/${lang}`} className="hover:text-rose-600 no-underline text-surface-500 transition-colors">{t.home}</Link>
            <ChevronRight size={12} className="opacity-50" />
            <span className="text-surface-900 font-medium">{t.events}</span>
          </nav>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-white border border-rose-100 rounded-full px-3 py-1 mb-4 shadow-sm">
              <Sparkles size={11} className="text-rose-500" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-rose-600">{t.eyebrow}</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-black tracking-tight text-surface-900 leading-[1.05] mb-4">
              {t.title}
            </h1>
            <p className="text-surface-600 text-base md:text-lg leading-relaxed mb-7">
              {t.subtitle}
            </p>

            {/* Search */}
            <div className="relative max-w-xl">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-surface-200 rounded-2xl text-[15px] text-surface-900 placeholder:text-surface-400 shadow-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap gap-2 mt-5">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    filter === f.key
                      ? "bg-surface-900 text-white shadow-md"
                      : "bg-white border border-surface-200 text-surface-700 hover:border-rose-300 hover:text-rose-600"
                  }`}
                >
                  {t[f.labelKey]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-container mx-auto px-6 md:px-8 py-14">
        {filtered.length === 0 ? (
          <div className="py-24 text-center bg-surface-50 rounded-3xl border border-surface-100">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white border border-surface-200 flex items-center justify-center">
              <Search size={22} className="text-surface-400" />
            </div>
            <p className="text-surface-500 text-sm mb-3">{t.empty}</p>
            <button
              onClick={() => { setQuery(""); setFilter("all"); }}
              className="inline-flex items-center gap-1 text-rose-600 text-sm font-semibold hover:gap-2 transition-all"
            >
              {t.showAll} <ChevronRight size={14} />
            </button>
          </div>
        ) : (
          <>
            {/* Featured + 5-up grid (Browse Moments style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {featured && (
                <Link
                  href={`/${lang}/events/${featured.slug}`}
                  className="md:col-span-2 lg:col-span-2 lg:row-span-2 no-underline group"
                >
                  <div className="relative h-full min-h-[320px] md:min-h-[420px] lg:min-h-[560px] rounded-3xl overflow-hidden ring-1 ring-surface-100 group-hover:ring-rose-200 transition-all">
                    <Image
                      src={featured.image}
                      alt={localized(featured).label}
                      fill
                      sizes="(max-width:768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${featured.accent} opacity-70 group-hover:opacity-60 transition-opacity`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1">
                      <Sparkles size={11} className="text-rose-500" />
                      <span className="text-[10px] font-bold tracking-widest uppercase text-surface-900">{t.featured}</span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <h2 className="font-display text-white text-3xl md:text-5xl font-black tracking-tight leading-tight mb-2">
                        {localized(featured).label}
                      </h2>
                      <p className="text-white/90 text-sm md:text-base max-w-md mb-4 leading-relaxed">
                        {localized(featured).desc}
                      </p>
                      <span className="inline-flex items-center gap-1.5 bg-white text-surface-900 px-4 py-2 rounded-full font-semibold text-sm group-hover:gap-2.5 transition-all">
                        {t.explore} <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {rest.slice(0, 6).map((e, i) => {
                const loc = localized(e);
                const Icon = e.icon;
                return (
                  <motion.div
                    key={e.slug}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link href={`/${lang}/events/${e.slug}`} className="block no-underline group">
                      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden ring-1 ring-surface-100 group-hover:ring-rose-200 transition-all">
                        <Image
                          src={e.image}
                          alt={loc.label}
                          fill
                          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${e.accent} opacity-65 group-hover:opacity-55 transition-opacity`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                        <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center">
                          <Icon size={16} className="text-surface-900" strokeWidth={2.2} />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-bold text-lg leading-tight mb-1">{loc.label}</h3>
                          <p className="text-white/85 text-xs leading-snug line-clamp-2">{loc.desc}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Remaining items as compact cards */}
            {rest.length > 6 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {rest.slice(6).map((e, i) => {
                  const loc = localized(e);
                  const Icon = e.icon;
                  return (
                    <motion.div
                      key={e.slug}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link href={`/${lang}/events/${e.slug}`} className="block no-underline group">
                        <div className="bg-white rounded-2xl border border-surface-200 hover:border-rose-300 hover:shadow-lg hover:-translate-y-0.5 transition-all p-4 flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${e.accent} flex items-center justify-center text-white flex-shrink-0`}>
                            <Icon size={18} strokeWidth={2.2} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-surface-900 text-sm truncate group-hover:text-rose-600 transition-colors">
                              {loc.label}
                            </p>
                            <p className="text-xs text-surface-500 truncate mt-0.5">{loc.desc}</p>
                          </div>
                          <ChevronRight size={14} className="text-surface-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>

      {/* AI CTA */}
      <section className="max-w-container mx-auto px-6 md:px-8 pb-20">
        <Link href={`/${lang}/planner`} className="block no-underline group">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-600 p-8 md:p-12 text-white">
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-2.5 py-1 mb-3">
                  <Sparkles size={12} />
                  <span className="text-[10px] font-bold tracking-widest uppercase">{t.aiBadge}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">{t.aiTitle}</h2>
                <p className="text-white/90 text-base md:text-lg max-w-xl leading-relaxed">{t.aiSubtitle}</p>
              </div>
              <div className="flex-shrink-0">
                <div className="inline-flex items-center gap-2 bg-white text-rose-600 px-6 py-3.5 rounded-full font-bold text-sm shadow-xl group-hover:scale-[1.04] transition-transform">
                  <Wand2 size={16} /> {t.aiCta}
                </div>
              </div>
            </div>
          </div>
        </Link>

        <p className="text-center text-surface-400 text-xs mt-8">{t.moreSoon}</p>
      </section>
    </div>
  );
}
