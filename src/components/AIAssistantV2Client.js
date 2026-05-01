"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import EventPlanPanel, { BulkInquiryModal, applyActions, EVENT_TEMPLATES, INITIAL_EVENT_STATE } from "@/components/PlanPanel";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const PINK = "#e11d5c";
const PINK_DARK = "#9f1239";

// Services where products API gives better results than vendors API
const PRODUCT_SERVICE_TYPES = new Set([
  "cake", "wedding_cake", "balloon_decoration", "flowers",
  "baptism_candle", "cross", "baby_outfit", "wedding_rings", "ring", "bridal_dress",
]);

// Simplified search terms per service type for better product API match rate
const PRODUCT_SEARCH_TERMS = {
  cake: "cake", wedding_cake: "cake", balloon_decoration: "balloon",
  flowers: "flower", baptism_candle: "candle", cross: "cross",
  baby_outfit: "baby", wedding_rings: "ring", ring: "ring", bridal_dress: "dress",
};

const T = {
  hero: {
    en: ["Your event.", "Planned in minutes."],
    hy: ["Ձեր տոնը.", "Պլանավորված րոպեներում."],
    ru: ["Ваш праздник.", "Спланирован за минуты."],
  },
  sub: {
    en: "Balloons, cakes, venues, gifts, photographers — tell Salooote AI what you need and we'll plan it, find vendors, and estimate the budget.",
    hy: "Փուչիկներ, տորթեր, սրահներ, նվերներ, մուլտհերոսներ — ասեք Sali-ին ինչ է պետք, նա կպլանավորի, կգտնի մատակարարներ և կհաշվի բյուջեն։",
    ru: "Шары, торты, площадки, подарки, фотографы — расскажите Salooote AI что нужно, мы спланируем, найдём поставщиков и оценим бюджет.",
  },
  placeholder: {
    en: "Help me plan my daughter's 5th birthday tomorrow…",
    hy: "Ուզում եմ պլանավորել աղջկաս 5-ամյակը ամսի 12-ին…",
    ru: "Помогите спланировать день рождения дочки на 5 лет завтра…",
  },
  chips: {
    en: [
      { icon: "cake",     label: "Plan a birthday" },
      { icon: "balloon",  label: "Find balloons" },
      { icon: "gift",     label: "Send a gift" },
      { icon: "ring",     label: "Plan a wedding" },
      { icon: "bolt",     label: "Last-minute event" },
    ],
    hy: [
      { icon: "cake",     label: "Պլանավորել ծնունդ" },
      { icon: "balloon",  label: "Գտնել փուչիկներ" },
      { icon: "gift",     label: "Ուղարկել նվեր" },
      { icon: "ring",     label: "Պլանավորել հարսանիք" },
      { icon: "bolt",     label: "Վերջին զանգի միջոցառում" },
    ],
    ru: [
      { icon: "cake",     label: "Спланировать день рождения" },
      { icon: "balloon",  label: "Найти шары" },
      { icon: "gift",     label: "Отправить подарок" },
      { icon: "ring",     label: "Спланировать свадьбу" },
      { icon: "bolt",     label: "Срочное мероприятие" },
    ],
  },
  scrollCue: {
    en: "See how Salooote can help you",
    hy: "Տեսեք ինչպես կարող է օգնել Salooote-ը",
    ru: "Узнать, как Salooote может помочь",
  },
  welcome: {
    en: "Hi, I'm **Sali**.\n\nTell me what you're looking for — an occasion, a gift, or something specific — and I'll find the right options for you.",
    hy: "Բարև, ես **Sali**-ն եմ։\n\nԱսեք ինչ եք փնտրում՝ միջոցառում, նվեր կամ ինչ-որ կոնկրետ բան և ես կընտրեմ լավագույն տարբերակները։",
    ru: "Привет, я **Sali**.\n\nРасскажите, что ищете — праздник, подарок или что-то конкретное — я подберу варианты.",
  },
  planBtn:  { en: "Plan this event",  hy: "Պլանավորել",   ru: "Планировать" },
  sendBtn:  { en: "Ask Sali",         hy: "Հարցնել",     ru: "Спросить" },
  saliKnows:{ en: "Sali knows",       hy: "Sali-ն գիտի",   ru: "Sali помнит" },
  online:   { en: "Online",           hy: "Առցանց",      ru: "Онлайн" },
  viewProduct: { en: "View product", hy: "Տեսնել",     ru: "Открыть" },
  viewStore:   { en: "View store",   hy: "Տեսնել",     ru: "Открыть" },

  browseTitle: {
    en: "Browse by Category",
    hy: "Բաժիններ",
    ru: "По категориям",
  },
  browseHeadline: {
    en: "Everything you need",
    hy: "Ամեն ինչ, ինչ պետք է",
    ru: "Всё, что нужно",
  },
  allCategories: {
    en: "All categories",
    hy: "Բոլոր բաժինները",
    ru: "Все категории",
  },
  trendingTitle: {
    en: "Hand-picked for you",
    hy: "Ընտրված է հատուկ ձեզ համար",
    ru: "Подобрано для вас",
  },
  trendingHeadline: {
    en: "Trending Now",
    hy: "Թրենդային",
    ru: "Популярные сейчас",
  },
  trendingTabs: {
    en: [
      { key: "birthday", label: "Birthday" },
      { key: "wedding",  label: "Wedding" },
      { key: "party",    label: "Party" },
    ],
    hy: [
      { key: "birthday", label: "Ծնունդ" },
      { key: "wedding",  label: "Հարսանիք" },
      { key: "party",    label: "Միջոցառում" },
    ],
    ru: [
      { key: "birthday", label: "День рождения" },
      { key: "wedding",  label: "Свадьба" },
      { key: "party",    label: "Вечеринка" },
    ],
  },
  occEyebrow: {
    en: "Plan Any Occasion",
    hy: "Պլանավորեք ցանկացած միջոցառում",
    ru: "Планируйте любое событие",
  },
  occHeadline: {
    en: "What are you celebrating?",
    hy: "Ի՞նչ եք փնտրում: Պատմեք մեր Sali-ին",
    ru: "Что вы празднуете?",
  },
  occSub: {
    en: "Find trusted vendors for every event type — from intimate birthdays to grand weddings.",
    hy: "Գտեք վստահելի մատակարարներ ցանկացած միջոցառման համար՝ ծննդից մինչև հարսանիք։",
    ru: "Найдите проверенных поставщиков для любого события — от уютных дней рождения до пышных свадеб.",
  },
  occCards: {
    en: [
      { slug: "wedding",     icon: "ring",    label: "Wedding" },
      { slug: "birthday",    icon: "cake",    label: "Birthday" },
      { slug: "anniversary", icon: "glass",   label: "Anniversary" },
      { slug: "engagement",  icon: "ring",    label: "Engagement" },
      { slug: "baby_shower", icon: "baby",    label: "Baby Shower" },
      { slug: "christening", icon: "church",  label: "Christening" },
      { slug: "kids_party",  icon: "balloon", label: "Kids Party" },
      { slug: "corporate",   icon: "business",label: "Corporate" },
    ],
    hy: [
      { slug: "wedding",     icon: "ring",    label: "Հարսանիք" },
      { slug: "birthday",    icon: "cake",    label: "Ծնունդ" },
      { slug: "anniversary", icon: "glass",   label: "Տարելից" },
      { slug: "engagement",  icon: "ring",    label: "Նշանադրություն" },
      { slug: "baby_shower", icon: "baby",    label: "Baby Shower" },
      { slug: "christening", icon: "church",  label: "Մկրտություն" },
      { slug: "kids_party",  icon: "balloon", label: "Մանկական" },
      { slug: "corporate",   icon: "business",label: "Կորպորատիվ" },
    ],
    ru: [
      { slug: "wedding",     icon: "ring",    label: "Свадьба" },
      { slug: "birthday",    icon: "cake",    label: "День рождения" },
      { slug: "anniversary", icon: "glass",   label: "Годовщина" },
      { slug: "engagement",  icon: "ring",    label: "Помолвка" },
      { slug: "baby_shower", icon: "baby",    label: "Baby Shower" },
      { slug: "christening", icon: "church",  label: "Крестины" },
      { slug: "kids_party",  icon: "balloon", label: "Детский" },
      { slug: "corporate",   icon: "business",label: "Корпоратив" },
    ],
  },

  /* ── New centered hero (vibrant) ─────────────── */
  aiBadge: {
    en: "New — AI Planner is live in Armenian, Russian & English",
    hy: "Ինչ լեզվով էլ խոսես, մեր AI-ը քեզ կհասկանա",
    ru: "Новинка — AI планировщик доступен на армянском, русском и английском",
  },
  heroPart1: {
    en: "Make every",
    hy: "Դարձրեք յուրաքանչյուր",
    ru: "Сделайте каждый",
  },
  heroPart2: {
    en: "unforgettable.",
    hy: "անմոռանալի։",
    ru: "незабываемым.",
  },
  heroRotateWords: {
    en: ["birthday", "wedding", "baby shower", "engagement", "anniversary"],
    hy: ["ծնունդ", "հարսանիք", "baby shower", "նշանադրություն", "տարելից"],
    ru: ["день рождения", "свадьбу", "baby shower", "помолвку", "годовщину"],
  },
  heroSubtitle: {
    en: "Armenia's most beautiful celebrations start here. Cakes, flowers, venues, photographers — all in one place, with an AI that plans alongside you.",
    hy: "Ամենագեղեցիկ տոները սկսվում են այստեղ․ Մեր AI օգնականը կգտնի քեզ համար տորթեր, ծաղիկներ, փուչիկներ ու ինչ կկամենաս՝ մեկ հարթակում:",
    ru: "Самые красивые торжества Армении начинаются здесь. Торты, цветы, площадки, фотографы — всё в одном месте, с AI-помощником рядом.",
  },
  heroPlaceholder: {
    en: "What are you celebrating?",
    hy: "Ի՞նչ եք նշում",
    ru: "Что вы празднуете?",
  },
  askAI: { en: "Ask AI", hy: "Հարցնել AI", ru: "Спросить AI" },

  quickChips: {
    en: [
      { icon: "cake",     name: "Cakes",       service_type: "cake" },
      { icon: "flower",   name: "Flowers",     service_type: "flowers" },
      { icon: "balloon",  name: "Balloons",    service_type: "balloon_decoration" },
      { icon: "camera",   name: "Photography", service_type: "photographer" },
      { icon: "music",    name: "DJ & Music",  service_type: "music" },
      { icon: "utensils", name: "Catering",    service_type: "catering" },
      { icon: "gift",     name: "Gifts",       service_type: "gifts" },
    ],
    hy: [
      { icon: "cake",     name: "Տորթեր",      service_type: "cake" },
      { icon: "flower",   name: "Ծաղիկներ",   service_type: "flowers" },
      { icon: "balloon",  name: "Փուչիկներ",  service_type: "balloon_decoration" },
      { icon: "camera",   name: "Ֆոտո",       service_type: "photographer" },
      { icon: "music",    name: "DJ",          service_type: "music" },
      { icon: "utensils", name: "Քեյթերինգ",  service_type: "catering" },
      { icon: "gift",     name: "Նվերներ",     service_type: "gifts" },
    ],
    ru: [
      { icon: "cake",     name: "Торты",       service_type: "cake" },
      { icon: "flower",   name: "Цветы",       service_type: "flowers" },
      { icon: "balloon",  name: "Шары",        service_type: "balloon_decoration" },
      { icon: "camera",   name: "Фото",        service_type: "photographer" },
      { icon: "music",    name: "DJ",          service_type: "music" },
      { icon: "utensils", name: "Кейтеринг",  service_type: "catering" },
      { icon: "gift",     name: "Подарки",     service_type: "gifts" },
    ],
  },

  trust: {
    en: ["850+ verified vendors", "4.9 from 6,400+ reviews", "15K+ events planned"],
    hy: ["850+ հաստատված գործընկեր", "4.9 6,400+ կարծիքներից", "15K+ պլանավորված միջոցառում"],
    ru: ["850+ проверенных поставщиков", "4.9 из 6,400+ отзывов", "15K+ спланированных событий"],
  },

  marquee: {
    en: ["Birthday", "Wedding", "Baby Shower", "Anniversary", "Corporate", "Engagement", "Kids Party", "Christmas", "Baptism"],
    hy: ["Ծնունդ", "Հարսանիք", "Baby Shower", "Տարելից", "Կորպորատիվ", "Նշանադրություն", "Մանկական", "Ամանոր", "Մկրտություն"],
    ru: ["День рождения", "Свадьба", "Baby Shower", "Годовщина", "Корпоратив", "Помолвка", "Детский", "Новый год", "Крестины"],
  },

  /* ── Browse Moments (replaces Plan Any Occasion) ── */
  momentsEyebrow:   { en: "Browse moments", hy: "Ընտրեք", ru: "Просмотрите моменты" },
  momentsHeadline: {
    en: "Pick the moment. We'll bring it to life.",
    hy: "Պատմիր քո պատկերացումները, մենք կյանքի կկոչենք։",
    ru: "Выберите момент. Мы воплотим его в жизнь.",
  },
  momentsAllEvents: { en: "All events", hy: "Բոլորը", ru: "Все события" },
  momentsPlan:      { en: "Plan it",    hy: "Պլանավորել", ru: "Планировать" },
  momentsExplore:   { en: "Explore",    hy: "Տեսնել",     ru: "Открыть" },

  moments: {
    en: [
      { slug: "wedding",     name: "Weddings",     img: "/images/wedding-arch-beach.jpg", grad: "rose-brand",   icon: "heart"    },
      { slug: "birthday",    name: "Birthdays",    img: "/images/cupcakes.jpg",           grad: "amber-rose",   icon: "cake"     },
      { slug: "baby_shower", name: "Baby Showers", img: "/images/balloons-blue.jpg",      grad: "sky-violet",   icon: "balloon"  },
      { slug: "corporate",   name: "Corporate",    img: "/images/event-dinner.jpg",       grad: "slate",        icon: "business" },
      { slug: "engagement",  name: "Engagements",  img: "/images/wedding-dance.jpg",      grad: "fuchsia-rose", icon: "ring"     },
      { slug: "kids_party",  name: "Kids Parties", img: "/images/party-balloons.jpg",     grad: "emerald-cyan", icon: "gift"     },
    ],
    hy: [
      { slug: "wedding",     name: "Հարսանիք",     img: "/images/wedding-arch-beach.jpg", grad: "rose-brand",   icon: "heart"    },
      { slug: "birthday",    name: "Ծնունդներ",    img: "/images/cupcakes.jpg",           grad: "amber-rose",   icon: "cake"     },
      { slug: "baby_shower", name: "Baby Shower",  img: "/images/balloons-blue.jpg",      grad: "sky-violet",   icon: "balloon"  },
      { slug: "corporate",   name: "Կորպորատիվ",   img: "/images/event-dinner.jpg",       grad: "slate",        icon: "business" },
      { slug: "engagement",  name: "Նշանադրություն",img: "/images/wedding-dance.jpg",     grad: "fuchsia-rose", icon: "ring"     },
      { slug: "kids_party",  name: "Մանկական",     img: "/images/party-balloons.jpg",     grad: "emerald-cyan", icon: "gift"     },
    ],
    ru: [
      { slug: "wedding",     name: "Свадьбы",        img: "/images/wedding-arch-beach.jpg", grad: "rose-brand",   icon: "heart"    },
      { slug: "birthday",    name: "Дни рождения",   img: "/images/cupcakes.jpg",           grad: "amber-rose",   icon: "cake"     },
      { slug: "baby_shower", name: "Baby Shower",    img: "/images/balloons-blue.jpg",      grad: "sky-violet",   icon: "balloon"  },
      { slug: "corporate",   name: "Корпоратив",     img: "/images/event-dinner.jpg",       grad: "slate",        icon: "business" },
      { slug: "engagement",  name: "Помолвки",       img: "/images/wedding-dance.jpg",      grad: "fuchsia-rose", icon: "ring"     },
      { slug: "kids_party",  name: "Детские",        img: "/images/party-balloons.jpg",     grad: "emerald-cyan", icon: "gift"     },
    ],
  },
};

const tx = (obj, lang) => obj[lang] || obj.en;

// ── Icon set (replaces all emoji) ─────────────────────────────────
const ICON_PATHS = {
  cake:     <><path d="M20 21V11a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10"/><path d="M4 16h16"/><path d="M12 9V6"/><path d="M12 4v0"/><path d="M2 21h20"/></>,
  balloon:  <><path d="M12 16c3.5 0 6-3.5 6-7a6 6 0 1 0-12 0c0 3.5 2.5 7 6 7Z"/><path d="M12 16v3"/><path d="M10.5 19h3"/></>,
  gift:     <><rect x="3" y="8" width="18" height="13" rx="1.5"/><path d="M3 12h18"/><path d="M12 8v13"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 5 12 8c0-3 2-5 4.5-5a2.5 2.5 0 0 1 0 5"/></>,
  ring:     <><circle cx="12" cy="14" r="6"/><path d="m9 8 1.5-4h3L15 8"/></>,
  bolt:     <><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></>,
  sparkle:  <><path d="M12 3 14 9l6 2-6 2-2 6-2-6-6-2 6-2 2-6Z"/><path d="M19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z"/></>,
  search:   <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>,
  check:    <><path d="m5 12 5 5 9-11"/></>,
  heart:    <><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z"/></>,
  pin:      <><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4M16 3v4"/></>,
  users:    <><circle cx="9" cy="8" r="3.5"/><path d="M3 21c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M15 14.5a4.5 4.5 0 0 1 6 4.5"/></>,
  user:     <><circle cx="12" cy="8" r="3.5"/><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/></>,
  dollar:   <><path d="M12 2v20"/><path d="M16 7h-5a3 3 0 0 0 0 6h2a3 3 0 0 1 0 6H7"/></>,
  palette:  <><path d="M12 3a9 9 0 0 0 0 18c1.5 0 2.5-1 2.5-2.3 0-1.4-1-2.4-2.5-2.4-1 0-1.7-.5-1.7-1.4 0-1 .8-1.4 2-1.4H14a4 4 0 0 0 0-8 9 9 0 0 0-2-1.5Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="11" cy="7.5" r="1"/><circle cx="16" cy="9" r="1"/></>,
  attach:   <><path d="M21.4 11 12.2 20.2a6 6 0 1 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 1 1-2.8-2.8l8.5-8.5"/></>,
  mic:      <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11v1a7 7 0 0 0 14 0v-1"/><path d="M12 19v3"/><path d="M8 22h8"/></>,
  send:     <><path d="m3 11 18-8-8 18-2-8-8-2Z"/></>,
  arrowRight: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  arrowDown:  <><path d="M12 5v14"/><path d="m6 13 6 6 6-6"/></>,
  history:  <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></>,
  clock:    <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  flower:   <><circle cx="12" cy="12" r="2.5"/><path d="M12 9.5C12 6 9.5 4 7 5s-2 4 0 5.5"/><path d="M14.5 12c3.5 0 5.5-2.5 4.5-5s-4-2-5.5 0"/><path d="M12 14.5c0 3.5 2.5 5.5 5 4.5s2-4 0-5.5"/><path d="M9.5 12c-3.5 0-5.5 2.5-4.5 5s4 2 5.5 0"/></>,
  glass:    <><path d="M5 4h14l-1.5 8a5 5 0 0 1-4.5 3.5h-2A5 5 0 0 1 6.5 12L5 4Z"/><path d="M12 15.5V21"/><path d="M9 21h6"/></>,
  party:    <><path d="m4 20 4-13 9 9-13 4Z"/><path d="M9 8c2-2 4-4 7-4"/><path d="M16 14c-1.5 1-2 2.5-2 4"/></>,
  business: <><rect x="3" y="6" width="18" height="14" rx="1.5"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M3 12h18"/></>,
  baby:     <><circle cx="12" cy="11" r="4.5"/><path d="M9 18a4 4 0 0 0 6 0"/><path d="M9.5 8.5h.01"/><path d="M14.5 8.5h.01"/></>,
  church:   <><path d="M12 2v6"/><path d="M9 5h6"/><path d="M5 21V11l7-4 7 4v10"/><path d="M9 21v-5h6v5"/></>,
  x:        <><path d="M6 6l12 12"/><path d="M18 6 6 18"/></>,
  bookmark: <><path d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1Z"/></>,
  grid:     <><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></>,
  flame:    <><path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 1-5 0 2 1 3 2 3 0-3 0-5 2-8z"/></>,
  plus:     <><path d="M12 5v14"/><path d="M5 12h14"/></>,
  cart:     <><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l3 12h12l2-8H6"/></>,
  minimize: <><path d="M4 14h6v6"/><path d="M20 10h-6V4"/><path d="m4 20 6-6"/><path d="m20 4-6 6"/></>,
  camera:   <><path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="4"/></>,
  music:    <><path d="M9 17V5l11-2v12"/><circle cx="6" cy="17" r="3"/><circle cx="17" cy="15" r="3"/></>,
  utensils: <><path d="M5 3v8a2 2 0 0 0 2 2v8"/><path d="M9 3v8a2 2 0 0 1-2 2"/><path d="M14 3v18"/><path d="M18 3c2 1 3 3 3 6s-1 5-3 6v6"/></>,
  star:     <><path d="m12 3 2.5 5.5L20 10l-4.5 4 1.5 6L12 17l-5 3 1.5-6L4 10l5.5-1.5z"/></>,
  zap:      <><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></>,
};
function Icon({ name, size = 18, className = "", style }) {
  const path = ICON_PATHS[name] || ICON_PATHS.sparkle;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style} aria-hidden
    >{path}</svg>
  );
}

function imgSrc(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1").replace("/api/v1", "");
  return `${base}${url}`;
}
const fmt = (p) => { const n = parseFloat(p); return isNaN(n) ? "" : n.toLocaleString() + " ֏"; };

// Fixes Armenian token-split artifacts like "Ո. րն" → "Որն" that can appear
// in LLM output when an uppercase letter gets separated from the rest of the word.
function fixArmenianText(text) {
  if (!text) return text;
  // Remove period before lowercase Armenian letter (broken mid-word split)
  text = text.replace(/([Ա-Ֆա-ֆ])\.\s([ա-ֆ])/g, "$1$2");
  // Remove period before question/exclamation mark
  text = text.replace(/\.\s*([?!])/g, "$1");
  // Remove double punctuation
  text = text.replace(/([?!])\s*[.،,]\s*/g, "$1 ");
  // Remove trailing dots before closing quotes
  text = text.replace(/\.\s*(»)/g, "$1");
  return text;
}

function BoldText({ text }) {
  return <>{text.split(/\*\*(.*?)\*\*/g).map((s, i) => i % 2 === 1 ? <strong key={i} style={{ color: PINK_DARK }}>{s}</strong> : s)}</>;
}
// Renders text with **bold**, newlines, and inline links.
// Recognizes:
//   - Markdown [label](url)
//   - Bare URLs (https://… or relative /en/events/…, /hy/category/…)
function renderInline(text) {
  const out = [];
  const re = /\[([^\]]+)\]\((\S+?)\)|(\bhttps?:\/\/[^\s<>"]+|\B\/(?:en|hy|ru)\/(?:events|category|vendor|product)\/[A-Za-z0-9_\-/]+)/g;
  let last = 0;
  let m;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(<BoldText key={`t${key++}`} text={text.slice(last, m.index)} />);
    const label = m[1] || m[2] || m[3];
    const url = m[2] || m[3];
    const isExternal = url.startsWith("http");
    out.push(
      <a
        key={`l${key++}`}
        href={url}
        target={isExternal ? "_blank" : "_self"}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="v2-msg-link"
      >{label}</a>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(<BoldText key={`t${key++}`} text={text.slice(last)} />);
  return out;
}

function MsgText({ text }) {
  return (
    <span style={{ whiteSpace: "pre-wrap", lineHeight: 1.75 }}>
      {text.split("\n").map((line, i, a) => (
        <span key={i}>{renderInline(line)}{i < a.length - 1 && <br />}</span>
      ))}
    </span>
  );
}

const EVENT_ICONS = {
  birthday: "cake", kids_party: "balloon", wedding: "ring", corporate: "business",
  engagement: "ring", anniversary: "glass", baby_shower: "baby", christening: "church",
};

function StateBar({ state, lang }) {
  const pills = [];
  if (state.event_type) pills.push({ icon: EVENT_ICONS[state.event_type] || "party", label: state.event_type.replace(/_/g, " ") });
  if (state.recipient) {
    let label = state.recipient;
    if (state.age != null) label += ` · ${state.age}`;
    pills.push({ icon: "user", label });
  }
  if (state.deadline) pills.push({ icon: "clock", label: state.deadline });
  if (state.city) pills.push({ icon: "pin", label: state.city });
  if (state.style) pills.push({ icon: "sparkle", label: state.style });
  if (!pills.length) return null;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 7, padding: "9px 18px",
      borderBottom: "1px solid rgba(240,218,228,.5)",
      background: "rgba(255,248,251,.85)",
      backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
      flexWrap: "wrap", minHeight: 42,
    }}>
      <span style={{
        fontSize: 9.5, color: "#c0a0b0", fontWeight: 800,
        letterSpacing: 1, textTransform: "uppercase", flexShrink: 0,
      }}>
        {tx(T.saliKnows, lang)}
      </span>
      {pills.map((p, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "4px 12px 4px 9px", borderRadius: 22,
          background: "#fff", border: "1px solid rgba(240,218,228,.9)",
          fontSize: 11.5, color: "#5a1a2f", fontWeight: 600,
          boxShadow: "0 1px 4px rgba(225,29,92,.07)",
        }}>
          <Icon name={p.icon} size={13} style={{ color: PINK }} />
          {p.label}
        </div>
      ))}
    </div>
  );
}

// ── Happy Sali mascot — friendly robot with party hat ──────────────
function BotMascot({ size = 44 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 64 64" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden
    >
      <defs>
        <linearGradient id="bm-body" x1="16" y1="20" x2="48" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff7fa" />
          <stop offset="1" stopColor="#ffe1ec" />
        </linearGradient>
        <linearGradient id="bm-hat" x1="36" y1="6" x2="50" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f43f5e" />
          <stop offset="1" stopColor="#9f1239" />
        </linearGradient>
        <linearGradient id="bm-screen" x1="20" y1="28" x2="44" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1a0a14" />
          <stop offset="1" stopColor="#3a1424" />
        </linearGradient>
      </defs>
      {/* Soft cheek glow */}
      <circle cx="20" cy="46" r="3.6" fill="#ffd5e2" opacity=".9" />
      <circle cx="44" cy="46" r="3.6" fill="#ffd5e2" opacity=".9" />
      {/* Head body */}
      <path
        d="M16 28c0-6.6 5.4-12 12-12h8c6.6 0 12 5.4 12 12v14c0 4.4-3.6 8-8 8H24c-4.4 0-8-3.6-8-8V28Z"
        fill="url(#bm-body)" stroke="#1a0a14" strokeWidth="2.2" strokeLinejoin="round"
      />
      {/* Ears */}
      <rect x="10" y="32" width="6" height="10" rx="3" fill="#fff7fa" stroke="#1a0a14" strokeWidth="2" />
      <rect x="48" y="32" width="6" height="10" rx="3" fill="#fff7fa" stroke="#1a0a14" strokeWidth="2" />
      {/* Antenna dot */}
      <circle cx="32" cy="13" r="2.4" fill="#e11d5c" />
      {/* Screen face */}
      <rect x="20" y="28" width="24" height="14" rx="6" fill="url(#bm-screen)" />
      {/* Eyes — happy curves in brand pink */}
      <path d="M25 36c.8-1.6 2.2-2.4 3.6-2.4s2.8.8 3.6 2.4" stroke="#ffb6cc" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M32.8 36c.8-1.6 2.2-2.4 3.6-2.4s2.8.8 3.6 2.4" stroke="#ffb6cc" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      {/* Smile in brand pink */}
      <path d="M28 47c1.4 1.6 3 2.4 4 2.4s2.6-.8 4-2.4" stroke="#e11d5c" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Party hat */}
      <path d="M30 16 L40 16 L37 4 Z" fill="url(#bm-hat)" stroke="#1a0a14" strokeWidth="2" strokeLinejoin="round" />
      <path d="M31 12 L39 12" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M30.5 9 L38.5 9" stroke="#ffd5e2" strokeWidth="1.2" strokeLinecap="round" opacity=".9" />
      {/* Hat star */}
      <path d="M37 3.5 L37.7 5.3 L39.6 5.3 L38.1 6.4 L38.7 8.3 L37 7.1 L35.3 8.3 L35.9 6.4 L34.4 5.3 L36.3 5.3 Z" fill="#ffd5e2" />
    </svg>
  );
}

function Avatar({ size = 30 }) {
  return (
    <div className="v2-avatar" style={{ width: size, height: size, minWidth: size }}>
      <span className="v2-avatar-ring" />
      <span className="v2-avatar-core" style={{ padding: 2 }}>
        <BotMascot size={Math.round(size * 0.78)} />
      </span>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Avatar />
      <div style={{
        display: "flex", alignItems: "center", gap: 4, padding: "14px 18px",
        background: "linear-gradient(135deg,#fff 0%,#fff5f8 100%)",
        borderRadius: "6px 20px 20px 20px",
        border: "1.5px solid rgba(240,218,228,.85)",
        boxShadow: "0 2px 8px rgba(225,29,92,.07), 0 6px 20px rgba(0,0,0,.05)",
      }}>
        {[0, 1, 2, 3, 4].map(i => (
          <span key={i} style={{
            width: 3,
            borderRadius: 3,
            display: "block",
            background: i % 2 === 0 ? PINK : PINK_DARK,
            animation: `v2wave 1.1s ease-in-out ${i * 0.1}s infinite`,
            opacity: 0.85,
          }} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ p, lang, onOpen, onAddToPlan }) {
  const img = imgSrc(p.thumbnail_url || p.images?.[0]?.url);
  const name = (lang !== "en" && p[`name_${lang}`]) || p.name || "Product";
  const [hover, setHover] = useState(false);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [planAdded, setPlanAdded] = useState(false);

  const handleAddCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (added) return;
    addToCart({
      product_id: p.id,
      vendor_id: p.vendor_id,
      name,
      price: parseFloat(p.price) || 0,
      image: img,
      qty: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleAddPlan = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (planAdded || !onAddToPlan) return;
    onAddToPlan(p);
    setPlanAdded(true);
    setTimeout(() => setPlanAdded(false), 2000);
  };

  return (
    <div
      onClick={() => onOpen(p, "product")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === "Enter") onOpen(p, "product"); }}
      style={{
        flexShrink: 0, width: 158, borderRadius: 18, padding: 0,
        background: "#fff", cursor: "pointer", textAlign: "left",
        overflow: "hidden", position: "relative",
        border: `1.5px solid ${hover ? "#fbc9d8" : "rgba(240,228,232,.8)"}`,
        boxShadow: hover
          ? "0 16px 36px rgba(225,29,92,.16), 0 4px 12px rgba(225,29,92,.08)"
          : "0 1px 2px rgba(0,0,0,.03), 0 4px 14px rgba(0,0,0,.05)",
        transform: hover ? "translateY(-4px) scale(1.01)" : "none",
        transition: "all .28s cubic-bezier(.2,.8,.2,1)",
      }}
    >
      <div style={{ width: "100%", aspectRatio: "1/1", background: "linear-gradient(145deg,#fdf3f6,#fbe8ed)", position: "relative", overflow: "hidden" }}>
        {img
          ? <Image src={img} alt={name} fill style={{ objectFit: "cover", transform: hover ? "scale(1.07)" : "none", transition: "transform .4s ease" }} sizes="158px" />
          : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#e0c0cb" }}><Icon name="gift" size={32} /></div>}
        {p.price > 0 && (
          <button
            type="button"
            onClick={handleAddCart}
            aria-label={lang === "ru" ? "В корзину" : lang === "hy" ? "Զամբյուղ" : "Add to cart"}
            className={`v2-mini-cart ${added ? "is-added" : ""}`}
          >
            <Icon name={added ? "check" : "plus"} size={14} />
          </button>
        )}
        {onAddToPlan && (
          <button
            type="button"
            onClick={handleAddPlan}
            aria-label={lang === "hy" ? "Ավելացնել պլանին" : lang === "ru" ? "В план" : "Add to plan"}
            style={{
              position: "absolute", top: 8, left: 8,
              width: 28, height: 28, borderRadius: "50%",
              background: planAdded ? "#10b981" : "rgba(255,255,255,0.92)",
              border: `1.5px solid ${planAdded ? "#10b981" : "#e11d5c"}`,
              color: planAdded ? "#fff" : "#e11d5c",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.12)",
              transition: "all .22s ease", fontSize: 11, fontWeight: 700,
            }}
          >
            {planAdded ? <Icon name="check" size={12} /> : <Icon name="bookmark" size={12} />}
          </button>
        )}
      </div>
      <div style={{ padding: "11px 13px 13px" }}>
        <p style={{
          margin: 0, fontSize: 12.5, fontWeight: 600, color: "#1a0a14", lineHeight: 1.4,
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>{name}</p>
        {p.price > 0 && <p style={{ margin: "6px 0 0", fontSize: 13, fontWeight: 800, color: PINK, letterSpacing: -0.3 }}>{fmt(p.price)}</p>}
      </div>
    </div>
  );
}

function VendorCard({ v, onOpen }) {
  const banner = imgSrc(v.banner_url || v.logo_url);
  const logo = imgSrc(v.logo_url);
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={() => onOpen(v, "vendor")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flexShrink: 0, width: 176, borderRadius: 18, padding: 0,
        background: "#fff", cursor: "pointer", textAlign: "left", overflow: "hidden",
        border: `1.5px solid ${hover ? "#fbc9d8" : "rgba(240,228,232,.8)"}`,
        boxShadow: hover
          ? "0 16px 36px rgba(225,29,92,.16), 0 4px 12px rgba(225,29,92,.08)"
          : "0 1px 2px rgba(0,0,0,.03), 0 4px 14px rgba(0,0,0,.05)",
        transform: hover ? "translateY(-4px) scale(1.01)" : "none",
        transition: "all .28s cubic-bezier(.2,.8,.2,1)",
      }}
    >
      <div style={{ width: "100%", height: 80, background: "linear-gradient(135deg,#fce7ef 0%,#fde8ec 60%,#fff1f5 100%)", position: "relative", overflow: "hidden" }}>
        {banner && <Image src={banner} alt="" fill style={{ objectFit: "cover" }} sizes="176px" />}
        {logo && (
          <div style={{
            position: "absolute", bottom: -15, left: 13, width: 34, height: 34,
            borderRadius: "50%", border: "3px solid #fff", overflow: "hidden", background: "#fff",
            boxShadow: "0 3px 10px rgba(0,0,0,.14)",
          }}>
            <Image src={logo} alt="" fill style={{ objectFit: "cover" }} sizes="34px" />
          </div>
        )}
      </div>
      <div style={{ padding: "22px 13px 13px" }}>
        <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: "#1a0a14", letterSpacing: -0.1 }}>
          {v.business_name || "Store"}
        </p>
        {v.city && <p style={{ margin: "3px 0 0", fontSize: 11, color: "#b09aa6", display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="pin" size={11} />{v.city}</p>}
        {v.short_bio && (
          <p style={{
            margin: "5px 0 0", fontSize: 11, color: "#7c6571", lineHeight: 1.45,
            overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          }}>{v.short_bio}</p>
        )}
      </div>
    </button>
  );
}

function Block({ block, lang, onOpen, onAddToPlan }) {
  const items = block.data;
  if (!items || (Array.isArray(items) && !items.length)) return null;
  return (
    <div>
      {block.title && (
        <p style={{
          margin: "0 0 9px 40px", fontSize: 10, fontWeight: 800,
          color: "#c8adb8", letterSpacing: 1, textTransform: "uppercase",
        }}>{block.title}{items.length > 1 ? ` (${items.length})` : ""}</p>
      )}
      <div className="v2-cards" style={{
        display: "flex", gap: 12, overflowX: "auto", paddingBottom: 6,
        paddingLeft: 40, paddingRight: 16,
        overscrollBehaviorX: "contain", WebkitOverflowScrolling: "touch",
        scrollSnapType: "x mandatory",
      }}>
        {block.type === "products" && items.map((p, i) => (
          <ProductCard
            key={p.id || i} p={p} lang={lang} onOpen={onOpen}
            onAddToPlan={onAddToPlan ? (item) => onAddToPlan(item, block.service_type) : null}
          />
        ))}
        {block.type === "vendors" && items.map((v, i) => (
          <VendorCard key={v.id || i} v={v} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function MsgBubble({ msg, lang, onPlanEvent }) {
  if (msg.role === "user") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{
          maxWidth: "72%", padding: "12px 17px", fontSize: 14, lineHeight: 1.65,
          borderRadius: "22px 22px 6px 22px",
          background: `linear-gradient(135deg,${PINK} 0%,#f43f5e 100%)`,
          color: "#fff",
          boxShadow: "0 6px 18px rgba(225,29,92,.3)",
          letterSpacing: 0.1,
        }}>
          <MsgText text={msg.text} />
        </div>
      </div>
    );
  }

  if (msg.role === "bot") {
    if (msg.type === "text") {
      return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
          <Avatar />
          <div style={{
            maxWidth: "84%", padding: "13px 17px", fontSize: 14, lineHeight: 1.75,
            borderRadius: "6px 22px 22px 22px",
            background: "#fff", color: "#1a0a14",
            border: "1.5px solid rgba(240,228,232,.9)",
            boxShadow: "0 1px 2px rgba(0,0,0,.03), 0 6px 16px rgba(0,0,0,.05)",
            letterSpacing: 0.1,
          }}>
            <MsgText text={msg.text} />
          </div>
        </div>
      );
    }
    if (msg.type === "plan") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar />
          <button
            onClick={() => onPlanEvent(msg.event_type)}
            style={{
              padding: "13px 26px", borderRadius: 16, border: "none",
              background: `linear-gradient(135deg,${PINK} 0%,#f43f5e 100%)`,
              color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: 0.1,
              cursor: "pointer", boxShadow: "0 8px 22px rgba(225,29,92,.34)",
              transition: "transform .15s, box-shadow .15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(225,29,92,.44)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(225,29,92,.34)"; }}
          >
            {tx(T.planBtn, lang)}
          </button>
        </div>
      );
    }
  }
  return null;
}

function Popup({ item, type, lang, onClose }) {
  const [idx, setIdx] = useState(0);
  const imgs = [];
  if (type === "product") {
    (item.images || []).forEach(i => { const s = imgSrc(i.url); if (s) imgs.push(s); });
    if (!imgs.length && item.thumbnail_url) { const s = imgSrc(item.thumbnail_url); if (s) imgs.push(s); }
  } else {
    [item.banner_url, item.logo_url].forEach(u => { const s = imgSrc(u); if (s && !imgs.includes(s)) imgs.push(s); });
  }
  const name = type === "product"
    ? ((lang !== "en" && item[`name_${lang}`]) || item.name || "Product")
    : (item.business_name || "Store");
  const desc = type === "product"
    ? ((lang !== "en" && item[`short_description_${lang}`]) || item.short_description || item.description?.replace(/<[^>]+>/g, "") || "")
    : (item.short_bio || item.description?.replace(/<[^>]+>/g, "") || "");
  const href = type === "product"
    ? `/${lang}/product/${item.id}`
    : `/${lang}/vendor/${item.slug || item.id}`;

  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    if (added) return;
    addToCart({
      product_id: item.id,
      vendor_id: item.vendor_id,
      name,
      price: parseFloat(item.price) || 0,
      image: imgs[0] || null,
      qty: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div onClick={onClose} className="v2-pop-back">
      <div onClick={e => e.stopPropagation()} className="v2-pop">
        <button onClick={onClose} className="v2-pop-close" aria-label="Close">
          <Icon name="x" size={16} />
        </button>

        {/* Image / gallery */}
        <div className="v2-pop-media">
          {imgs[idx]
            ? <Image src={imgs[idx]} alt={name} fill style={{ objectFit: "cover" }} sizes="(max-width:760px) 100vw, 420px" />
            : <div className="v2-pop-fallback"><Icon name="gift" size={60} /></div>}
          {imgs.length > 1 && (
            <div className="v2-pop-thumbs">
              {imgs.slice(0, 5).map((src, i) => (
                <button key={i} onClick={() => setIdx(i)} className={`v2-pop-thumb ${i === idx ? "is-active" : ""}`} aria-label={`Image ${i+1}`}>
                  <Image src={src} alt="" fill style={{ objectFit: "cover" }} sizes="56px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details column */}
        <div className="v2-pop-info">
          <h2 className="v2-pop-name">{name}</h2>

          {type === "product" && item.price > 0 && (
            <p className="v2-pop-price">{fmt(item.price)}</p>
          )}
          {type === "vendor" && item.city && (
            <p className="v2-pop-meta"><Icon name="pin" size={13} />{item.city}</p>
          )}

          {desc && (
            <p className="v2-pop-desc">
              {desc.slice(0, 220)}{desc.length > 220 ? "…" : ""}
            </p>
          )}

          {type === "product" && item.tags?.length > 0 && (
            <div className="v2-pop-tags">
              {item.tags.slice(0, 4).map((tag, i) => (
                <span key={i} className="v2-pop-tag">{tag}</span>
              ))}
            </div>
          )}

          <div className="v2-pop-actions">
            {type === "product" && item.price > 0 && (
              <button onClick={handleAdd} className={`v2-pop-cart ${added ? "is-added" : ""}`}>
                <Icon name={added ? "check" : "gift"} size={16} />
                {added
                  ? (lang === "ru" ? "Добавлено" : lang === "hy" ? "Ավելացված է" : "Added")
                  : (lang === "ru" ? "В корзину" : lang === "hy" ? "Զամբյուղ" : "Add to cart")}
              </button>
            )}
            <Link href={href} target="_blank" rel="noopener noreferrer" className="v2-pop-view">
              {type === "product" ? tx(T.viewProduct, lang) : tx(T.viewStore, lang)}
              <Icon name="arrowRight" size={14} style={{ marginLeft: 6 }} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const HERO_CARDS = [
  { src: "/images/wedding-cake.jpg",   tag: "wedding",  icon: "ring" },
  { src: "/images/party-balloons.jpg", tag: "birthday", icon: "balloon" },
  { src: "/images/cupcakes.jpg",       tag: "celebration", icon: "cake" },
];

function OrbVisual({ lang }) {
  // Premium floating Polaroid stack — three event photos arranged in depth
  const labels = {
    en: { wedding: "Wedding", birthday: "Birthday", celebration: "Celebration", planned: "Planned" },
    hy: { wedding: "Հարսանիք", birthday: "Ծնունդ", celebration: "Տոն", planned: "Պլանավորված" },
    ru: { wedding: "Свадьба", birthday: "День рожд.", celebration: "Праздник", planned: "Готово" },
  };
  const L = labels[lang] || labels.en;

  return (
    <div className="v2-stack-stage">
      {/* Ambient halo */}
      <div className="v2-stack-halo" />

      {/* Floating sparkle particles */}
      {[0,1,2,3,4,5].map(i => (
        <span key={i} className={`v2-stack-spark v2-stack-spark-${i}`} />
      ))}

      {/* Card 1 — back */}
      <div className="v2-stack-card v2-stack-card-3">
        <div className="v2-stack-img">
          <Image src={HERO_CARDS[2].src} alt="" fill sizes="280px" style={{ objectFit: "cover" }} />
        </div>
        <div className="v2-stack-tag"><Icon name={HERO_CARDS[2].icon} size={12} />{L.celebration}</div>
      </div>

      {/* Card 2 — middle */}
      <div className="v2-stack-card v2-stack-card-2">
        <div className="v2-stack-img">
          <Image src={HERO_CARDS[1].src} alt="" fill sizes="300px" style={{ objectFit: "cover" }} priority />
        </div>
        <div className="v2-stack-tag"><Icon name={HERO_CARDS[1].icon} size={12} />{L.birthday}</div>
      </div>

      {/* Card 3 — front */}
      <div className="v2-stack-card v2-stack-card-1">
        <div className="v2-stack-img">
          <Image src={HERO_CARDS[0].src} alt="" fill sizes="320px" style={{ objectFit: "cover" }} priority />
        </div>
        <div className="v2-stack-tag"><Icon name={HERO_CARDS[0].icon} size={12} />{L.wedding}</div>

        {/* Floating success chip */}
        <div className="v2-stack-success">
          <span className="v2-stack-success-dot"><Icon name="check" size={11} /></span>
          <span className="v2-stack-success-text">{L.planned}</span>
        </div>
      </div>

      {/* Floating Sali chip */}
      <div className="v2-stack-sali">
        <Avatar size={32} />
        <div className="v2-stack-sali-text">
          <p>Sali</p>
          <span>AI</span>
        </div>
      </div>
    </div>
  );
}

function Landing({ lang, onSend, onQuickAction, input, setInput, inputRef }) {
  const quickChips = tx(T.quickChips, lang);
  const heroPart1 = tx(T.heroPart1, lang);
  const heroPart2 = tx(T.heroPart2, lang);
  const rotateWords = tx(T.heroRotateWords, lang);
  const trustItems = tx(T.trust, lang);
  const marqueeItems = tx(T.marquee, lang);
  const canSend = input.trim().length > 0;

  // Rotating word
  const [wordIdx, setWordIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setWordIdx(i => (i + 1) % rotateWords.length);
    }, 2400);
    return () => clearInterval(id);
  }, [rotateWords.length]);

  return (
    <div className="v2-landing">
      {/* ── Centered hero ─────────────────────────── */}
      <section className="v2-hero2">
        {/* aurora background */}
        <div className="v2-hero2-aurora" aria-hidden>
          <div className="v2-hero2-glow v2-hero2-glow-rose" />
          <div className="v2-hero2-glow v2-hero2-glow-amber" />
          <div className="v2-hero2-glow v2-hero2-glow-fuchsia" />
        </div>

        <div className="v2-hero2-inner">
          {/* AI live chip */}
          <div className="v2-hero2-chip">
            <span className="v2-hero2-chip-dot">
              <span className="v2-hero2-chip-ping" />
              <span className="v2-hero2-chip-core" />
            </span>
            <span>{tx(T.aiBadge, lang)}</span>
          </div>

          {/* Headline — rotating word locked to line 2 so layout never jumps */}
          <h1 className="v2-hero2-headline">
            <span className="v2-hero2-static">{heroPart1}</span>
            <br />
            <span className="v2-hero2-rotate-wrap">
              <span key={wordIdx} className="v2-hero2-rotate">
                {rotateWords[wordIdx]}
              </span>
            </span>{" "}
            <span className="v2-hero2-static">{heroPart2}</span>
          </h1>

          <p className="v2-hero2-sub">{tx(T.heroSubtitle, lang)}</p>

          {/* Floating glass search → routes to AI */}
          <div className="v2-hero2-search">
            <span className="v2-hero2-search-icon">
              <Icon name="search" size={18} />
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              placeholder={tx(T.heroPlaceholder, lang)}
              className="v2-hero2-search-input"
            />
            <button
              type="button"
              onClick={() => onSend()}
              disabled={!canSend}
              className="v2-hero2-search-btn"
              aria-label={tx(T.askAI, lang)}
            >
              <Icon name="sparkle" size={15} />
              <span className="v2-hero2-search-btn-label">{tx(T.askAI, lang)}</span>
            </button>
          </div>

          {/* Quick chips → also send to AI */}
          <div className="v2-hero2-chips">
            {quickChips.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onQuickAction ? onQuickAction(c) : onSend(c.name)}
                className="v2-hero2-chip-btn"
              >
                <Icon name={c.icon} size={13} style={{ color: PINK }} />
                {c.name}
              </button>
            ))}
          </div>

          {/* Trust strip */}
          <div className="v2-hero2-trust">
            <span className="v2-hero2-trust-item">
              <Icon name="zap" size={14} style={{ color: "#f59e0b" }} />
              {trustItems[0]}
            </span>
            <span className="v2-hero2-trust-sep" />
            <span className="v2-hero2-trust-item">
              <Icon name="star" size={14} style={{ color: PINK, fill: PINK }} />
              {trustItems[1]}
            </span>
            <span className="v2-hero2-trust-sep" />
            <span className="v2-hero2-trust-item">
              <Icon name="calendar" size={14} style={{ color: "#059669" }} />
              {trustItems[2]}
            </span>
          </div>
        </div>

        {/* Marquee */}
        <div className="v2-hero2-marquee">
          <div className="v2-hero2-marquee-track">
            {[0, 1].map((rep) =>
              marqueeItems.map((m, i) => (
                <span key={`${rep}-${i}`} className="v2-hero2-marquee-item">
                  <Icon name="sparkle" size={13} style={{ color: "#f9a8d4" }} />
                  {m}
                </span>
              ))
            )}
          </div>
        </div>
      </section>

            {/* Browse by Category */}
      <BrowseByCategory lang={lang} />
      
      {/* Trending Now */}
      <TrendingNow lang={lang} />



      {/* Browse Moments (replaces Plan Any Occasion) */}
      <BrowseMoments
        lang={lang}
        onPlanAI={() => {
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(() => inputRef?.current?.focus(), 600);
          }
        }}
      />

      {/* "How it works" anchor section below the fold */}
      <section id="v2-howitworks" className="v2-how">
        <h2 className="v2-how-title">
          {lang === "ru" ? "Как Salooote планирует ваш праздник"
            : lang === "hy" ? "Ինչպես ենք օգնում կազմակերպել ձեր տոնը"
            : "How Salooote plans your event"}
        </h2>
        <p className="v2-how-sub">
          {lang === "ru" ? "Скажите, что нужно — мы найдём поставщиков, цены и составим план."
            : lang === "hy" ? "Ասեք ինչ է պետք ու մենք կգտնենք մատակարարներին, գները և կկազմենք պլանը։"
            : "Tell us what you need — we find vendors, prices, and build a plan."}
        </p>
        <div className="v2-how-grid">
          {[
            { icon: "sparkle", title: lang === "ru" ? "Расскажите" : lang === "hy" ? "Պատմում եք" : "Describe",
              desc: lang === "ru" ? "Тип события, дата, бюджет, гости." : lang === "hy" ? "Միջոցառման տեսակը, ամսաթիվն ու թե ոնց եք պատկերացնում:" : "Event type, date, budget, guests." },
            { icon: "search", title: lang === "ru" ? "Найдём" : lang === "hy" ? "Գտնում ենք" : "Find",
              desc: lang === "ru" ? "Подберём поставщиков и продукты." : lang === "hy" ? "Կհստակեցնենք ու կգտնենք ծառայություններ, անցկացման վայրեր և ապրանքներ։" : "We match vendors and products." },
            { icon: "calendar", title: lang === "ru" ? "План" : lang === "hy" ? "Կազմում ենք պլան" : "Plan",
              desc: lang === "ru" ? "Сравните цены, фото, отзывы." : lang === "hy" ? "Համեմատեք արծեքները, լուսանկարները, կարծիքները ու միասին կընտրենք։" : "Compare prices, photos, reviews." },
            { icon: "check", title: lang === "ru" ? "Бронь" : lang === "hy" ? "Ամրագրում ենք" : "Book",
              desc: lang === "ru" ? "Запросите цитату или забронируйте." : lang === "hy" ? "Պատվիրեք մեր հարթակում, գրեք կամ զանգահարեք անմիջապես կամ ամրագրեք ուղիղ։" : "Request a quote or book directly." },
          ].map((card, i) => (
            <div key={i} className="v2-how-card">
              <div className="v2-how-icon"><Icon name={card.icon} size={22} /></div>
              <h3 className="v2-how-card-title">{card.title}</h3>
              <p className="v2-how-card-desc">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── Browse by Category ─────────────────────────────────────────────
function BrowseByCategory({ lang }) {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API}/categories?locale=${lang}`)
      .then(r => r.json())
      .then(j => {
        if (!cancelled) {
          setCats(Array.isArray(j?.data) ? j.data.slice(0, 12) : []);
          setLoading(false);
        }
      })
      .catch(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [lang]);

  if (loading) return null;
  if (!cats.length) return null;

  return (
    <section id="v2-browse" className="v2-browse">
      <div className="v2-browse-head">
        <div>
          <p className="v2-browse-eyebrow">{tx(T.browseTitle, lang)}</p>
          <h2 className="v2-browse-headline">{tx(T.browseHeadline, lang)}</h2>
        </div>
        <Link href={`/${lang}/category`} className="v2-browse-all">
          {tx(T.allCategories, lang)}
          <Icon name="arrowRight" size={14} style={{ marginLeft: 6 }} />
        </Link>
      </div>
      <div className="v2-cat-grid">
        {cats.map(c => {
          const img = imgSrc(c.image_url);
          return (
            <Link
              key={c.id}
              href={`/${lang}/category/${c.slug}`}
              className="v2-cat-card"
            >
              <div className="v2-cat-thumb">
                {img ? (
                  <Image src={img} alt={c.name} fill style={{ objectFit: "cover" }} sizes="(max-width:520px) 50vw, 200px" />
                ) : (
                  <div className="v2-cat-fallback"><Icon name="grid" size={26} /></div>
                )}
              </div>
              <div className="v2-cat-meta">
                <p className="v2-cat-name">{c.name}</p>
                {typeof c.product_count === "number" && (
                  <p className="v2-cat-count">{c.product_count}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ── Trending Now ────────────────────────────────────────────────────
function TrendingNow({ lang }) {
  const tabs = tx(T.trendingTabs, lang);
  const [active, setActive] = useState(tabs[0].key);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const q = encodeURIComponent(active);
    fetch(`${API}/products?limit=8&search=${q}&locale=${lang}`)
      .then(r => r.json())
      .then(j => {
        if (!cancelled) {
          let arr = Array.isArray(j?.data) ? j.data : [];
          if (!arr.length) {
            // Fallback: any products
            return fetch(`${API}/products?limit=8&locale=${lang}`)
              .then(r2 => r2.json())
              .then(j2 => {
                if (!cancelled) setItems(Array.isArray(j2?.data) ? j2.data : []);
                setLoading(false);
              });
          }
          setItems(arr);
          setLoading(false);
        }
      })
      .catch(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [active, lang]);

  return (
    <section className="v2-trending">
      <div className="v2-trending-head">
        <p className="v2-browse-eyebrow">{tx(T.trendingTitle, lang)}</p>
        <h2 className="v2-browse-headline">
          <Icon name="flame" size={26} style={{ marginRight: 8, color: PINK, verticalAlign: -3 }} />
          {tx(T.trendingHeadline, lang)}
        </h2>
        <div className="v2-trend-tabs">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`v2-trend-tab ${active === t.key ? "is-active" : ""}`}
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="v2-trend-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="v2-trend-card v2-skeleton" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="v2-trend-empty">
          {lang === "ru" ? "Скоро появится" : lang === "hy" ? "Շուտով" : "Coming soon"}
        </p>
      ) : (
        <div className="v2-trend-grid">
          {items.slice(0, 8).map(p => {
            const img = imgSrc(p.thumbnail_url || p.images?.[0]?.url);
            const name = (lang !== "en" && p[`name_${lang}`]) || p.name || "Product";
            return (
              <Link key={p.id} href={`/${lang}/product/${p.id}`} className="v2-trend-card">
                <div className="v2-trend-thumb">
                  {img ? (
                    <Image src={img} alt={name} fill style={{ objectFit: "cover" }} sizes="(max-width:920px) 50vw, 240px" />
                  ) : (
                    <div className="v2-trend-fallback"><Icon name="gift" size={32} /></div>
                  )}
                </div>
                <div className="v2-trend-meta">
                  <p className="v2-trend-name">{name}</p>
                  {p.price > 0 && <p className="v2-trend-price">{fmt(p.price)}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

// ── Browse Moments (poster-style grid) ─────────────────────────────
function BrowseMoments({ lang, onPlanAI }) {
  const items = tx(T.moments, lang);
  const planLabel = lang === "hy" ? "Պլանավորիր AI-ով"
                   : lang === "ru" ? "Спланировать с AI"
                   : "Plan with AI";
  return (
    <section className="v2-moments">
      <div className="v2-moments-head">
        <div>
          <p className="v2-browse-eyebrow">{tx(T.momentsEyebrow, lang)}</p>
          <h2 className="v2-browse-headline v2-moments-headline">{tx(T.momentsHeadline, lang)}</h2>
        </div>
        <div className="v2-moments-actions">
          <button
            type="button"
            onClick={() => onPlanAI?.()}
            className="v2-moments-plan-cta"
            aria-label={planLabel}
          >
            <Icon name="sparkle" size={14} />
            <span>{planLabel}</span>
          </button>
          <Link href={`/${lang}/events`} className="v2-moments-all">
            {tx(T.momentsAllEvents, lang)}
            <Icon name="arrowRight" size={14} />
          </Link>
        </div>
      </div>

      <div className="v2-moments-grid">
        {items.map((m, i) => (
          <Link
            key={m.slug}
            href={`/${lang}/events/${m.slug}`}
            className={`v2-moment-card v2-moment-grad-${m.grad} ${i === 0 ? "v2-moment-feature" : ""}`}
          >
            <Image
              src={m.img}
              alt={m.name}
              fill
              className="v2-moment-img"
              sizes={i === 0 ? "(max-width:1024px) 100vw, 66vw" : "(max-width:640px) 50vw, 25vw"}
            />
            <div className="v2-moment-overlay" />
            <div className="v2-moment-body">
              <span className="v2-moment-pill">
                <Icon name={m.icon} size={12} />
                {tx(T.momentsExplore, lang)}
              </span>
              <h3 className="v2-moment-title">{m.name}</h3>
              <span className="v2-moment-cta">
                {tx(T.momentsPlan, lang)}
                <Icon name="arrowRight" size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Plan Any Occasion ──────────────────────────────────────────────
function PlanAnyOccasion({ lang }) {
  const cards = tx(T.occCards, lang);
  return (
    <section className="v2-occ">
      <div className="v2-occ-head">
        <p className="v2-browse-eyebrow">{tx(T.occEyebrow, lang)}</p>
        <h2 className="v2-browse-headline v2-occ-headline">{tx(T.occHeadline, lang)}</h2>
        <p className="v2-occ-sub">{tx(T.occSub, lang)}</p>
      </div>
      <div className="v2-occ-grid">
        {cards.map(c => (
          <Link key={c.slug} href={`/${lang}/events/${c.slug}`} className="v2-occ-card">
            <span className="v2-occ-icon"><Icon name={c.icon} size={24} /></span>
            <span className="v2-occ-label">{c.label}</span>
            <span className="v2-occ-arrow"><Icon name="arrowRight" size={14} /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Chat header — slim, ChatGPT-style ──────────────────────────────
function ChatHeader({ lang, chatState, onToggleSidebar, onNewChat, onClose, sidebarCollapsed }) {
  const stepDefs = [
    { key: "event_type", label: lang === "ru" ? "Тип" : lang === "hy" ? "Տեսակ" : "Type" },
    { key: "deadline",   label: lang === "ru" ? "Дата" : lang === "hy" ? "Ամսաթիվ" : "Date" },
    { key: "city",       label: lang === "ru" ? "Город" : lang === "hy" ? "Քաղաք" : "City" },
    { key: "guest_count",label: lang === "ru" ? "Гости" : lang === "hy" ? "Հյուրեր" : "Guests" },
    { key: "budget",     label: lang === "ru" ? "Бюджет" : lang === "hy" ? "Բյուջե" : "Budget" },
    { key: "style",      label: lang === "ru" ? "Стиль" : lang === "hy" ? "Ոճ" : "Style" },
  ];

  return (
    <div className="v2-chat-head">
      {/* Sidebar toggle — visible always when sidebar is hidden, otherwise only mobile */}
      <button
        type="button"
        className={`v2-head-icon-btn v2-sidebar-toggle ${sidebarCollapsed ? "is-always" : ""}`}
        onClick={onToggleSidebar}
        aria-label={lang === "ru" ? "История" : lang === "hy" ? "Պատմություն" : "History"}
      >
        <Icon name="grid" size={16} />
      </button>

      <div className="v2-head-brand">
        <div className="v2-head-mascot">
          <BotMascot size={42} />
        </div>
        <div className="v2-head-titles">
          <p className="v2-head-name">
            Sali <span className="v2-head-spark"><Icon name="sparkle" size={11} /></span>
          </p>
          <p className="v2-head-role">
            {lang === "ru" ? "Ваш помощник по событиям"
              : lang === "hy" ? "Ձեր տոնի օգնականը"
              : "Your party planner"}
          </p>
        </div>
      </div>

      {/* Step progress */}
      <div className="v2-head-steps">
        {stepDefs.map((s, i) => {
          const filled = !!chatState[s.key];
          return (
            <div key={s.key} className="v2-head-step">
              <div className={`v2-head-dot ${filled ? "is-filled" : ""}`}>
                {filled ? <Icon name="check" size={12} /> : i + 1}
              </div>
              {i < stepDefs.length - 1 && (
                <div className={`v2-head-line ${filled ? "is-filled" : ""}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* New chat */}
      <button
        type="button"
        onClick={onNewChat}
        className="v2-head-new"
        title={lang === "ru" ? "Новый чат" : lang === "hy" ? "Նոր չատ" : "New chat"}
      >
        <Icon name="plus" size={14} />
        <span>{lang === "ru" ? "Новый" : lang === "hy" ? "Նոր" : "New"}</span>
      </button>

      {/* Close (minimize back to landing) */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={lang === "ru" ? "Свернуть" : lang === "hy" ? "Թաքցնել" : "Minimize"}
          title={lang === "ru" ? "Свернуть" : lang === "hy" ? "Թաքցնել" : "Minimize"}
          className="v2-head-close"
        >
          <Icon name="minimize" size={15} />
        </button>
      )}
    </div>
  );
}

// ── Sidebar — ChatGPT-style history list ──────────────────────────
function ChatSidebar({ lang, history, currentId, onPick, onNew, onDelete, open, onClose, onCollapse, collapsed }) {
  const fmtTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    if (isToday) return d.toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString(lang, { day: "numeric", month: "short" });
  };

  if (collapsed) {
    // Sidebar fully hidden on desktop — only the scrim+slide-in on mobile triggered by toggle
    return null;
  }
  return (
    <>
      <aside className={`v2-sidebar ${open ? "is-open" : ""}`}>
        <div className="v2-sidebar-top">
          <button type="button" onClick={onNew} className="v2-sidebar-new">
            <Icon name="plus" size={15} />
            {lang === "ru" ? "Новый чат" : lang === "hy" ? "Նոր չատ" : "New chat"}
          </button>
          <button
            type="button"
            onClick={onCollapse}
            className="v2-sidebar-collapse"
            aria-label={lang === "ru" ? "Скрыть" : lang === "hy" ? "Թաքցնել" : "Hide"}
            title={lang === "ru" ? "Скрыть боковую панель" : lang === "hy" ? "Թաքցնել" : "Hide sidebar"}
          >
            <Icon name="arrowRight" size={15} style={{ transform: "rotate(180deg)" }} />
          </button>
          <button type="button" onClick={onClose} className="v2-sidebar-close" aria-label="Close menu">
            <Icon name="x" size={15} />
          </button>
        </div>

        <div className="v2-sidebar-label">
          {lang === "ru" ? "История" : lang === "hy" ? "Պատմություն" : "History"}
        </div>

        <div className="v2-sidebar-list">
          {history.length === 0 ? (
            <p className="v2-sidebar-empty">
              {lang === "ru" ? "Пусто. Начните разговор."
                : lang === "hy" ? "Դատարկ է։ Սկսեք զրույց։"
                : "No chats yet. Start a conversation."}
            </p>
          ) : history.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => onPick(s.id)}
              className={`v2-sidebar-row ${s.id === currentId ? "is-active" : ""}`}
            >
              <div className="v2-sidebar-row-main">
                <Icon name="sparkle" size={13} />
                <span className="v2-sidebar-row-title">{s.title || "Untitled"}</span>
              </div>
              <div className="v2-sidebar-row-meta">
                <span>{fmtTime(s.updatedAt)}</span>
                <span
                  role="button"
                  tabIndex={0}
                  className="v2-sidebar-del"
                  onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onDelete(s.id); } }}
                  aria-label="Delete"
                >
                  <Icon name="x" size={11} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </aside>
      {open && <div className="v2-sidebar-scrim" onClick={onClose} />}
    </>
  );
}

function ChatInput({ lang, input, setInput, onSend, typing, inputRef }) {
  return (
    <div className="v2-input-wrap" style={{
      padding: "12px 18px max(18px, env(safe-area-inset-bottom))",
      background: "rgba(255,255,255,.92)",
      backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
      borderTop: "1px solid rgba(240,218,228,.5)",
      flexShrink: 0,
    }}>
      <div className="v2-overlay-foot-inner v2-input-bar" style={{
        display: "flex", alignItems: "flex-end", gap: 8,
        border: "1.5px solid rgba(240,218,228,.9)", borderRadius: 20,
        padding: "5px 6px 5px 6px", background: "#fff",
        boxShadow: "0 2px 10px rgba(225,29,92,.06)",
        transition: "all .22s",
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
          onInput={e => {
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
          }}
          placeholder={tx(T.placeholder, lang)}
          rows={1}
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            padding: "12px 14px", fontSize: 16, color: "#1a0a14",
            resize: "none", lineHeight: 1.6, fontFamily: "inherit",
            minHeight: 44, maxHeight: 140, overflowY: "auto",
            display: "block",
            WebkitTextSizeAdjust: "100%",
          }}
        />
        <button
          onClick={() => onSend()}
          disabled={!input.trim() || typing}
          style={{
            width: 42, height: 42, borderRadius: 14, border: "none",
            background: input.trim() && !typing
              ? `linear-gradient(135deg,${PINK} 0%,#f43f5e 100%)`
              : "#f5e6ed",
            color: input.trim() && !typing ? "#fff" : "#cca8b8",
            cursor: input.trim() && !typing ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: input.trim() && !typing ? "0 6px 18px rgba(225,29,92,.34)" : "none",
            transition: "all .2s cubic-bezier(.2,.8,.2,1)", flexShrink: 0,
            fontSize: 16,
          }}
          onMouseEnter={e => { if (input.trim() && !typing) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 10px 24px rgba(225,29,92,.44)"; } }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = input.trim() && !typing ? "0 6px 18px rgba(225,29,92,.34)" : "none"; }}
          aria-label="Send"
        ><Icon name="send" size={16} /></button>
      </div>
    </div>
  );
}

const SALI_EVENT_LABELS = {
  birthday:    { en: "birthday", hy: "ծննդյան տոն", ru: "день рождения" },
  wedding:     { en: "wedding", hy: "հարսանիք", ru: "свадьбу" },
  baptism:     { en: "baptism", hy: "մկրտություն", ru: "крещение" },
  engagement:  { en: "engagement", hy: "նշանդրեք", ru: "помолвку" },
  anniversary: { en: "anniversary", hy: "ամյակ", ru: "юбилей" },
  corporate:   { en: "corporate event", hy: "կորպորատիվ միջոցառում", ru: "корпоратив" },
  "kids-party": { en: "kids party", hy: "մանկական տոն", ru: "детский праздник" },
  "baby-tooth": { en: "first tooth party", hy: "ատամհատիկ", ru: "праздник первого зубика" },
  christmas:   { en: "New Year celebration", hy: "Ամանոր", ru: "Новый год" },
  romantic:    { en: "romantic setup", hy: "ռոմանտիկ ձևավորում", ru: "романтическое оформление" },
};

export default function AIAssistantV2Client({ lang }) {
  const router = useRouter();
  const pathname = usePathname() || "";
  const onAIPage = /^\/(en|hy|ru)\/?$/.test(pathname);
  // Pages where Sali IS the page itself — only the planner. The home page
  // shows AI in the hero, but users still expect a launcher to come back to.
  const onAIDestination = /\/planner(\/|$|\?)/.test(pathname);
  const HIDE_ON = ["/login", "/signup", "/forgot-password", "/checkout", "/payment"];
  const hideEverything = HIDE_ON.some(p => pathname.includes(p));
  const [phase, setPhase] = useState("landing");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [chatState, setChatState] = useState({});
  const [popup, setPopup] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  // Plan mode state
  const [eventState, setEventState] = useState(INITIAL_EVENT_STATE);
  const [vendorResults, setVendorResults] = useState({});
  const [plannerSessionId, setPlannerSessionId] = useState(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showMobilePlan, setShowMobilePlan] = useState(false);
  const inPlanMode = !!eventState.event_type;
  // Right panel visibility — separate from plan state so closing the panel doesn't wipe the plan
  const [panelOpen, setPanelOpen] = useState(true);
  // FAB UX state
  const [fabDismissed, setFabDismissed] = useState(false);
  const [fabPos, setFabPos] = useState(null);     // { right, bottom } in px, or null = default
  const fabDragRef = useRef({ dragging: false, startX: 0, startY: 0, startRight: 0, startBottom: 0, moved: false });
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const timersRef = useRef([]);

  // Hydrate FAB preferences from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const dismissed = sessionStorage.getItem("salooote_fab_dismissed");
      if (dismissed === "1") setFabDismissed(true);
      const posRaw = localStorage.getItem("salooote_fab_pos");
      if (posRaw) {
        const p = JSON.parse(posRaw);
        if (p && typeof p.right === "number" && typeof p.bottom === "number") setFabPos(p);
      }
    } catch {}
  }, []);

  const handleFabDismiss = useCallback((e) => {
    e?.stopPropagation();
    setFabDismissed(true);
    try { sessionStorage.setItem("salooote_fab_dismissed", "1"); } catch {}
  }, []);

  // Auto-save event plan to backend for logged-in users (debounced 2s)
  const autoSaveTimerRef = useRef(null);
  useEffect(() => {
    if (!inPlanMode || typeof window === "undefined") return;
    const token = localStorage.getItem("access_token");
    if (!token) return;
    clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        const body = {
          title: `${eventState.event_type_label || eventState.event_type} plan`,
          event_type: eventState.event_type,
          location: eventState.city || "",
          guest_count: eventState.guest_count ? parseInt(eventState.guest_count) : undefined,
          event_date: eventState.date || undefined,
          event_data: JSON.stringify({
            services: eventState.services,
            selected_vendors: eventState.selected_vendors,
            style: eventState.style,
            budget: eventState.budget,
          }),
          status: "active",
        };
        if (plannerSessionId) {
          await fetch(`${API}/user/planner/sessions/${plannerSessionId}`, {
            method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(body),
          });
        } else {
          const res = await fetch(`${API}/user/planner/sessions`, {
            method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(body),
          });
          const json = await res.json();
          if (json?.data?.id) setPlannerSessionId(json.data.id);
        }
      } catch {}
    }, 2000);
    return () => clearTimeout(autoSaveTimerRef.current);
  }, [inPlanMode, eventState, plannerSessionId]);

  // Drag handlers — track movement, on mouseup save position. Click only fires
  // if the pointer didn't actually move beyond a small threshold.
  const onFabPointerDown = useCallback((e) => {
    if (typeof window === "undefined") return;
    if (e.button != null && e.button !== 0) return;
    const pt = e.touches?.[0] || e;
    const right = fabPos?.right ?? 22;
    const bottom = fabPos?.bottom ?? 22;
    fabDragRef.current = {
      dragging: true,
      startX: pt.clientX,
      startY: pt.clientY,
      startRight: right,
      startBottom: bottom,
      moved: false,
    };
    const onMove = (ev) => {
      const m = ev.touches?.[0] || ev;
      const dx = m.clientX - fabDragRef.current.startX;
      const dy = m.clientY - fabDragRef.current.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) fabDragRef.current.moved = true;
      // right/bottom decrease as cursor moves right/down (anchor is bottom-right)
      const newRight = Math.max(8, Math.min(window.innerWidth - 60, fabDragRef.current.startRight - dx));
      const newBottom = Math.max(8, Math.min(window.innerHeight - 60, fabDragRef.current.startBottom - dy));
      setFabPos({ right: newRight, bottom: newBottom });
    };
    const onEnd = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      if (fabDragRef.current.moved) {
        try { localStorage.setItem("salooote_fab_pos", JSON.stringify(fabPos)); } catch {}
      }
      // brief delay before clearing dragging so the click handler can read it
      setTimeout(() => { fabDragRef.current.dragging = false; }, 0);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);
  }, [fabPos]);

  const onFabClick = useCallback((e) => {
    if (fabDragRef.current.moved) {
      // suppress click triggered by drag
      e.preventDefault();
      e.stopPropagation();
      fabDragRef.current.moved = false;
      return;
    }
    setPhase("chat");
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  // Hydrate history + last session from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("salooote_v2_history");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setHistory(arr);
        const lastId = localStorage.getItem("salooote_v2_current_id");
        if (lastId) {
          const last = arr.find(s => s.id === lastId);
          if (last && Array.isArray(last.messages) && last.messages.length) {
            setMessages(last.messages);
            setChatState(last.chatState || {});
            setSessionId(lastId);
          }
        }
      }
      const sb = localStorage.getItem("salooote_v2_sidebar_collapsed");
      if (sb === "1") setSidebarCollapsed(true);
    } catch {}

    // Resume a planning session from the account events detail page
    try {
      const resumeRaw = localStorage.getItem("salooote_resume_session");
      if (resumeRaw) {
        localStorage.removeItem("salooote_resume_session");
        const resume = JSON.parse(resumeRaw);
        if (resume.plannerSessionId) {
          const ed = resume.event_data || {};
          setEventState(s => ({
            ...s,
            event_type:       resume.event_type       || s.event_type,
            event_type_label: resume.event_type_label || s.event_type_label,
            services:         Array.isArray(ed.services) ? ed.services : s.services,
            selected_vendors: (ed.selected_vendors && typeof ed.selected_vendors === "object") ? ed.selected_vendors : s.selected_vendors,
            style:       ed.style       || s.style,
            budget:      ed.budget      || s.budget,
            city:        resume.location || s.city,
            guest_count: resume.guest_count ? String(resume.guest_count) : s.guest_count,
            date:        resume.event_date || s.date,
          }));
          setPlannerSessionId(resume.plannerSessionId);
          setPhase("chat");
        }
      }
    } catch {}

    setHydrated(true);
  }, []);

  // Auto-open chat if URL has ?continue=1 (from global launcher) or custom event
  useEffect(() => {
    if (!hydrated) return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("continue") === "1" && messages.length > 0) {
      setPhase("chat");
      // Clean URL
      const url = window.location.pathname + window.location.hash;
      window.history.replaceState({}, "", url);
    }
    const onOpen = () => setPhase("chat");
    window.addEventListener("salooote:openChat", onOpen);
    return () => window.removeEventListener("salooote:openChat", onOpen);
  }, [hydrated, messages.length]);

  const toggleSidebarCollapsed = useCallback(() => {
    setSidebarCollapsed(c => {
      const next = !c;
      try { localStorage.setItem("salooote_v2_sidebar_collapsed", next ? "1" : "0"); } catch {}
      return next;
    });
  }, []);

  // Lock body scroll while chat overlay is open (iOS-safe: fixes keyboard viewport bleed)
  useEffect(() => {
    if (phase === "chat") {
      const scrollY = window.scrollY;
      const prevOverflow = document.body.style.overflow;
      const prevPosition = document.body.style.position;
      const prevTop = document.body.style.top;
      const prevWidth = document.body.style.width;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.position = prevPosition;
        document.body.style.top = prevTop;
        document.body.style.width = prevWidth;
        window.scrollTo(0, scrollY);
      };
    }
  }, [phase]);

  // Auto-save current chat (debounced)
  useEffect(() => {
    if (!hydrated || !messages.length) return;
    const t = setTimeout(() => {
      try {
        let id = sessionId;
        if (!id) {
          id = `c${Date.now()}`;
          setSessionId(id);
        }
        const firstUser = messages.find(m => m.role === "user");
        const title = (firstUser?.text || "New chat").slice(0, 60);
        const raw = localStorage.getItem("salooote_v2_history");
        const arr = raw ? (JSON.parse(raw) || []) : [];
        const slim = messages.map(m => ({
          id: m.id, role: m.role, type: m.type, text: m.text,
          event_type: m.event_type, block: m.block,
        }));
        const entry = { id, title, messages: slim, chatState, updatedAt: Date.now() };
        const idx = arr.findIndex(s => s.id === id);
        if (idx >= 0) arr[idx] = entry; else arr.unshift(entry);
        const trimmed = arr.slice(0, 50);
        localStorage.setItem("salooote_v2_history", JSON.stringify(trimmed));
        localStorage.setItem("salooote_v2_current_id", id);
        setHistory(trimmed);
      } catch {}
    }, 700);
    return () => clearTimeout(t);
  }, [messages, chatState, sessionId, hydrated]);

  const handleNewChat = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setMessages([]);
    setChatState({});
    setSessionId(null);
    setTyping(false);
    setInput("");
    setEventState(INITIAL_EVENT_STATE);
    setVendorResults({});
    setPlannerSessionId(null);
    setShowMobilePlan(false);
    setPanelOpen(true);
    try { localStorage.removeItem("salooote_v2_current_id"); } catch {}
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handlePickHistory = useCallback((id) => {
    const item = history.find(s => s.id === id);
    if (!item) return;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setMessages(item.messages || []);
    setChatState(item.chatState || {});
    setSessionId(id);
    setTyping(false);
    setPhase("chat");
    setSidebarOpen(false);
    try { localStorage.setItem("salooote_v2_current_id", id); } catch {}
  }, [history]);

  const handleDeleteHistory = useCallback((id) => {
    setHistory(prev => {
      const next = prev.filter(s => s.id !== id);
      try { localStorage.setItem("salooote_v2_history", JSON.stringify(next)); } catch {}
      return next;
    });
    if (id === sessionId) {
      setMessages([]);
      setChatState({});
      setSessionId(null);
      try { localStorage.removeItem("salooote_v2_current_id"); } catch {}
    }
  }, [sessionId]);

  // ── Plan mode handlers ────────────────────────────────────────────
  const handleAddService = useCallback((title) => {
    const service_type = title.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    setEventState(prev => {
      if (prev.services.find(s => s.service_type === service_type)) return prev;
      return { ...prev, services: [...prev.services, { service_type, title, category: "other", required: false, canSearch: true, status: "pending" }] };
    });
  }, []);

  const handleRemoveService = useCallback((service_type) => {
    setEventState(prev => {
      const sv = { ...prev.selected_vendors }; delete sv[service_type];
      return { ...prev, services: prev.services.filter(s => s.service_type !== service_type), selected_vendors: sv };
    });
    setVendorResults(prev => { const n = { ...prev }; delete n[service_type]; return n; });
  }, []);

  const handleSelectVendor = useCallback((serviceType, vendor) => {
    setEventState(prev => ({
      ...prev,
      selected_vendors: {
        ...prev.selected_vendors,
        [serviceType]: {
          id:          vendor.id,
          name:        vendor.business_name || vendor.name,
          slug:        vendor.slug || null,
          logo:        vendor.cover_image || vendor.logo || vendor.thumbnail || null,
          thumbnail:   vendor.cover_image || vendor.logo || vendor.thumbnail || null,
          is_product:  vendor._isProduct || false,
          vendor_slug: vendor.slug || null,
        },
      },
      services: prev.services.map(s => s.service_type === serviceType ? { ...s, status: "selected", searching: false } : s),
    }));
  }, []);

  const handleUnselectVendor = useCallback((serviceType) => {
    setEventState(prev => {
      const sv = { ...prev.selected_vendors }; delete sv[serviceType];
      return { ...prev, selected_vendors: sv, services: prev.services.map(s => s.service_type === serviceType ? { ...s, status: "pending" } : s) };
    });
  }, []);

  // Called when user clicks "Add to Plan" on an inline chat product card.
  // serviceType comes from block.service_type returned by the backend.
  const addToPlanFromChat = useCallback((product, serviceType) => {
    if (!serviceType) return;
    const name = product.name || "Product";
    const vendorName = product.vendor_name || product.vendor?.business_name || "";
    setEventState(prev => {
      // If the service exists in the plan, mark it selected; otherwise do nothing.
      const exists = (prev.services || []).some(s => s.service_type === serviceType);
      if (!exists) return prev;
      return {
        ...prev,
        selected_vendors: {
          ...prev.selected_vendors,
          [serviceType]: {
            id:          product.id,
            name,
            vendor_name: vendorName,
            thumbnail:   product.thumbnail_url || product.image || null,
            logo:        product.thumbnail_url || product.image || null,
            price:       product.price,
            is_product:  true,
            vendor_slug: product.vendor_slug || product.vendor?.slug || null,
          },
        },
        services: prev.services.map(s =>
          s.service_type === serviceType ? { ...s, status: "selected", searching: false } : s
        ),
      };
    });
  }, []);

  const handleSearchVendors = useCallback(async (serviceType, title) => {
    setEventState(prev => ({
      ...prev,
      services: prev.services.map(s => s.service_type === serviceType ? { ...s, searching: true } : s),
    }));
    try {
      const useProductsApi = PRODUCT_SERVICE_TYPES.has(serviceType);
      let results = [];

      if (useProductsApi) {
        const params = new URLSearchParams({ limit: "100", locale: lang });
        const searchTerm = PRODUCT_SEARCH_TERMS[serviceType] || title;
        if (searchTerm) params.set("search", searchTerm);
        const res = await fetch(`${API}/products?${params}`);
        const json = await res.json();
        // Normalize products into vendor-card-compatible shape
        results = (json.data || []).map(p => ({
          id: p.id,
          business_name: p.name,
          name: p.name,
          slug: p.vendor_slug || p.slug,
          cover_image: p.images?.[0]?.url || p.thumbnail_url || p.image || null,
          rating: p.rating || null,
          price: p.price,
          _isProduct: true,
          vendor_id: p.vendor_id,
        }));
      } else {
        const params = new URLSearchParams({ limit: "100", locale: lang });
        if (title) params.set("search", title);
        if (eventState.city) params.set("city", eventState.city);
        const res = await fetch(`${API}/vendors?${params}`);
        const json = await res.json();
        results = json.data || [];
      }

      setVendorResults(prev => ({ ...prev, [serviceType]: results }));
    } catch {}
    setEventState(prev => ({
      ...prev,
      services: prev.services.map(s => s.service_type === serviceType ? { ...s, searching: false } : s),
    }));
  }, [lang, eventState.city]);

  const revealItems = useCallback((items) => {
    if (!items.length) return;
    const DELAY = 750;
    setMessages(prev => [...prev, items[0]]);
    items.slice(1).forEach((item, i) => {
      const t1 = setTimeout(() => setTyping(true), i * DELAY + 60);
      const t2 = setTimeout(() => {
        setTyping(false);
        setMessages(prev => [...prev, item]);
      }, (i + 1) * DELAY + 60);
      timersRef.current.push(t1, t2);
    });
  }, []);

  const send = useCallback(async (override) => {
    const text = (typeof override === "string" ? override : input).trim();
    if (!text || typing) return;

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setTyping(false);

    const isFirstMessage = messages.length === 0;
    if (phase === "landing") setPhase("chat");

    const welcomeEntry = isFirstMessage
      ? [{ id: "w", role: "bot", type: "text", text: tx(T.welcome, lang) }]
      : [];

    const userEntry = { id: Date.now(), role: "user", type: "text", text };

    setMessages(prev => [...prev, ...welcomeEntry, userEntry]);
    setInput("");
    setTyping(true);

    const allMsgs = [...messages, ...welcomeEntry, userEntry];
    const history = allMsgs
      .filter(m => (m.role === "user" || (m.role === "bot" && m.type === "text")) && m.id !== "w")
      .slice(-10)
      .map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));

    try {
      const inPlan = !!eventState.event_type;
      let d = {};

      if (inPlan) {
        // Dedicated plan-chat endpoint: returns message + actions + blocks
        const res = await fetch(`${API}/smart-assistant/plan-chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            lang,
            messages: history,
            event_state: {
              event_type: eventState.event_type,
              event_type_label: eventState.event_type_label,
              city: eventState.city,
              date: eventState.date,
              guest_count: eventState.guest_count,
              budget: eventState.budget,
              style: eventState.style,
              services: (eventState.services || []).map(s => ({
                service_type: s.service_type,
                title: s.title,
                category: s.category,
                required: s.required,
                can_search: s.canSearch,
                status: s.status,
              })),
              selected_vendors: eventState.selected_vendors || {},
            },
          }),
        });
        const json = await res.json();
        d = json?.data || {};
        // Apply plan actions returned from backend
        if (d.actions?.length) {
          const { state: nextState, searches } = applyActions(d.actions, eventState);
          setEventState(nextState);
          for (const s of searches) {
            handleSearchVendors(s.service_type, s.query || s.service_type.replace(/_/g, " "));
          }
        }
      } else {
        const res = await fetch(`${API}/smart-assistant/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, state: chatState, lang }),
        });
        const json = await res.json();
        d = json?.data || {};
        if (d.state) setChatState(d.state);
      }

      setTyping(false);

      const base = Date.now() + 1;
      const seq = [];

      if (!inPlan && d.action === "plan_event" && d.event_type) {
        // Auto-activate plan panel — no button needed
        const tpl = EVENT_TEMPLATES[d.event_type];
        if (tpl) {
          setEventState({
            ...INITIAL_EVENT_STATE,
            event_type: d.event_type,
            event_type_label: tpl.label,
            accent: tpl.accent,
            gradient: tpl.gradient,
            services: tpl.services.map(s => ({ ...s, status: "pending" })),
          });
          setPanelOpen(true);
        }
        if (d.message) seq.push({ id: base, role: "bot", type: "text", text: fixArmenianText(d.message) });
      } else {
        (d.blocks || []).forEach((block, i) => {
          if (block.data?.length) {
            seq.push({ id: base + i, role: "bot", type: "block", block });
          }
        });
        if (d.message) {
          seq.push({ id: base + 100, role: "bot", type: "text", text: fixArmenianText(d.message) });
        }
      }

      if (seq.length) revealItems(seq);

    } catch {
      setTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(), role: "bot", type: "text",
        text: "Something went wrong. Please try again!",
      }]);
    }
  }, [input, typing, phase, messages, chatState, lang, revealItems, eventState, plannerSessionId, handleSearchVendors]);

  // Handles quick chip clicks as structured UI actions — never treated as raw typed text.
  // Sends action metadata to backend so it can route correctly (chip vs. free text).
  const sendQuickAction = useCallback(async (chip) => {
    if (typing) return;

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setTyping(false);

    const isFirstEver = messages.length === 0;
    if (phase === "landing") setPhase("chat");

    const welcomeEntry = isFirstEver
      ? [{ id: "w", role: "bot", type: "text", text: tx(T.welcome, lang) }]
      : [];

    const userEntry = { id: Date.now(), role: "user", type: "text", text: chip.name };
    setMessages(prev => [...prev, ...welcomeEntry, userEntry]);
    setInput("");
    setTyping(true);

    const allMsgs = [...messages, ...welcomeEntry, userEntry];
    const hist = allMsgs
      .filter(m => (m.role === "user" || (m.role === "bot" && m.type === "text")) && m.id !== "w")
      .slice(-10)
      .map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));

    // Structured action — backend can distinguish chip click from free text
    const action = {
      type: "quick_service_select",
      service_type: chip.service_type || chip.name.toLowerCase(),
      source: "ui_button",
    };

    try {
      const inPlan = !!eventState.event_type;
      let d = {};

      if (inPlan) {
        const res = await fetch(`${API}/smart-assistant/plan-chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: chip.name,
            lang,
            action,
            messages: hist,
            event_state: {
              event_type: eventState.event_type,
              event_type_label: eventState.event_type_label,
              city: eventState.city,
              date: eventState.date,
              guest_count: eventState.guest_count,
              budget: eventState.budget,
              style: eventState.style,
              services: (eventState.services || []).map(s => ({
                service_type: s.service_type,
                title: s.title,
                category: s.category,
                required: s.required,
                can_search: s.canSearch,
                status: s.status,
              })),
              selected_vendors: eventState.selected_vendors || {},
            },
          }),
        });
        const json = await res.json();
        d = json?.data || {};
        if (d.actions?.length) {
          const { state: nextState, searches } = applyActions(d.actions, eventState);
          setEventState(nextState);
          for (const s of searches) {
            handleSearchVendors(s.service_type, s.query || s.service_type.replace(/_/g, " "));
          }
        }
      } else {
        const res = await fetch(`${API}/smart-assistant/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: hist, state: chatState, lang, action }),
        });
        const json = await res.json();
        d = json?.data || {};
        if (d.state) setChatState(d.state);
      }

      setTyping(false);

      const base = Date.now() + 1;
      const seq = [];

      if (!inPlan && d.action === "plan_event" && d.event_type) {
        const tpl = EVENT_TEMPLATES[d.event_type];
        if (tpl) {
          setEventState({
            ...INITIAL_EVENT_STATE,
            event_type: d.event_type,
            event_type_label: tpl.label,
            accent: tpl.accent,
            gradient: tpl.gradient,
            services: tpl.services.map(s => ({ ...s, status: "pending" })),
          });
          setPanelOpen(true);
        }
        if (d.message) seq.push({ id: base, role: "bot", type: "text", text: fixArmenianText(d.message) });
      } else {
        (d.blocks || []).forEach((block, i) => {
          if (block.data?.length) seq.push({ id: base + i, role: "bot", type: "block", block });
        });
        if (d.message) seq.push({ id: base + 100, role: "bot", type: "text", text: fixArmenianText(d.message) });
      }

      if (seq.length) revealItems(seq);

    } catch {
      setTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(), role: "bot", type: "text",
        text: lang === "hy" ? "Ինչ-որ բան սխալ գնաց։ Կրկին փորձեք։"
            : lang === "ru" ? "Что-то пошло не так. Попробуйте снова."
            : "Something went wrong. Please try again!",
      }]);
    }
  }, [typing, phase, messages, chatState, lang, revealItems, eventState, handleSearchVendors]);

  const saliTriggerFiredRef = useRef(false);
  useEffect(() => {
    if (saliTriggerFiredRef.current || !hydrated) return;
    const saliType = new URLSearchParams(window.location.search).get("sali");
    if (!saliType) return;
    saliTriggerFiredRef.current = true;
    const labels = SALI_EVENT_LABELS[saliType];
    if (!labels) return;
    const label = labels[lang] || labels.en;
    const msg = lang === "hy"
      ? `Ուզում եմ կազմակերպել ${label}!`
      : lang === "ru"
      ? `Хочу организовать ${label}!`
      : `I want to plan a ${label}!`;
    setTimeout(() => send(msg), 300);
  }, [hydrated, send, lang]);

  const handlePlanEvent = useCallback((eventType) => {
    const tpl = EVENT_TEMPLATES[eventType];
    if (!tpl) return;
    setEventState({
      ...INITIAL_EVENT_STATE,
      event_type: eventType,
      event_type_label: tpl.label,
      accent: tpl.accent,
      gradient: tpl.gradient,
      services: tpl.services.map(s => ({ ...s, status: "pending" })),
    });
    setPanelOpen(true);
  }, []);

  const openPopup = useCallback((item, type) => setPopup({ item, type }), []);

  if (hideEverything) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        @font-face{
          font-family:'SHK Dzeragir';
          src:url('/fonts/SHK_Dzeragir.otf') format('opentype');
          font-weight:400 900;font-style:normal;font-display:swap;
          unicode-range:U+0530-058F,U+FB13-FB17;
        }
        :lang(hy) .v2-headline,
        :lang(hy) .v2-browse-headline,
        :lang(hy) .v2-how-title,
        :lang(hy) .v2-occ-headline,
        :lang(hy) .v2-hero2-headline,
        :lang(hy) .v2-moments-headline,
        :lang(hy) .v2-moment-title{
          font-family:'SHK Dzeragir','Fraunces',Georgia,serif!important;
          letter-spacing:-.4px;
          font-style:normal!important;
          line-height:1.15;
        }
        :lang(hy) .v2-hero2-rotate{
          font-style:normal!important;
        }
        :lang(hy) .v2-h-line2{
          background:linear-gradient(135deg,${PINK} 0%,#9f1239 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        @keyframes v2dot{0%,80%,100%{transform:translateY(0);opacity:.3}40%{transform:translateY(-6px);opacity:1}}
        @keyframes v2wave{0%,100%{height:4px;opacity:.45}50%{height:18px;opacity:1}}
        @keyframes orbPulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.18);opacity:.25}}
        @keyframes orbFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes v2fade{from{opacity:0}to{opacity:1}}
        @keyframes v2pop{from{opacity:0;transform:scale(.94) translateY(12px)}to{opacity:1;transform:none}}
        @keyframes v2In{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes halo{0%,100%{transform:scale(1);opacity:.42}50%{transform:scale(1.5);opacity:.12}}
        @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
        .v2-scroll::-webkit-scrollbar{width:4px}
        .v2-scroll::-webkit-scrollbar-thumb{background:rgba(225,29,92,.12);border-radius:4px}
        .v2-cards::-webkit-scrollbar{height:3px}
        .v2-cards::-webkit-scrollbar-thumb{background:rgba(225,29,92,.15);border-radius:3px}
        .v2-cards>*{scroll-snap-align:start}
        .v2-input-wrap:focus-within{border-color:rgba(225,29,92,.5)!important;box-shadow:0 16px 48px rgba(225,29,92,.16),0 0 0 5px rgba(225,29,92,.07)!important}
        .v2-input-bar:focus-within{border-color:rgba(225,29,92,.5)!important;box-shadow:0 0 0 4px rgba(225,29,92,.07),0 4px 16px rgba(225,29,92,.1)!important}
        .v2-chip:hover{background:#fff!important;border-color:rgba(225,29,92,.4)!important;color:${PINK}!important;transform:translateY(-2px);box-shadow:0 6px 18px rgba(225,29,92,.16)!important}
        .v2-msg{animation:v2In .3s cubic-bezier(.2,.8,.2,1)}

        /* ── Layla-style landing ── */
        .v2-landing{flex:1;overflow-y:auto;overflow-x:hidden;background:#fff;-webkit-overflow-scrolling:touch}
        .v2-landing::-webkit-scrollbar{width:6px}
        .v2-landing::-webkit-scrollbar-thumb{background:#f0e0e6;border-radius:6px}

        .v2-landing-grid{
          min-height:calc(100vh - 65px);
          display:grid;grid-template-columns:1.1fr 1fr;gap:48px;
          align-items:center;padding:24px 64px;
          max-width:1280px;margin:0 auto;width:100%;
        }
        .v2-left{display:flex;flex-direction:column;gap:18px;animation:v2In .55s cubic-bezier(.2,.8,.2,1)}

        .v2-headline{
          margin:0;font-family:'Fraunces',Georgia,serif;
          font-size:clamp(40px,5vw,68px);font-weight:700;
          line-height:1.02;letter-spacing:-1.6px;color:#1a0a14;
        }
        .v2-h-line1{font-style:normal;font-variation-settings:"opsz" 144}
        .v2-h-line2{
          font-style:italic;font-variation-settings:"opsz" 144;
          background:linear-gradient(135deg,${PINK} 0%,#9f1239 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }

        .v2-sub{
          margin:6px 0 8px;max-width:520px;
          font-size:16px;line-height:1.6;color:#6b4654;letter-spacing:.05px;
        }

        .v2-chat-card{
          background:#fff;border:1.5px solid #ece2e7;border-radius:22px;
          padding:14px 14px 10px;max-width:560px;
          box-shadow:0 16px 44px rgba(225,29,92,.08),0 2px 6px rgba(0,0,0,.03);
          transition:all .22s cubic-bezier(.2,.8,.2,1);
        }
        .v2-chat-card:focus-within{
          border-color:rgba(225,29,92,.4);
          box-shadow:0 18px 52px rgba(225,29,92,.18),0 0 0 5px rgba(225,29,92,.06);
        }
        .v2-chat-textarea{
          width:100%;border:none;outline:none;background:transparent;
          font-family:inherit;font-size:16px;line-height:1.7;color:#1a0a14;
          padding:10px 8px;resize:none;min-height:64px;max-height:160px;letter-spacing:.05px;
          display:block;
        }
        .v2-chat-actions{display:flex;align-items:center;gap:8px;padding:6px 4px 0}
        .v2-icon-btn{
          width:36px;height:36px;border:none;border-radius:50%;background:transparent;
          color:#9b8390;cursor:pointer;display:flex;align-items:center;justify-content:center;
          transition:all .15s;
        }
        .v2-icon-btn:hover{background:#fdf2f5;color:${PINK}}
        .v2-send-btn{
          width:42px;height:42px;border:none;border-radius:50%;
          background:#1a0a14;color:#fff;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 6px 16px rgba(26,10,20,.25);
          transition:all .18s cubic-bezier(.2,.8,.2,1);
        }
        .v2-send-btn:hover:not(:disabled){background:${PINK};transform:translateY(-1px) scale(1.04);box-shadow:0 8px 22px rgba(225,29,92,.4)}
        .v2-send-btn:disabled{background:#e5d8df;color:#fff;cursor:default;box-shadow:none}

        .v2-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
        .v2-pill{
          display:inline-flex;align-items:center;
          padding:9px 16px;border-radius:24px;
          background:#fdf2f5;border:1px solid transparent;
          color:#5a1a2f;font-size:13px;font-weight:500;letter-spacing:.05px;
          cursor:pointer;transition:all .18s cubic-bezier(.2,.8,.2,1);
          font-family:inherit;
        }
        .v2-pill:hover{background:#fff;border-color:${PINK};color:${PINK};transform:translateY(-1px);box-shadow:0 6px 16px rgba(225,29,92,.16)}

        .v2-scroll-cue{
          margin-top:18px;padding:6px 0;border:none;background:transparent;
          color:#a08596;font-size:13px;font-weight:500;cursor:pointer;
          align-self:flex-start;font-family:inherit;letter-spacing:.05px;
          transition:color .15s;
        }
        .v2-scroll-cue:hover{color:${PINK}}

        .v2-right{display:flex;align-items:center;justify-content:center}

        /* ── Centered Vibrant Hero (new) ─────────────────────── */
        .v2-hero2{
          position:relative;
          padding:64px 28px 0;
          max-width:1280px;margin:0 auto;width:100%;
          overflow:hidden;
        }
        .v2-hero2-aurora{position:absolute;inset:-40px 0 0;z-index:0;pointer-events:none}
        .v2-hero2-glow{position:absolute;border-radius:50%;filter:blur(80px);opacity:.55}
        .v2-hero2-glow-rose{
          top:-60px;left:50%;transform:translateX(-50%);
          width:1100px;height:520px;
          background:radial-gradient(circle, rgba(254,205,211,.95), transparent 70%);
        }
        .v2-hero2-glow-amber{
          top:80px;left:14%;width:380px;height:380px;
          background:radial-gradient(circle, rgba(254,243,199,.7), transparent 70%);
        }
        .v2-hero2-glow-fuchsia{
          top:40px;right:10%;width:340px;height:340px;
          background:radial-gradient(circle, rgba(245,208,254,.6), transparent 70%);
        }

        .v2-hero2-inner{
          position:relative;z-index:1;text-align:center;
          padding:30px 0 50px;
          animation:v2In .55s cubic-bezier(.2,.8,.2,1);
        }
        .v2-hero2-chip{
          display:inline-flex;align-items:center;gap:10px;
          background:rgba(255,255,255,.78);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
          border:1px solid rgba(254,205,211,.85);
          color:#5a1a2f;
          padding:7px 14px;border-radius:999px;
          font-size:12.5px;font-weight:600;letter-spacing:.05px;
          box-shadow:0 4px 14px rgba(225,29,92,.08);
          margin-bottom:26px;
        }
        .v2-hero2-chip-dot{position:relative;display:inline-flex;width:8px;height:8px}
        .v2-hero2-chip-ping{
          position:absolute;inset:0;border-radius:50%;background:#fb7185;opacity:.75;
          animation:v2-ping 1.6s cubic-bezier(0,0,.2,1) infinite;
        }
        .v2-hero2-chip-core{
          position:relative;display:inline-flex;width:8px;height:8px;border-radius:50%;background:${PINK};
        }
        @keyframes v2-ping{
          75%,100%{transform:scale(2);opacity:0}
        }

        .v2-hero2-headline{
          margin:0 auto;max-width:980px;
          font-family:'Fraunces',Georgia,serif;font-weight:600;
          font-size:clamp(40px,7vw,84px);line-height:1.02;letter-spacing:-2px;
          color:#1a0a14;font-variation-settings:"opsz" 144;
        }
        .v2-hero2-static{display:inline}
        .v2-hero2-rotate-wrap{
          display:inline-block;position:relative;min-width:0;
        }
        .v2-hero2-rotate{
          display:inline-block;
          background:linear-gradient(135deg,${PINK} 0%,${PINK_DARK} 70%,#831843 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          font-style:italic;
          animation:v2-rotateIn .45s cubic-bezier(.2,.8,.2,1);
        }
        @keyframes v2-rotateIn{
          from{transform:translateY(18px);opacity:0}
          to{transform:translateY(0);opacity:1}
        }

        .v2-hero2-sub{
          margin:24px auto 0;max-width:640px;
          font-size:clamp(15px,1.4vw,19px);line-height:1.55;
          color:#6b4654;letter-spacing:.05px;
        }

        .v2-hero2-search{
          margin:36px auto 0;max-width:640px;
          display:flex;align-items:center;gap:8px;
          background:#fff;border:1.5px solid #ece2e7;border-radius:999px;
          padding:6px 6px 6px 22px;
          box-shadow:0 24px 60px -20px rgba(225,29,92,.25),0 2px 6px rgba(0,0,0,.04);
          transition:all .22s cubic-bezier(.2,.8,.2,1);
        }
        .v2-hero2-search:focus-within{
          border-color:rgba(225,29,92,.45);
          box-shadow:0 28px 70px -18px rgba(225,29,92,.35),0 0 0 5px rgba(225,29,92,.06);
        }
        .v2-hero2-search-icon{display:inline-flex;color:#9b8390;flex-shrink:0}
        .v2-hero2-search-input{
          flex:1;border:none;outline:none;background:transparent;
          font-family:inherit;font-size:16px;color:#1a0a14;letter-spacing:.05px;
          padding:13px 4px;
        }
        .v2-hero2-search-input::placeholder{color:#a08596}
        .v2-hero2-search-btn{
          flex-shrink:0;display:inline-flex;align-items:center;gap:7px;
          padding:11px 22px;border:none;border-radius:999px;cursor:pointer;
          background:linear-gradient(135deg,${PINK},${PINK_DARK});
          color:#fff;font-family:inherit;font-size:14px;font-weight:600;letter-spacing:.05px;
          box-shadow:0 8px 22px rgba(225,29,92,.35);
          transition:all .18s cubic-bezier(.2,.8,.2,1);
        }
        .v2-hero2-search-btn:hover:not(:disabled){transform:translateY(-1px) scale(1.02);box-shadow:0 12px 28px rgba(225,29,92,.45)}
        .v2-hero2-search-btn:disabled{opacity:.55;cursor:default;box-shadow:none}

        .v2-hero2-chips{
          margin:22px auto 0;
          display:flex;flex-wrap:wrap;justify-content:center;gap:8px;
          max-width:760px;
        }
        .v2-hero2-chip-btn{
          display:inline-flex;align-items:center;gap:7px;
          padding:9px 16px;border-radius:999px;cursor:pointer;
          background:rgba(255,255,255,.7);
          border:1px solid #efe3e9;
          color:#5a1a2f;font-family:inherit;font-size:13px;font-weight:500;
          backdrop-filter:blur(6px);
          transition:all .18s cubic-bezier(.2,.8,.2,1);
        }
        .v2-hero2-chip-btn:hover{
          background:#fff;border-color:#fecdd3;color:${PINK};
          transform:translateY(-1px);
          box-shadow:0 6px 16px rgba(225,29,92,.16);
        }

        .v2-hero2-trust{
          margin:36px auto 0;
          display:flex;flex-wrap:wrap;justify-content:center;align-items:center;
          column-gap:28px;row-gap:10px;
          color:#7c5566;font-size:13.5px;
        }
        .v2-hero2-trust-item{display:inline-flex;align-items:center;gap:7px}
        .v2-hero2-trust-sep{
          width:4px;height:4px;border-radius:50%;background:#e5d8df;
          display:inline-block;
        }

        /* ── Marquee strip ─────────────────────────── */
        .v2-hero2-marquee{
          margin-top:34px;
          padding:14px 0;
          border-top:1px solid #f0e0e6;border-bottom:1px solid #f0e0e6;
          background:rgba(255,255,255,.55);backdrop-filter:blur(4px);
          overflow:hidden;
          position:relative;z-index:1;
        }
        .v2-hero2-marquee::before,
        .v2-hero2-marquee::after{
          content:"";position:absolute;top:0;bottom:0;width:80px;z-index:2;pointer-events:none;
        }
        .v2-hero2-marquee::before{left:0;background:linear-gradient(to right,#fff,transparent)}
        .v2-hero2-marquee::after{right:0;background:linear-gradient(to left,#fff,transparent)}
        .v2-hero2-marquee-track{
          display:flex;gap:48px;white-space:nowrap;
          animation:v2-marquee 32s linear infinite;
          width:max-content;
        }
        .v2-hero2-marquee-item{
          display:inline-flex;align-items:center;gap:10px;
          font-family:'Fraunces',Georgia,serif;font-size:16px;font-weight:500;
          color:#a08596;letter-spacing:.05px;
        }
        @keyframes v2-marquee{
          from{transform:translateX(0)}
          to{transform:translateX(-50%)}
        }

        /* ── Browse Moments grid ─────────────────────── */
        .v2-moments{max-width:1280px;margin:0 auto;padding:64px 32px 16px}
        .v2-moments-head{
          display:flex;align-items:flex-end;justify-content:space-between;
          gap:16px;margin-bottom:36px;
        }
        .v2-moments-headline{margin:6px 0 0;text-align:left}
        .v2-moments-actions{
          display:inline-flex;align-items:center;gap:10px;flex-wrap:wrap;
        }
        .v2-moments-plan-cta{
          display:inline-flex;align-items:center;gap:7px;
          padding:10px 18px;border-radius:999px;
          background:linear-gradient(135deg,${PINK} 0%,#f43f5e 100%);
          color:#fff;border:none;cursor:pointer;
          font-family:inherit;font-size:13.5px;font-weight:700;letter-spacing:.1px;
          box-shadow:0 8px 22px rgba(225,29,92,.32);
          transition:transform .18s cubic-bezier(.2,.8,.2,1),box-shadow .18s;
        }
        .v2-moments-plan-cta:hover{
          transform:translateY(-2px);
          box-shadow:0 14px 32px rgba(225,29,92,.44);
        }
        .v2-moments-plan-cta:active{transform:translateY(0)}
        .v2-moments-all{
          display:inline-flex;align-items:center;gap:6px;
          font-size:14px;font-weight:600;color:#1a0a14;
          text-decoration:none;
          transition:color .15s;
        }
        .v2-moments-all:hover{color:${PINK}}
        .v2-moments-grid{
          display:grid;grid-template-columns:repeat(3,1fr);
          grid-auto-rows:1fr;
          gap:18px;
        }
        .v2-moment-card{
          position:relative;display:block;overflow:hidden;
          aspect-ratio:4/5;
          border-radius:28px;background:#f5e6ec;
          text-decoration:none;
          transition:transform .35s cubic-bezier(.2,.8,.2,1);
          box-shadow:0 8px 24px rgba(20,5,12,.06);
        }
        .v2-moment-feature{
          grid-column:span 2;grid-row:span 2;
          aspect-ratio:auto;
        }
        .v2-moment-card:hover{transform:translateY(-4px)}
        .v2-moment-img{object-fit:cover;transition:transform .8s cubic-bezier(.2,.8,.2,1)}
        .v2-moment-card:hover .v2-moment-img{transform:scale(1.08)}
        .v2-moment-overlay{
          position:absolute;inset:0;
          background:linear-gradient(to top, rgba(20,5,12,.65), rgba(20,5,12,.18) 50%, transparent);
          mix-blend-mode:multiply;
        }
        .v2-moment-grad-rose-brand .v2-moment-overlay{background:linear-gradient(to top, rgba(225,29,92,.78), rgba(159,18,57,.18) 55%, transparent)}
        .v2-moment-grad-amber-rose .v2-moment-overlay{background:linear-gradient(to top, rgba(245,158,11,.72), rgba(225,29,92,.22) 55%, transparent)}
        .v2-moment-grad-sky-violet .v2-moment-overlay{background:linear-gradient(to top, rgba(14,165,233,.72), rgba(124,58,237,.25) 55%, transparent)}
        .v2-moment-grad-slate      .v2-moment-overlay{background:linear-gradient(to top, rgba(15,23,42,.85), rgba(30,41,59,.45) 55%, transparent)}
        .v2-moment-grad-fuchsia-rose .v2-moment-overlay{background:linear-gradient(to top, rgba(192,38,211,.7), rgba(225,29,92,.25) 55%, transparent)}
        .v2-moment-grad-emerald-cyan .v2-moment-overlay{background:linear-gradient(to top, rgba(16,185,129,.72), rgba(6,182,212,.25) 55%, transparent)}

        .v2-moment-body{
          position:absolute;left:0;right:0;bottom:0;
          padding:22px 22px 24px;color:#fff;
          z-index:2;
        }
        .v2-moment-pill{
          display:inline-flex;align-items:center;gap:6px;
          background:rgba(255,255,255,.22);backdrop-filter:blur(6px);
          border:1px solid rgba(255,255,255,.32);
          padding:5px 11px;border-radius:999px;
          font-size:11.5px;font-weight:600;letter-spacing:.04px;
          margin-bottom:12px;
        }
        .v2-moment-title{
          margin:0;
          font-family:'Fraunces',Georgia,serif;font-weight:600;
          letter-spacing:-1px;line-height:1.05;
          font-size:clamp(20px,2.4vw,30px);
          font-variation-settings:"opsz" 144;
        }
        .v2-moment-feature .v2-moment-title{font-size:clamp(32px,4.5vw,52px)}
        .v2-moment-cta{
          display:inline-flex;align-items:center;gap:6px;
          margin-top:10px;font-size:13.5px;font-weight:600;color:rgba(255,255,255,.92);
          transition:transform .22s;
        }
        .v2-moment-card:hover .v2-moment-cta{transform:translateX(3px)}

        /* ── Floating event card stack (replaces orb) ── */
        .v2-stack-stage{
          position:relative;width:100%;max-width:460px;aspect-ratio:1/1;
          perspective:1200px;
        }
        .v2-stack-halo{
          position:absolute;inset:-8%;border-radius:50%;
          background:
            radial-gradient(circle at 28% 30%, rgba(255,210,222,.85) 0%, transparent 50%),
            radial-gradient(circle at 72% 70%, rgba(255,228,236,.55) 0%, transparent 55%),
            radial-gradient(circle at 50% 50%, rgba(245,200,225,.4) 0%, transparent 65%);
          filter:blur(40px);animation:v2-halo-spin 18s linear infinite;
          pointer-events:none;z-index:0;
        }
        .v2-stack-card{
          position:absolute;border-radius:24px;background:#fff;
          box-shadow:
            0 32px 64px rgba(225,29,92,.18),
            0 8px 20px rgba(20,5,12,.08),
            inset 0 0 0 1px rgba(255,255,255,.6);
          overflow:hidden;
          transition:transform .4s cubic-bezier(.2,.8,.2,1);
        }
        .v2-stack-card-1{
          width:60%;aspect-ratio:4/5;
          left:18%;top:14%;
          transform:rotate(-4deg);
          z-index:3;animation:v2-card-float-a 7s ease-in-out infinite;
        }
        .v2-stack-card-2{
          width:48%;aspect-ratio:1/1;
          right:4%;top:8%;
          transform:rotate(7deg);
          z-index:2;animation:v2-card-float-b 8s ease-in-out infinite;
          opacity:.95;
        }
        .v2-stack-card-3{
          width:42%;aspect-ratio:1/1;
          left:2%;bottom:8%;
          transform:rotate(-9deg);
          z-index:1;animation:v2-card-float-c 9s ease-in-out infinite;
          opacity:.9;
        }
        .v2-stack-img{
          position:relative;width:100%;height:100%;border-radius:inherit;overflow:hidden;
        }
        .v2-stack-tag{
          position:absolute;left:10px;bottom:10px;z-index:2;
          display:inline-flex;align-items:center;gap:5px;
          padding:5px 10px;border-radius:999px;
          background:rgba(255,255,255,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
          color:#1a0a14;font-size:11px;font-weight:700;letter-spacing:.2px;
          border:1px solid rgba(255,255,255,.7);
          box-shadow:0 4px 12px rgba(20,5,12,.14);
        }
        .v2-stack-tag svg{color:${PINK}}
        .v2-stack-success{
          position:absolute;top:12px;right:12px;z-index:3;
          display:inline-flex;align-items:center;gap:6px;
          padding:5px 11px 5px 5px;border-radius:999px;
          background:rgba(255,255,255,.95);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
          font-size:11.5px;font-weight:700;color:#1a0a14;
          box-shadow:0 8px 20px rgba(22,163,74,.2);
          animation:v2-card-pop 6s ease-in-out infinite;
        }
        .v2-stack-success-dot{
          width:20px;height:20px;border-radius:50%;
          background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;
          display:flex;align-items:center;justify-content:center;
        }
        .v2-stack-sali{
          position:absolute;left:-4%;bottom:14%;z-index:5;
          display:inline-flex;align-items:center;gap:9px;
          padding:7px 14px 7px 7px;border-radius:999px;
          background:#fff;
          box-shadow:0 18px 40px rgba(225,29,92,.24),0 4px 12px rgba(20,5,12,.08);
          animation:v2-card-float-a 7s ease-in-out infinite;
        }
        .v2-stack-sali-text p{
          margin:0;font-size:13px;font-weight:800;color:#1a0a14;letter-spacing:-.2px;line-height:1;
        }
        .v2-stack-sali-text span{
          font-size:10px;font-weight:700;color:${PINK};letter-spacing:.6px;
        }
        .v2-stack-spark{
          position:absolute;width:6px;height:6px;border-radius:50%;
          background:radial-gradient(circle,#fff 0%,${PINK} 100%);
          box-shadow:0 0 10px rgba(225,29,92,.7);pointer-events:none;
          opacity:.6;
        }
        .v2-stack-spark-0{top:6%;left:50%;animation:v2-spark 4s ease-in-out infinite}
        .v2-stack-spark-1{top:20%;right:6%;animation:v2-spark 5s ease-in-out .6s infinite}
        .v2-stack-spark-2{bottom:8%;right:14%;animation:v2-spark 4.5s ease-in-out 1.2s infinite}
        .v2-stack-spark-3{bottom:30%;left:6%;animation:v2-spark 5.5s ease-in-out .3s infinite}
        .v2-stack-spark-4{top:42%;right:32%;animation:v2-spark 4.2s ease-in-out 1.8s infinite}
        .v2-stack-spark-5{top:58%;left:30%;animation:v2-spark 6s ease-in-out 2.4s infinite}
        @keyframes v2-card-float-a{0%,100%{transform:rotate(-4deg) translateY(0)}50%{transform:rotate(-3deg) translateY(-10px)}}
        @keyframes v2-card-float-b{0%,100%{transform:rotate(7deg) translateY(0)}50%{transform:rotate(8deg) translateY(-12px)}}
        @keyframes v2-card-float-c{0%,100%{transform:rotate(-9deg) translateY(0)}50%{transform:rotate(-10deg) translateY(-8px)}}
        @keyframes v2-card-pop{0%,90%,100%{transform:scale(1)}45%{transform:scale(1.06)}}
        @keyframes v2-spark{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.4)}}
        @keyframes v2-halo-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}

        /* ── Browse by Category ── */
        .v2-browse{
          max-width:1180px;margin:0 auto;padding:88px 32px 16px;
        }
        .v2-browse-head{
          display:flex;align-items:flex-end;justify-content:space-between;
          gap:24px;margin-bottom:28px;flex-wrap:wrap;
        }
        .v2-browse-eyebrow{
          margin:0;font-size:12px;font-weight:700;letter-spacing:1.4px;
          text-transform:uppercase;color:${PINK};
        }
        .v2-browse-headline{
          margin:6px 0 0;font-family:'Fraunces',Georgia,serif;
          font-size:clamp(32px,4vw,46px);font-style:italic;font-weight:700;
          color:#1a0a14;letter-spacing:-1px;line-height:1.05;
        }
        .v2-browse-all{
          display:inline-flex;align-items:center;
          padding:10px 18px;border-radius:999px;
          background:#fff;border:1px solid #f0e2e8;
          color:#1a0a14;font-size:14px;font-weight:600;
          text-decoration:none;transition:all .2s;
        }
        .v2-browse-all:hover{border-color:${PINK};color:${PINK};transform:translateY(-1px);box-shadow:0 8px 20px rgba(225,29,92,.15)}
        .v2-cat-grid{
          display:grid;grid-template-columns:repeat(6,1fr);gap:14px;
        }
        .v2-cat-card{
          display:flex;flex-direction:column;text-decoration:none;
          background:#fff;border:1px solid #f3e8ee;border-radius:18px;
          overflow:hidden;transition:all .22s cubic-bezier(.2,.8,.2,1);
        }
        .v2-cat-card:hover{transform:translateY(-3px);box-shadow:0 14px 32px rgba(225,29,92,.12);border-color:rgba(225,29,92,.25)}
        .v2-cat-thumb{position:relative;aspect-ratio:1/1;background:linear-gradient(145deg,#fdf3f6,#fbe8ed)}
        .v2-cat-fallback{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#d9bfca}
        .v2-cat-meta{padding:11px 12px 13px;display:flex;align-items:center;justify-content:space-between;gap:8px}
        .v2-cat-name{margin:0;font-size:13px;font-weight:600;color:#1a0a14;letter-spacing:-.1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .v2-cat-count{margin:0;font-size:11.5px;color:#a08596;font-weight:600}

        /* ── Trending Now ── */
        .v2-trending{
          max-width:1180px;margin:0 auto;padding:64px 32px 16px;
        }
        .v2-trending-head{margin-bottom:28px}
        .v2-trend-tabs{display:inline-flex;gap:6px;margin-top:18px;padding:5px;background:#f8edf1;border-radius:999px}
        .v2-trend-tab{
          padding:8px 18px;border:none;background:transparent;border-radius:999px;
          font-size:13.5px;font-weight:600;color:#7c5566;cursor:pointer;
          font-family:inherit;transition:all .18s;
        }
        .v2-trend-tab:hover{color:${PINK}}
        .v2-trend-tab.is-active{background:#fff;color:${PINK};box-shadow:0 2px 8px rgba(225,29,92,.18)}
        .v2-trend-grid{
          display:grid;grid-template-columns:repeat(4,1fr);gap:18px;
        }
        .v2-trend-card{
          display:flex;flex-direction:column;text-decoration:none;
          background:#fff;border:1px solid #f3e8ee;border-radius:18px;
          overflow:hidden;transition:all .22s cubic-bezier(.2,.8,.2,1);
        }
        .v2-trend-card:hover{transform:translateY(-3px);box-shadow:0 18px 38px rgba(225,29,92,.14);border-color:rgba(225,29,92,.25)}
        .v2-trend-thumb{position:relative;aspect-ratio:4/5;background:linear-gradient(145deg,#fdf3f6,#fbe8ed)}
        .v2-trend-fallback{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#dabfca}
        .v2-trend-meta{padding:14px 14px 16px}
        .v2-trend-name{margin:0;font-size:14px;font-weight:600;color:#1a0a14;line-height:1.4;
          overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
        .v2-trend-price{margin:6px 0 0;font-size:14px;font-weight:800;color:${PINK};letter-spacing:-.2px}
        .v2-trend-empty{text-align:center;color:#9b8390;padding:48px 0}
        .v2-skeleton{aspect-ratio:4/5;background:linear-gradient(110deg,#fbeef3 30%,#fff5f8 50%,#fbeef3 70%);background-size:200% 100%;animation:v2-skel 1.4s ease-in-out infinite}
        @keyframes v2-skel{0%{background-position:200% 0}100%{background-position:-200% 0}}

        /* "How it works" section */
        .v2-how{
          padding:80px 32px;max-width:1180px;margin:0 auto;
          border-top:1px solid #f5e9ee;
        }
        .v2-how-title{
          margin:0 0 12px;font-family:'Fraunces',Georgia,serif;
          font-size:clamp(28px,3.6vw,42px);font-style:italic;font-weight:700;
          color:#1a0a14;letter-spacing:-.8px;text-align:center;
        }
        .v2-how-sub{
          margin:0 auto 48px;max-width:540px;text-align:center;
          font-size:16px;color:#7c5566;line-height:1.6;
        }
        .v2-how-grid{
          display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
          gap:18px;
        }
        .v2-how-card{
          padding:28px 22px 24px;border:1px solid #f0e2e8;border-radius:20px;
          background:linear-gradient(180deg,#fff 0%,#fff8fa 100%);
          transition:all .22s cubic-bezier(.2,.8,.2,1);
        }
        .v2-how-card:hover{border-color:rgba(225,29,92,.3);transform:translateY(-2px);box-shadow:0 14px 32px rgba(225,29,92,.1)}
        .v2-how-icon{
          width:48px;height:48px;border-radius:14px;
          background:linear-gradient(135deg,#fce7ef 0%,#fbcfe8 100%);
          display:flex;align-items:center;justify-content:center;
          color:${PINK_DARK};margin-bottom:14px;
        }
        .v2-how-card-title{
          margin:0 0 6px;font-size:17px;font-weight:700;color:#1a0a14;letter-spacing:-.2px;
        }
        .v2-how-card-desc{
          margin:0;font-size:13.5px;line-height:1.55;color:#7c5566;
        }

        /* ── Avatar ── */
        .v2-avatar{position:relative;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .v2-avatar-ring{display:none}
        .v2-avatar-core{
          position:relative;width:100%;height:100%;border-radius:50%;
          background:#fff1f5;
          display:flex;align-items:center;justify-content:center;color:#fff;
          border:1.5px solid #fcd4e0;
          box-shadow:0 2px 8px rgba(225,29,92,.12);
        }
        @keyframes v2-avatar-spin{to{transform:rotate(360deg)}}

        /* ── Textarea placeholder ── */
        .v2-chat-textarea::placeholder,
        .v2-chat-textarea::-webkit-input-placeholder{color:#a08596;opacity:1}
        .v2-chat-textarea:focus::placeholder{color:#bba3af}
        textarea::placeholder{color:#a08596;opacity:1}

        /* ── Mini cart button on product card ── */
        .v2-mini-cart{
          position:absolute;right:8px;bottom:8px;
          width:32px;height:32px;border-radius:50%;
          background:#fff;border:1.5px solid #f3d8e1;color:${PINK};
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;box-shadow:0 6px 14px rgba(225,29,92,.18);
          transition:all .18s cubic-bezier(.2,.8,.2,1);z-index:2;
        }
        .v2-mini-cart:hover{background:${PINK};color:#fff;border-color:${PINK};transform:scale(1.08)}
        .v2-mini-cart.is-added{background:#16a34a;color:#fff;border-color:#16a34a}

        /* ── Popup (gift / vendor detail) ── */
        .v2-pop-back{
          position:fixed;inset:0;z-index:10001;
          background:rgba(20,5,12,.55);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
          display:flex;align-items:center;justify-content:center;
          padding:16px;animation:v2fade .22s ease;
        }
        .v2-pop{
          position:relative;width:100%;max-width:880px;max-height:calc(100vh - 32px);
          background:#fff;border-radius:24px;overflow:hidden;
          display:grid;grid-template-columns:1.05fr 1fr;
          box-shadow:0 30px 80px rgba(20,5,12,.4),0 4px 16px rgba(225,29,92,.18);
          animation:v2pop .28s cubic-bezier(.2,.8,.2,1);
        }
        .v2-pop-close{
          position:absolute;top:14px;right:14px;z-index:5;
          width:34px;height:34px;border-radius:50%;
          background:rgba(255,255,255,.92);backdrop-filter:blur(8px);
          border:1px solid rgba(240,218,228,.7);color:#1a0a14;
          display:flex;align-items:center;justify-content:center;cursor:pointer;
          box-shadow:0 4px 12px rgba(0,0,0,.1);transition:all .18s;
        }
        .v2-pop-close:hover{background:#fff;color:${PINK};transform:scale(1.06)}
        .v2-pop-media{
          position:relative;background:linear-gradient(160deg,#fdf3f6,#fbe8ed);
          min-height:360px;display:flex;align-items:center;justify-content:center;
        }
        .v2-pop-media>img{width:100%!important;height:100%!important;object-fit:cover}
        .v2-pop-fallback{display:flex;align-items:center;justify-content:center;color:#e0bfca}
        .v2-pop-thumbs{
          position:absolute;left:14px;right:14px;bottom:14px;
          display:flex;gap:8px;justify-content:flex-start;
        }
        .v2-pop-thumb{
          position:relative;width:48px;height:48px;border-radius:12px;
          border:2px solid rgba(255,255,255,.8);overflow:hidden;cursor:pointer;
          padding:0;background:#fff;box-shadow:0 4px 12px rgba(0,0,0,.18);
          transition:all .18s;
        }
        .v2-pop-thumb:hover{transform:translateY(-2px)}
        .v2-pop-thumb.is-active{border-color:${PINK};box-shadow:0 0 0 3px rgba(225,29,92,.22)}
        .v2-pop-info{
          padding:30px 30px 26px;display:flex;flex-direction:column;gap:12px;
          overflow-y:auto;max-height:calc(100vh - 32px);
        }
        .v2-pop-name{
          margin:0;font-family:'Fraunces',Georgia,serif;
          font-size:26px;font-weight:600;color:#1a0a14;letter-spacing:-.6px;line-height:1.15;
          font-variation-settings:"opsz" 144;
        }
        .v2-pop-price{
          margin:0;font-size:22px;font-weight:800;color:${PINK};letter-spacing:-.3px;
        }
        .v2-pop-meta{
          margin:0;font-size:13.5px;color:#7c5566;font-weight:500;
          display:inline-flex;align-items:center;gap:6px;
        }
        .v2-pop-desc{
          margin:0;font-size:14px;line-height:1.65;color:#4a3540;
        }
        .v2-pop-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}
        .v2-pop-tag{
          padding:4px 10px;border-radius:999px;
          background:#fdf2f5;color:#7c1d3f;font-size:11.5px;font-weight:600;
          border:1px solid #fbe1e9;
        }
        .v2-pop-actions{
          display:flex;gap:10px;margin-top:auto;padding-top:14px;flex-wrap:wrap;
        }
        .v2-pop-cart{
          flex:1;min-width:140px;display:inline-flex;align-items:center;justify-content:center;
          gap:8px;padding:13px 18px;border-radius:14px;border:none;cursor:pointer;
          background:linear-gradient(135deg,${PINK} 0%,#f43f5e 100%);color:#fff;
          font-size:14px;font-weight:700;letter-spacing:.1px;font-family:inherit;
          box-shadow:0 8px 22px rgba(225,29,92,.32);transition:all .18s;
        }
        .v2-pop-cart:hover{transform:translateY(-1px);box-shadow:0 12px 28px rgba(225,29,92,.42)}
        .v2-pop-cart.is-added{background:#16a34a;box-shadow:0 8px 22px rgba(22,163,74,.32)}
        .v2-pop-view{
          display:inline-flex;align-items:center;justify-content:center;
          padding:13px 18px;border-radius:14px;
          background:#fff;border:1.5px solid #f0e2e8;color:#1a0a14;
          font-size:14px;font-weight:600;text-decoration:none;
          transition:all .18s;
        }
        .v2-pop-view:hover{border-color:${PINK};color:${PINK};transform:translateY(-1px)}
        @media (max-width:760px){
          .v2-pop{grid-template-columns:1fr;max-height:calc(100vh - 24px)}
          .v2-pop-media{min-height:240px;aspect-ratio:4/3}
          .v2-pop-info{padding:20px 22px 22px}
          .v2-pop-name{font-size:22px}
          .v2-pop-price{font-size:19px}
        }

        /* ── Plan Any Occasion ── */
        .v2-occ{max-width:1180px;margin:0 auto;padding:64px 32px 16px}
        .v2-occ-head{text-align:center;margin-bottom:34px}
        .v2-occ-head .v2-browse-eyebrow{display:block;text-align:center}
        .v2-occ-headline{margin:6px auto 12px;text-align:center}
        .v2-occ-sub{
          margin:0 auto;max-width:560px;
          font-size:16px;line-height:1.65;color:#7c5566;text-align:center;
        }
        .v2-occ-grid{
          display:grid;grid-template-columns:repeat(4,1fr);gap:14px;
        }
        .v2-occ-card{
          display:flex;align-items:center;gap:14px;
          padding:18px 20px;border-radius:18px;
          background:#fff;border:1px solid #f3e8ee;text-decoration:none;
          transition:all .22s cubic-bezier(.2,.8,.2,1);position:relative;
        }
        .v2-occ-card:hover{
          transform:translateY(-3px);
          border-color:rgba(225,29,92,.3);
          box-shadow:0 14px 32px rgba(225,29,92,.12);
        }
        .v2-occ-card:hover .v2-occ-arrow{transform:translateX(3px);color:${PINK}}
        .v2-occ-icon{
          width:46px;height:46px;border-radius:14px;
          background:linear-gradient(135deg,#fce7ef 0%,#fbcfe8 100%);
          display:flex;align-items:center;justify-content:center;color:${PINK_DARK};
          flex-shrink:0;
        }
        .v2-occ-label{
          flex:1;font-size:14.5px;font-weight:700;color:#1a0a14;letter-spacing:-.1px;
        }
        .v2-occ-arrow{color:#c8adb8;transition:all .22s}

        /* ── Landing wrap (no fixed height to avoid clipping) ── */
        .v2-landing-wrap{
          background:#fff;position:relative;
        }

        /* ── Fullscreen chat overlay ── */
        .v2-overlay{
          position:fixed;inset:0;z-index:9999;
          display:grid;grid-template-columns:300px 1fr;
          background-color:#fff;
          background-image:
            radial-gradient(circle, rgba(225,29,92,.05) 1px, transparent 1px),
            linear-gradient(180deg,#fffcfb 0%,#fdf6f8 40%,#fceaef 100%);
          background-size:28px 28px, 100% 100%;
          background-repeat:repeat, no-repeat;
          animation:v2fade .25s ease;
        }
        .v2-overlay.is-collapsed{grid-template-columns:1fr}
        .v2-overlay.has-plan{grid-template-columns:300px 1fr 380px}
        .v2-overlay.has-plan.is-collapsed{grid-template-columns:1fr 380px}
        .v2-plan-panel{
          height:100vh;height:100dvh;overflow:hidden;
          border-left:1px solid rgba(240,218,228,.55);
          background:#f8fafc;
          display:flex;flex-direction:column;
        }
        .v2-plan-fab{
          position:fixed;bottom:88px;right:18px;z-index:10000;
          display:none;
        }
        .v2-plan-reopen-tab{
          position:fixed;right:0;top:50%;transform:translateY(-50%);
          z-index:10000;display:flex;flex-direction:column;align-items:center;
          gap:6px;background:#e11d5c;color:#fff;border:none;cursor:pointer;
          padding:14px 7px;border-radius:10px 0 0 10px;
          font-size:0.7rem;font-weight:700;font-family:inherit;
          writing-mode:vertical-rl;text-orientation:mixed;
          box-shadow:-3px 0 16px rgba(225,29,92,.28);
          transition:background .15s;
        }
        .v2-plan-reopen-tab:hover{background:#be1850}
        .v2-plan-reopen-tab svg{writing-mode:horizontal-tb;flex-shrink:0;margin-bottom:6px}
        .v2-plan-sheet{
          position:fixed;inset:0;z-index:10001;
          background:rgba(15,23,42,.45);
          backdrop-filter:blur(6px);
          display:flex;flex-direction:column;justify-content:flex-end;
        }
        .v2-plan-sheet-inner{
          background:#f8fafc;border-radius:20px 20px 0 0;
          height:82vh;overflow:hidden;display:flex;flex-direction:column;
        }
        @media(max-width:900px){
          .v2-overlay.has-plan{grid-template-columns:300px 1fr}
          .v2-overlay.has-plan.is-collapsed{grid-template-columns:1fr}
          .v2-plan-panel{display:none}
          .v2-plan-fab{display:flex!important}
        }
        @media(max-width:768px){
          .v2-overlay.has-plan{grid-template-columns:1fr}
        }
        .v2-overlay-main{
          position:relative;display:flex;flex-direction:column;min-width:0;
          height:100vh;height:100dvh;overflow:hidden;
        }
        .v2-overlay-scroll{
          flex:1;overflow-y:auto;
          padding:28px 24px 22px;
          display:flex;flex-direction:column;
        }
        /* Centered conversation column for readability on big screens */
        .v2-overlay-inner{
          width:100%;max-width:780px;margin:0 auto;
          display:flex;flex-direction:column;gap:14px;
        }
        .v2-overlay-foot-inner{
          width:100%;max-width:780px;margin:0 auto;
        }

        /* ── Sidebar ── */
        .v2-sidebar{
          display:flex;flex-direction:column;
          background:rgba(255,253,254,.96);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
          border-right:1px solid rgba(240,218,228,.6);
          height:100vh;height:100dvh;overflow:hidden;
        }
        .v2-sidebar-top{
          display:flex;align-items:center;gap:8px;padding:14px 14px 10px;
          border-bottom:1px solid rgba(240,218,228,.5);
        }
        .v2-sidebar-new{
          flex:1;display:inline-flex;align-items:center;justify-content:center;gap:8px;
          padding:10px 14px;border-radius:14px;border:1.5px solid rgba(240,218,228,.9);
          background:#fff;color:#1a0a14;font-family:inherit;
          font-size:13.5px;font-weight:700;letter-spacing:-.1px;cursor:pointer;
          transition:all .18s;
        }
        .v2-sidebar-new:hover{border-color:${PINK};color:${PINK};box-shadow:0 4px 12px rgba(225,29,92,.12)}
        .v2-sidebar-new svg{color:${PINK}}
        .v2-sidebar-close{
          display:none;width:36px;height:36px;border-radius:12px;border:1px solid rgba(240,218,228,.9);
          background:#fff;color:#1a0a14;cursor:pointer;align-items:center;justify-content:center;
        }
        .v2-sidebar-collapse{
          display:inline-flex;width:36px;height:36px;border-radius:12px;
          border:1px solid rgba(240,218,228,.9);background:#fff;color:#1a0a14;
          cursor:pointer;align-items:center;justify-content:center;transition:all .15s;
        }
        .v2-sidebar-collapse:hover{border-color:${PINK};color:${PINK}}
        .v2-sidebar-label{
          padding:14px 16px 8px;font-size:11px;font-weight:800;
          color:#b09aa6;letter-spacing:1.2px;text-transform:uppercase;
        }
        .v2-sidebar-list{
          flex:1;overflow-y:auto;padding:0 8px 14px;display:flex;flex-direction:column;gap:2px;
        }
        .v2-sidebar-list::-webkit-scrollbar{width:4px}
        .v2-sidebar-list::-webkit-scrollbar-thumb{background:rgba(225,29,92,.18);border-radius:4px}
        .v2-sidebar-empty{
          margin:0;padding:18px 12px;font-size:12.5px;color:#a08596;line-height:1.55;
        }
        .v2-sidebar-row{
          display:flex;flex-direction:column;gap:4px;padding:10px 12px;
          border-radius:12px;background:transparent;border:none;cursor:pointer;
          font-family:inherit;text-align:left;color:#1a0a14;
          transition:background .15s;
        }
        .v2-sidebar-row:hover{background:rgba(225,29,92,.07)}
        .v2-sidebar-row.is-active{background:rgba(225,29,92,.12)}
        .v2-sidebar-row-main{
          display:flex;align-items:center;gap:8px;min-width:0;
          font-size:13.5px;font-weight:600;letter-spacing:-.1px;
        }
        .v2-sidebar-row-main svg{flex-shrink:0;color:${PINK}}
        .v2-sidebar-row-title{
          overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;
        }
        .v2-sidebar-row-meta{
          display:flex;align-items:center;justify-content:space-between;
          padding-left:21px;font-size:10.5px;color:#a08596;font-weight:600;
        }
        .v2-sidebar-del{
          width:20px;height:20px;border-radius:6px;display:none;
          align-items:center;justify-content:center;color:#a08596;cursor:pointer;
        }
        .v2-sidebar-row:hover .v2-sidebar-del{display:inline-flex}
        .v2-sidebar-del:hover{background:rgba(225,29,92,.12);color:${PINK}}
        .v2-sidebar-scrim{display:none}

        /* ── Chat header (overlay) ── */
        .v2-chat-head{
          display:flex;align-items:center;gap:12px;
          padding:14px 22px;background:rgba(255,255,255,.94);
          backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
          border-bottom:1px solid rgba(240,218,228,.6);
          flex-shrink:0;
          padding-top:max(14px, env(safe-area-inset-top));
        }
        .v2-head-icon-btn{
          width:36px;height:36px;border-radius:12px;border:1px solid rgba(240,218,228,.9);
          background:#fff;color:#1a0a14;cursor:pointer;display:flex;align-items:center;justify-content:center;
          transition:all .15s;
        }
        .v2-head-icon-btn:hover{border-color:${PINK};color:${PINK}}
        .v2-sidebar-toggle{display:none}
        .v2-sidebar-toggle.is-always{display:inline-flex}
        .v2-head-brand{display:flex;align-items:center;gap:11px;min-width:0}
        .v2-head-mascot{
          position:relative;display:flex;align-items:center;justify-content:center;
          width:46px;height:46px;border-radius:14px;flex-shrink:0;
          background:linear-gradient(135deg,#fff 0%,#ffeef4 100%);
          box-shadow:0 6px 18px rgba(225,29,92,.18),inset 0 0 0 1px rgba(225,29,92,.1);
          animation:v2-mascot-bob 3.6s ease-in-out infinite;
        }
        @keyframes v2-mascot-bob{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-2px) rotate(-2deg)}}
        .v2-head-titles p{margin:0}
        .v2-head-name{
          font-weight:800;font-size:17px;color:#1a0a14;letter-spacing:-.4px;line-height:1.1;
          display:inline-flex;align-items:center;gap:5px;
        }
        .v2-head-spark{color:${PINK};display:inline-flex;animation:v2-spark 2.4s ease-in-out infinite}
        .v2-head-role{font-size:11.5px;color:${PINK_DARK};font-weight:600;margin-top:2px!important;letter-spacing:.1px}
        .v2-head-steps{display:flex;align-items:center;gap:6px;flex:1;min-width:0;margin:0 8px}
        .v2-head-step{display:flex;align-items:center;gap:6px;flex:1;min-width:0}
        .v2-head-dot{
          width:22px;height:22px;border-radius:50%;background:#fff;
          border:1.5px solid #ebd5dd;color:#c4a5b3;
          display:flex;align-items:center;justify-content:center;
          font-size:11px;font-weight:700;flex-shrink:0;transition:all .25s;
        }
        .v2-head-dot.is-filled{background:${PINK};border-color:${PINK};color:#fff}
        .v2-head-line{flex:1;height:2px;border-radius:2px;background:#f0e2e8;transition:background .25s}
        .v2-head-line.is-filled{background:${PINK}}
        .v2-head-new{
          display:inline-flex;align-items:center;gap:6px;
          padding:8px 14px;border-radius:999px;
          background:#fff;border:1px solid #ebd5dd;color:#1a0a14;
          font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer;
          transition:all .18s;
        }
        .v2-head-new:hover{border-color:${PINK};color:${PINK};box-shadow:0 4px 12px rgba(225,29,92,.14)}
        .v2-head-new svg{color:${PINK}}
        .v2-head-close{
          width:36px;height:36px;border-radius:50%;border:1px solid #ebd5dd;
          background:#fff;color:#1a0a14;cursor:pointer;display:flex;align-items:center;justify-content:center;
          transition:all .18s;
        }
        .v2-head-close:hover{background:#fdf2f5;color:${PINK};border-color:${PINK};transform:scale(1.04)}

        /* ── Floating launcher wrapper (drag anchor) ── */
        .v2-fab-wrap{
          position:fixed;right:22px;bottom:calc(22px + env(safe-area-inset-bottom));z-index:90;
          touch-action:none;
        }
        .v2-fab-dismiss{
          position:absolute;top:-6px;right:-6px;
          width:22px;height:22px;border-radius:50%;border:1px solid rgba(240,218,228,.95);
          background:#fff;color:#9c5b71;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 4px 10px rgba(20,5,12,.18);
          opacity:0;transition:opacity .18s,transform .15s,color .15s,background .15s;
          padding:0;
        }
        .v2-fab-wrap:hover .v2-fab-dismiss,
        .v2-fab-dismiss:focus-visible{opacity:1}
        .v2-fab-dismiss:hover{background:${PINK};color:#fff;border-color:${PINK};transform:scale(1.06)}

        /* ── Reopen-chat floating pill ── */
        .v2-reopen{
          position:relative;
          display:inline-flex;align-items:center;gap:10px;
          padding:8px 18px 8px 8px;border-radius:999px;border:none;
          background:#fff;cursor:grab;
          box-shadow:0 12px 32px rgba(225,29,92,.28),0 4px 12px rgba(225,29,92,.16);
          color:#1a0a14;font-family:inherit;font-size:14px;font-weight:700;letter-spacing:.1px;
          transition:transform .22s cubic-bezier(.2,.8,.2,1),box-shadow .22s cubic-bezier(.2,.8,.2,1);
          animation:v2-reopen-in .35s cubic-bezier(.2,.8,.2,1);
          user-select:none;-webkit-user-select:none;
        }
        .v2-reopen:hover{transform:translateY(-2px);box-shadow:0 16px 38px rgba(225,29,92,.36)}
        .v2-reopen:active{cursor:grabbing}
        .v2-reopen-pulse{
          position:absolute;inset:-4px;border-radius:999px;
          background:radial-gradient(circle,rgba(225,29,92,.22) 0%,transparent 70%);
          animation:v2-reopen-pulse 2.4s ease-in-out infinite;pointer-events:none;
        }
        .v2-reopen-icon{position:relative;display:flex;align-items:center;justify-content:center;pointer-events:none}
        .v2-reopen-label{position:relative;pointer-events:none}
        @keyframes v2-reopen-in{from{opacity:0;transform:translateY(20px) scale(.9)}to{opacity:1;transform:none}}
        @keyframes v2-reopen-pulse{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:0;transform:scale(1.25)}}

        .v2-reopen-mini{
          position:relative;
          width:60px;height:60px;border-radius:50%;border:none;
          background:linear-gradient(135deg,#fff 0%,#ffeef4 100%);
          cursor:grab;display:flex;align-items:center;justify-content:center;
          box-shadow:0 12px 32px rgba(225,29,92,.32),0 4px 12px rgba(225,29,92,.18);
          transition:transform .22s cubic-bezier(.2,.8,.2,1),box-shadow .22s cubic-bezier(.2,.8,.2,1);
          animation:v2-reopen-in .35s cubic-bezier(.2,.8,.2,1);
          user-select:none;-webkit-user-select:none;
        }
        .v2-reopen-mini:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 16px 40px rgba(225,29,92,.4)}
        .v2-reopen-mini:active{cursor:grabbing}

        /* ── Inline links inside bot messages ── */
        .v2-msg-link{
          color:${PINK};text-decoration:none;font-weight:700;
          border-bottom:1.5px solid rgba(225,29,92,.35);
          transition:all .15s;
        }
        .v2-msg-link:hover{border-bottom-color:${PINK};background:rgba(225,29,92,.06)}

        /* Mobile / tablet */
        @media (max-width:1100px){
          .v2-occ-grid{grid-template-columns:repeat(3,1fr)}
          .v2-cat-grid{grid-template-columns:repeat(4,1fr)}
          .v2-trend-grid{grid-template-columns:repeat(3,1fr)}
          .v2-moments-grid{grid-template-columns:repeat(2,1fr)}
          .v2-moment-feature{grid-column:span 2;grid-row:auto;aspect-ratio:16/10}
        }
        /* Big screens — give the conversation room to breathe */
        @media (min-width:1280px){
          .v2-overlay-scroll{padding:36px 32px 24px}
          .v2-overlay-inner{max-width:820px;gap:16px}
          .v2-chat-head{padding:16px 28px}
        }
        @media (min-width:1600px){
          .v2-overlay-inner{max-width:880px}
        }

        /* Mobile / tablet */
        @media (max-width:1100px){
          .v2-occ-grid{grid-template-columns:repeat(3,1fr)}
          .v2-cat-grid{grid-template-columns:repeat(4,1fr)}
          .v2-trend-grid{grid-template-columns:repeat(3,1fr)}
          .v2-moments-grid{grid-template-columns:repeat(2,1fr)}
          .v2-moment-feature{grid-column:span 2;grid-row:auto;aspect-ratio:16/10}
        }
        @media (max-width:920px){
          .v2-landing-grid{grid-template-columns:1fr;gap:32px;padding:32px 22px;min-height:auto}
          .v2-right{order:-1}
          .v2-stack-stage{max-width:360px;margin:0 auto}
          .v2-headline{font-size:clamp(36px,9vw,52px)}
          .v2-browse,.v2-trending,.v2-occ,.v2-moments{padding-left:22px;padding-right:22px}
          .v2-cat-grid{grid-template-columns:repeat(3,1fr)}
          .v2-trend-grid{grid-template-columns:repeat(2,1fr)}
          .v2-occ-grid{grid-template-columns:repeat(2,1fr)}
          .v2-how{padding:56px 22px}
          .v2-hero2{padding:42px 22px 0}
          .v2-hero2-headline{font-size:clamp(36px,9vw,56px);letter-spacing:-1.4px}
          .v2-hero2-search-btn-label{display:none}
          .v2-hero2-search-btn{padding:11px 14px}
          .v2-moments-head{flex-direction:column;align-items:flex-start;gap:8px}
          .v2-fab-wrap{right:14px;bottom:calc(78px + env(safe-area-inset-bottom))}
          .v2-reopen{padding:6px 14px 6px 6px;font-size:13px}
          .v2-reopen-label{display:none}
          .v2-reopen-mini{width:54px;height:54px}
          .v2-fab-dismiss{opacity:1;width:24px;height:24px;top:-8px;right:-8px}

          /* Sidebar becomes slide-in panel */
          .v2-overlay{grid-template-columns:1fr}
          .v2-overlay-scroll{padding:18px 14px 14px}
          .v2-sidebar{
            position:fixed;left:0;top:0;bottom:0;width:84%;max-width:320px;
            transform:translateX(-100%);transition:transform .25s cubic-bezier(.2,.8,.2,1);
            z-index:10001;box-shadow:0 24px 60px rgba(20,5,12,.3);
          }
          .v2-sidebar.is-open{transform:none}
          .v2-sidebar-close{display:inline-flex}
          .v2-sidebar-scrim{
            display:block;position:fixed;inset:0;z-index:10000;
            background:rgba(20,5,12,.4);backdrop-filter:blur(2px);
          }
          .v2-sidebar-toggle{display:inline-flex}
          .v2-head-steps{display:none}
          .v2-head-new{display:none}
          .v2-chat-head{padding:12px 16px;gap:10px;position:relative}
          .v2-head-close{position:absolute;top:50%;right:12px;transform:translateY(-50%)}
          .v2-head-mascot{width:42px;height:42px;border-radius:12px}
          .v2-head-name{font-size:16px}
          .v2-head-role{font-size:11px}
          .v2-overlay{overflow:hidden}
          .v2-overlay-main{overflow-x:hidden}
          .v2-landing-wrap{overflow-x:hidden}
        }
        @media (max-width:520px){
          .v2-landing-grid{padding:24px 18px;gap:24px}
          .v2-stack-stage{max-width:300px}
          .v2-chat-card{padding:12px 12px 8px}
          .v2-cat-grid{grid-template-columns:repeat(2,1fr);gap:10px}
          .v2-trend-grid{grid-template-columns:repeat(2,1fr);gap:12px}
          .v2-occ-grid{grid-template-columns:1fr 1fr;gap:10px}
          .v2-browse-headline{font-size:30px}
          .v2-chat-head{padding:10px 12px;gap:8px}
          .v2-overlay-scroll{padding:14px 12px 12px;gap:10px}
          .v2-head-mascot{width:38px;height:38px;border-radius:11px}
          .v2-head-titles{min-width:0}
          .v2-head-name{font-size:16px;letter-spacing:-.3px}
          .v2-head-role{font-size:10.5px}
          .v2-head-icon-btn{width:34px;height:34px;border-radius:11px}
          .v2-head-close{width:34px;height:34px}
          .v2-hero2{padding:30px 18px 0}
          .v2-hero2-inner{padding:18px 0 36px}
          .v2-hero2-headline{font-size:clamp(34px,11vw,48px)}
          .v2-hero2-sub{font-size:14.5px;margin-top:18px}
          .v2-hero2-search{padding:5px 5px 5px 16px}
          .v2-hero2-search-input{font-size:14.5px;padding:11px 4px}
          .v2-hero2-trust{column-gap:14px;font-size:12.5px}
          .v2-hero2-trust-sep{display:none}
          .v2-hero2-marquee-item{font-size:14px}
          .v2-moments{padding:48px 18px 16px}
          .v2-moments-grid{grid-template-columns:1fr 1fr;gap:10px}
          .v2-moment-feature{grid-column:span 2;aspect-ratio:5/4}
          .v2-moment-body{padding:16px 16px 18px}
        }
      `}</style>

      {onAIPage && (
        <div lang={lang} className="v2-landing-wrap">
          <Landing
            lang={lang}
            onSend={send}
            onQuickAction={sendQuickAction}
            input={input}
            setInput={setInput}
            inputRef={inputRef}
          />
        </div>
      )}

      {/* Fullscreen chat overlay — covers site header/footer */}
      {phase === "chat" && (
        <div lang={lang} className={`v2-overlay ${sidebarCollapsed ? "is-collapsed" : ""} ${inPlanMode && panelOpen ? "has-plan" : ""}`}>
          <ChatSidebar
            lang={lang}
            history={history}
            currentId={sessionId}
            onPick={handlePickHistory}
            onNew={handleNewChat}
            onDelete={handleDeleteHistory}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onCollapse={toggleSidebarCollapsed}
            collapsed={sidebarCollapsed}
          />

          <div className="v2-overlay-main">
            <ChatHeader
              lang={lang}
              chatState={chatState}
              onToggleSidebar={() => sidebarCollapsed ? toggleSidebarCollapsed() : setSidebarOpen(s => !s)}
              onNewChat={handleNewChat}
              onClose={() => setPhase("landing")}
              sidebarCollapsed={sidebarCollapsed}
            />

            <StateBar state={chatState} lang={lang} />

            <div ref={scrollRef} className="v2-scroll v2-overlay-scroll">
              <div className="v2-overlay-inner">
                {messages.map(msg => {
                  if (msg.type === "block") {
                    return (
                      <div key={msg.id} className="v2-msg">
                        <Block
                          block={msg.block} lang={lang} onOpen={openPopup}
                          onAddToPlan={inPlanMode ? addToPlanFromChat : null}
                        />
                      </div>
                    );
                  }
                  return (
                    <div key={msg.id} className="v2-msg">
                      <MsgBubble msg={msg} lang={lang} onPlanEvent={handlePlanEvent} />
                    </div>
                  );
                })}
                {typing && <div className="v2-msg"><TypingDots /></div>}
              </div>
            </div>

            <ChatInput
              lang={lang}
              input={input}
              setInput={setInput}
              onSend={send}
              typing={typing}
              inputRef={inputRef}
            />
          </div>

          {/* Plan panel — desktop right column. panelOpen controls visibility only;
              eventState is never cleared when the panel is closed. */}
          {inPlanMode && panelOpen && (
            <div className="v2-plan-panel">
              {/* Panel close button — hides the panel without clearing the plan */}
              <div style={{ padding: "8px 10px 0", display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
                <button
                  onClick={() => setPanelOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: "4px 6px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4, fontSize: "0.72rem", fontWeight: 600, fontFamily: "inherit" }}
                  title={lang === "hy" ? "Թաքցնել պլանը" : lang === "ru" ? "Скрыть план" : "Hide plan"}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12"/><path d="M18 6 6 18"/></svg>
                  {lang === "hy" ? "Փակել" : lang === "ru" ? "Скрыть" : "Hide"}
                </button>
              </div>
              <EventPlanPanel
                eventState={eventState}
                vendorResults={vendorResults}
                onSelectVendor={handleSelectVendor}
                onSearchVendors={handleSearchVendors}
                onUnselectVendor={handleUnselectVendor}
                onAddService={handleAddService}
                onRemoveService={handleRemoveService}
                onOpenBulkModal={() => setShowBulkModal(true)}
                sessionId={plannerSessionId}
                lang={lang}
              />
            </div>
          )}

          {/* Reopen tab — shown when plan exists but panel is hidden */}
          {inPlanMode && !panelOpen && (
            <button
              className="v2-plan-reopen-tab"
              onClick={() => setPanelOpen(true)}
              title={lang === "hy" ? "Բացել պլանը" : lang === "ru" ? "Открыть план" : "Show plan"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m9 12 2 2 4-4"/></svg>
              <span>{lang === "hy" ? "Պլան" : lang === "ru" ? "План" : "Plan"}</span>
            </button>
          )}

          {/* Mobile plan FAB — only shown when in plan mode on narrow screens */}
          {inPlanMode && (
            <button
              className="v2-plan-fab"
              onClick={() => setShowMobilePlan(true)}
              style={{ background: "linear-gradient(135deg,#e11d5c,#f43f5e)", border: "none", borderRadius: 999, padding: "11px 18px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", alignItems: "center", gap: 7, boxShadow: "0 6px 22px rgba(225,29,92,.38)", fontFamily: "inherit" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 17V5l11-2v12"/><circle cx="6" cy="17" r="3"/><circle cx="17" cy="15" r="3"/></svg>
              {lang === "hy" ? "Պլան" : lang === "ru" ? "План" : "Plan"}
            </button>
          )}

          {/* Mobile plan bottom sheet */}
          {showMobilePlan && inPlanMode && (
            <div className="v2-plan-sheet" onClick={() => setShowMobilePlan(false)}>
              <div className="v2-plan-sheet-inner" onClick={e => e.stopPropagation()}>
                <div style={{ padding: "10px 16px 0", display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={() => setShowMobilePlan(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#64748b" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12"/><path d="M18 6 6 18"/></svg>
                  </button>
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <EventPlanPanel
                    eventState={eventState}
                    vendorResults={vendorResults}
                    onSelectVendor={handleSelectVendor}
                    onSearchVendors={handleSearchVendors}
                    onUnselectVendor={handleUnselectVendor}
                    onAddService={handleAddService}
                    onRemoveService={handleRemoveService}
                    onOpenBulkModal={() => { setShowMobilePlan(false); setShowBulkModal(true); }}
                    sessionId={plannerSessionId}
                    lang={lang}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {popup && (
        <Popup
          item={popup.item}
          type={popup.type}
          lang={lang}
          onClose={() => setPopup(null)}
        />
      )}

      {showBulkModal && inPlanMode && (
        <BulkInquiryModal
          eventState={eventState}
          sessionId={plannerSessionId}
          onClose={() => setShowBulkModal(false)}
          lang={lang}
        />
      )}

      {/* Floating launcher — hidden on AI pages (landing/planner already have their own input)
          and when the user has dismissed it for the session.
          Drag-and-drop to reposition; position persists in localStorage.
          A small × button hides it for the rest of the session. */}
      {phase !== "chat" && !onAIDestination && !fabDismissed && (
        (() => {
          const hasHistory = messages.length > 0;
          const fabStyle = fabPos
            ? { right: `${fabPos.right}px`, bottom: `${fabPos.bottom}px` }
            : undefined;
          return (
            <div className="v2-fab-wrap" style={fabStyle}>
              <button
                type="button"
                onMouseDown={onFabPointerDown}
                onTouchStart={onFabPointerDown}
                onClick={onFabClick}
                className={hasHistory ? "v2-reopen" : "v2-reopen-mini"}
                aria-label={lang === "ru" ? "Открыть Sali AI" : lang === "hy" ? "Բացել Sali AI" : "Open Sali AI"}
                title={lang === "ru"
                  ? "Sali AI помощник — перетащите чтобы переместить"
                  : lang === "hy"
                  ? "Sali AI օգնական — տեղափոխելու համար քաշիր"
                  : "Sali AI assistant — drag to move"}
              >
                {hasHistory && <span className="v2-reopen-pulse" />}
                <span className="v2-reopen-icon">
                  <BotMascot size={hasHistory ? 32 : 36} />
                </span>
                {hasHistory && (
                  <span className="v2-reopen-label">
                    {lang === "ru" ? "Продолжить" : lang === "hy" ? "Շարունակել" : "Continue"}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={handleFabDismiss}
                className="v2-fab-dismiss"
                aria-label={lang === "ru" ? "Скрыть" : lang === "hy" ? "Թաքցնել" : "Hide"}
                title={lang === "ru" ? "Скрыть до перезагрузки" : lang === "hy" ? "Թաքցնել մինչ վերաբեռնում" : "Hide until reload"}
              >
                <Icon name="x" size={11} />
              </button>
            </div>
          );
        })()
      )}
    </>
  );
}
