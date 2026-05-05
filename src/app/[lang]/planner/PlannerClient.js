"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { sendLegacyPlanMessage } from "@/services/assistantApi";
import ServiceChecklist from "@/components/ai/ServiceChecklist";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Sparkles, Check, Search, X, Star,
  ChevronDown, ChevronUp, ChevronRight, Users, Calendar,
  MapPin, DollarSign, Loader2, Heart,
  Building, Building2, Flame, Plus, User, Package,
  Cake, Camera, Video, Flower2, Music, Mic, Gem,
  Monitor, Smile, UtensilsCrossed, Briefcase, GraduationCap,
  Baby, AlertTriangle, Settings, Paperclip, Zap, Share2, Bookmark,
  Lock, LogIn, Cloud, CheckCircle2, ClipboardList,
} from "lucide-react";
import { getUser, isLoggedIn, plannerAPI } from "@/lib/api";

/* ─────────────────────────────────────────
   DESIGN TOKENS  — Salooote white theme
───────────────────────────────────────── */
const C = {
  bg:       "#f1f5f9",
  panel:    "#ffffff",
  surface:  "rgba(255,255,255,0.85)",
  border:   "rgba(15,23,42,0.07)",
  borderMd: "rgba(15,23,42,0.12)",
  text:     "#0f172a",
  text2:    "#64748b",
  text3:    "#94a3b8",
  brand:    "#e11d5c",
  purple:   "#e11d5c",
  green:    "#16a34a",
  grad:     "linear-gradient(135deg,#e11d5c,#f43f5e)",
  gradFull: "linear-gradient(135deg,#f97316,#e11d5c,#f43f5e)",
  userBg:   "linear-gradient(135deg,#e11d5c,#f43f5e)",
  botBg:    "#f8fafc",
};
/* ─────────────────────────────────────────
   TRANSLATIONS
───────────────────────────────────────── */
const T = {
  en: {
    subtitle: "Event planning assistant · Online",
    newChat: "New chat",
    greeting: "Hi!",
    welcome1: "I\'m your AI event planner — ready to help make your celebration exactly as you envision.",
    welcome2: "Just tell me: what event, where, how many guests and what vibe you want,",
    welcome3: "I\'ll handle the rest for you",
    feat1Title: "Smart Plan",
    feat1Desc: "A clear, complete step-by-step built automatically for your event",
    feat1Msg: "Build me a smart checklist for my event",
    feat2Title: "Find the Best",
    feat2Desc: "Real, verified vendors in your city — found in seconds",
    feat2Msg: "Find top vendors near me",
    feat3Title: "Cultural Nuances",
    feat3Desc: "Armenian traditions, tips and details so you forget nothing",
    feat3Msg: "Tell me about Armenian traditions and cultural tips",
    placeholder: "Write what you want to plan…",
    pill1: "Attach", pill2: "Add to plan", pill3: "Give ideas",
    disclaimer: "AI may make mistakes · Always verify details with vendors",
    quickStart: "Quick start",
    pickType: "Pick an event type",
    pickSub: "Or describe your event in chat\nand I\'ll build the full plan",
    suggestions: ["Plan a wedding", "Plan a birthday", "Christening ideas", "Corporate event"],
    eventLabels: {
      christening: "Christening", wedding: "Wedding", birthday: "Birthday",
      kids_party: "Kids Party", corporate: "Corporate", baby_shower: "Baby Shower",
      engagement: "Engagement", graduation: "Graduation", anniversary: "Anniversary",
      atamhatik: "Atamhatik", gender_reveal: "Gender Reveal", proposal: "Proposal",
      romantic_dinner: "Romantic Dinner", store_opening: "Store Opening",
      product_launch: "Product Launch", new_year_party: "New Year Party",
      house_party: "House Party", prom: "Prom", school_event: "School Event",
    },
    catLabels: { religious: "Religious", roles: "Key Roles", clothing: "Attire", ceremony: "Ceremony", reception: "Reception", celebration: "Celebration", food: "Food & Cake", decoration: "Decorations", media: "Photo & Video", entertainment: "Entertainment", attire: "Attire", venue: "Venue", tech: "Tech & AV", other: "Other" },
    planningInProgress: "Planning in progress",
    sendToVendors: "Send to Vendors",
    share: "Share",
    guests: "guests",
    stillNeeded: "Still needed:",
    optional: "optional",
    find: "Find",
    found: "found",
    vendorProgress: "Vendor Progress",
    confirmed: "confirmed",
    stillNeededShort: "still needed",
    timeline: "Timeline",
    now: "Now",
    progress: "Progress",
    searching: "Searching…",
    vendorsFound: "vendors found",
    searchForVendors: "Search for vendors",
    filterByName: "Filter by name…",
    findingVendors: "Finding vendors…",
    noVendorsFound: "No vendors found",
    searchAgain: "Search again",
    close: "Close",
    alreadySelected: "Already Selected — Click to deselect",
    selectVendor: "Select this vendor",
    viewBizPage: "View Business Page",
    noPhotos: "No portfolio photos yet",
    requestsSent: "Requests Sent!",
    sentWithErrors: "Sent with some errors",
    sendInquiryAll: "Send Inquiry to All Vendors",
    vendorReplyNote: "Vendors will reply to your inquiries. You can track them in your messages.",
    viewInquiries: "View Inquiries",
    sending: "Sending…",
    cancel: "Cancel",
    sent: "Sent",
    failed: "Failed",
    saveYourPlan: "Save your event plan",
    freeAccount: "Free account — no credit card",
    saveDesc: "Create a free account to save your plan, get vendor matches, and track every detail of your event in one place.",
    authFeature1: "Complete checklist built automatically for your event",
    authFeature2: "Find & compare vendors in your city",
    authFeature3: "Everything saved — pick up where you left off",
    createFreeAccount: "Create free account",
    signIn: "Already have an account? Sign in",
    addService: "Add a service",
    addServicePlaceholder: "e.g. Ice cream, Photo booth…",
    removeService: "Remove",
    serviceTitles: {
      church: "Church Booking", baptism_candle: "Baptism Candle", cross: "Cross for Baby",
      kavor: "Godfather (Kavor)", kavork: "Godmother (Kavork)", baby_outfit: "White Baby Outfit",
      venue: "Venue", catering: "Catering", cake: "Cake", wedding_cake: "Wedding Cake",
      photographer: "Photographer", videographer: "Videographer",
      decoration: "Decorations", balloon_decoration: "Balloon Decorations",
      flowers: "Flowers", music: "Music / DJ", tamada: "Tamada (MC)",
      wedding_rings: "Wedding Rings", ring: "Engagement Ring", bridal_dress: "Bridal Gown",
      ceremony_venue: "Ceremony Venue", reception_venue: "Reception Hall",
      av_tech: "AV & Tech Setup", entertainment: "Entertainment", animator: "Kids Animator",
    },
  },
hy: {
  subtitle: "Խելացի միջոցառումների օգնական · Առցանց",
  newChat: "Նոր զրույց",
  greeting: "Բարև",
  welcome1: "Ես քո AI պլանավորիչն եմ — պատրաստ օգնելու, որ քո միջոցառումը լինի հենց այնպիսին, ինչպիսին պատկերացնում ես։",
  welcome2: "Պարզապես գրիր՝ ինչ միջոցառում է, որտեղ է, քանի հյուր ունես և ինչ ոճ ես ուզում,",
  welcome3: "մնացածը ես կկազմեմ քեզ համար",

  feat1Title: "Խելացի պլան",
  feat1Desc: "Քո միջոցառման համար ավտոմատ կազմված հստակ և ամբողջական քայլեր",
  feat1Msg: "Ստեղծիր խելացի պլան",

  feat2Title: "Գտիր լավագույններին",
  feat2Desc: "Իրական և ստուգված մատակարարներ քո քաղաքում՝ մի քանի վայրկյանում",
  feat2Msg: "Գտիր լավագույն մատակարարներին",

  feat3Title: "Մշակութային նրբություններ",
  feat3Desc: "Հայկական ավանդույթներ, խորհուրդներ և մանրամասներ, որպեսզի ոչինչ չմոռանաս",
  feat3Msg: "Պատմիր հայկական ավանդույթների մասին",

  placeholder: "Գրիր՝ ինչ ես ուզում կազմակերպել…",

  pill1: "Կցել",
  pill2: "Ավելացնել պլանին",
  pill3: "Տալ գաղափարներ",

  disclaimer: "AI-ը կարող է սխալվել · Միշտ ճշտիր մանրամասները մատակարարների հետ",

  quickStart: "Արագ սկիզբ",
  pickType: "Ընտրիր միջոցառման տեսակ",
  pickSub: "կամ պարզապես գրիր քո գաղափարը,\nու ես կկազմեմ ամբողջ պլանը",

  suggestions: [
    "Պլանավորել հարսանիք",
    "Պլանավորել ծննդյան օր",
    "Մկրտության գաղափարներ",
    "Կորպորատիվ միջոցառում"
  ],

  eventLabels: {
    christening: "Մկртут'yun", wedding: "Harsanik", birthday: "Tsnndyan or",
    kids_party: "Mankakan ton", corporate: "Korporativ", baby_shower: "Baby Shower",
    engagement: "Nshanadrutyun", graduation: "Avartakan", anniversary: "Tarelicord",
    atamhatik: "Atamhatik", gender_reveal: "Seki batsahaytyum",
    proposal: "Ambashnyum", romantic_dinner: "Romantik", store_opening: "Batsatyum",
    product_launch: "Launch", new_year_party: "Nor tari", house_party: "Tnain kapuyt",
    prom: "Avartakan ereko", school_event: "Dproci dzernakhumb",
  },

  catLabels: {
    religious: "Կրոնական",
    roles: "Կարևոր դերեր",
    clothing: "Հագուստ",
    ceremony: "Արարողություն",
    reception: "Ընդունելություն",
    celebration: "Տոնակատարություն",
    food: "Սնունդ և տորթ",
    decoration: "Դեկոր",
    media: "Լուսանկար և տեսանյութ",
    entertainment: "Ժամանց",
    attire: "Հագուստ",
    venue: "Վայր",
    tech: "Տեխնիկա և AV",
    other: "Այլ",
  },

  planningInProgress: "Պլանավորումը ընթացքի մեջ է",

  sendToVendors: "Ուղարկել մատակարարներին",
  share: "Կիսվել",

  guests: "հյուր",

  stillNeeded: "Մնում է կազմակերպել՝",
  optional: "ըստ ցանկության",

  find: "Գտնել",
  found: "գտնվել է",

  vendorProgress: "Մատակարարների առաջընթաց",
  confirmed: "հաստատված",
  stillNeededShort: "մնում է",

  timeline: "Ժամանակացույց",
  now: "Հիմա",
  progress: "Առաջընթաց",

  searching: "Որոնում…",
  vendorsFound: "մատակարար գտնվեց",

  searchForVendors: "Որոնել մատակարարներ",
  filterByName: "Ֆիլտրել անունով…",
  findingVendors: "Մատակարարներ են որոնվում…",
  noVendorsFound: "Մատակարարներ չեն գտնվել",
  searchAgain: "Կրկին որոնել",

  close: "Փակել",

  alreadySelected: "Արդեն ընտրված է — սեղմիր՝ հանելու համար",
  selectVendor: "Ընտրել այս մատակարարին",
  viewBizPage: "Դիտել էջը",
  noPhotos: "Պորտֆոլիոյի լուսանկարներ դեռ չկան",

  requestsSent: "Հարցումները ուղարկված են!",
  sentWithErrors: "Ուղարկվել է՝ որոշ սխալներով",

  sendInquiryAll: "Ուղարկել հարցում բոլոր մատակարարներին",
  vendorReplyNote: "Մատակարարները կպատասխանեն քո հարցումներին։ Կարող ես հետևել պատասխաններին հաղորդագրություններում։",

  viewInquiries: "Դիտել հարցումները",

  sending: "Ուղարկվում է…",
  cancel: "Չեղարկել",
  sent: "Ուղարկված",
  failed: "Չհաջողվեց",

  saveYourPlan: "Պահպանիր քո միջոցառման պլանը",
  freeAccount: "Անվճար հաշիվ — առանց քարտի",

  saveDesc: "Ստեղծիր անվճար հաշիվ, պահպանիր պլանը, գտիր մատակարարներ և վերահսկիր ամբողջ գործընթացը մեկ տեղում։",

  authFeature1: "Ավտոմատ կազմված ամբողջական պլան",
  authFeature2: "Գտիր և համեմատիր մատակարարներին քո քաղաքում",
  authFeature3: "Ամեն ինչ պահված է — շարունակիր այնտեղից, որտեղ կանգնել էիր",

  createFreeAccount: "Ստեղծել անվճար հաշիվ",
  signIn: "Արդեն ունե՞ս հաշիվ — Մուտք գործել",
  addService: "Ավելացնել ծառայություն",
  addServicePlaceholder: "օր.՝ Պաղպաղակ, Ֆոտո կրպակ…",
  removeService: "Հեռացնել",
  serviceTitles: {
    church: "Եկեղեցու ամրագրում", baptism_candle: "Մկրտության մոմ", cross: "Խաչ երեխայի համար",
    kavor: "Կավոր (Կնքհայր)", kavork: "Կավորք (Կնքամայր)", baby_outfit: "Սպիտակ հագուստ երեխայի համար",
    venue: "Վայր", catering: "Կերակրատեսակ", cake: "Տորթ", wedding_cake: "Հարսանեկան տորթ",
    photographer: "Լուսանկարիչ", videographer: "Վիդեո օպերատոր",
    decoration: "Դեկոր", balloon_decoration: "Փուչիկների դեկոր",
    flowers: "Ծաղիկներ", music: "Երաժշտություն / DJ", tamada: "Թամադա",
    wedding_rings: "Հարսանեկան մատանիներ", ring: "Նշանադրական մատանի", bridal_dress: "Հարսնազգեստ",
    ceremony_venue: "Արարողության վայր", reception_venue: "Ընդունելության սրահ",
    av_tech: "AV տեխնիկա", entertainment: "Ժամանցային ծրագիր", animator: "Մանկական անիմատոր",
  },
},



  ru: {
    subtitle: "Умный помощник для мероприятий · Онлайн",
    newChat: "Новый чат",
    greeting: "Привет!",
    welcome1: "Я твой AI-планировщик — готов помочь сделать твой праздник именно таким, каким ты его представляешь.",
    welcome2: "Просто скажи: какое мероприятие, где, сколько гостей и какой стиль хочешь,",
    welcome3: "остальное я сделаю за тебя",
    feat1Title: "Умный план",
    feat1Desc: "Чёткие и полные шаги для твоего мероприятия, составленные автоматически",
    feat1Msg: "Умный план",
    feat2Title: "Найди лучших",
    feat2Desc: "Реальные, проверенные поставщики в твоём городе — за секунды",
    feat2Msg: "Найди лучших",
    feat3Title: "Культурные тонкости",
    feat3Desc: "Армянские традиции, советы и детали, чтобы ничего не забыть",
    feat3Msg: "Культурные тонкости",
    placeholder: "Напиши, что хочешь организовать…",
    pill1: "Прикрепить",
    pill2: "Добавить в план",
    pill3: "Дай идеи",
    disclaimer: "AI иногда может ошибаться · Всегда уточняй детали у поставщиков",
    quickStart: "Быстрый старт",
    pickType: "Выбери тип мероприятия",
    pickSub: "или просто опиши свою идею,\\nи я составлю полный план",
    suggestions: ["Планировать свадьбу", "День рождения", "Крещение", "Корпоратив"],
    eventLabels: {
      christening: "Крещение", wedding: "Свадьба", birthday: "День рождения",
      kids_party: "Детский праздник", corporate: "Корпоратив", baby_shower: "Baby Shower",
      engagement: "Помолвка", graduation: "Выпускной", anniversary: "Юбилей",
      atamhatik: "Атамhатик", gender_reveal: "Гендер-пати",
      proposal: "Предложение руки", romantic_dinner: "Романтик",
      store_opening: "Открытие магазина", product_launch: "Запуск продукта",
      new_year_party: "Новый год", house_party: "Домашняя вечеринка",
      prom: "Выпускной вечер", school_event: "Школьное мероприятие",
    },
    catLabels: { religious: "Религиозное", roles: "Ключевые роли", clothing: "Одежда", ceremony: "Церемония", reception: "Приём", celebration: "Торжество", food: "Еда и торт", decoration: "Украшения", media: "Фото и видео", entertainment: "Развлечения", attire: "Наряды", venue: "Площадка", tech: "Техника и AV", other: "Прочее" },
    planningInProgress: "Планирование в процессе",
    sendToVendors: "Отправить поставщикам",
    share: "Поделиться",
    guests: "гостей",
    stillNeeded: "Ещё нужно:",
    optional: "необязательно",
    find: "Найти",
    found: "найдено",
    vendorProgress: "Прогресс по поставщикам",
    confirmed: "подтверждено",
    stillNeededShort: "ещё нужно",
    timeline: "Хронология",
    now: "Сейчас",
    progress: "Прогресс",
    searching: "Поиск…",
    vendorsFound: "поставщиков найдено",
    searchForVendors: "Поиск поставщиков",
    filterByName: "Фильтр по имени…",
    findingVendors: "Ищем поставщиков…",
    noVendorsFound: "Поставщики не найдены",
    searchAgain: "Искать снова",
    close: "Закрыть",
    alreadySelected: "Уже выбран — нажмите для отмены",
    selectVendor: "Выбрать этого поставщика",
    viewBizPage: "Смотреть страницу",
    noPhotos: "Фотографий портфолио пока нет",
    requestsSent: "Запросы отправлены!",
    sentWithErrors: "Отправлено с ошибками",
    sendInquiryAll: "Отправить запрос всем поставщикам",
    vendorReplyNote: "Поставщики ответят на твои запросы. Ты можешь следить за ними в сообщениях.",
    viewInquiries: "Посмотреть запросы",
    sending: "Отправка…",
    cancel: "Отмена",
    sent: "Отправлено",
    failed: "Ошибка",
    saveYourPlan: "Сохрани план мероприятия",
    freeAccount: "Бесплатный аккаунт — без карты",
    saveDesc: "Создай бесплатный аккаунт, чтобы сохранить план, получить предложения от поставщиков и отслеживать всё в одном месте.",
    authFeature1: "Полный чеклист, составленный автоматически",
    authFeature2: "Найди и сравни поставщиков в своём городе",
    authFeature3: "Всё сохранено — продолжи с того места",
    createFreeAccount: "Создать аккаунт бесплатно",
    signIn: "Уже есть аккаунт? Войти",
    addService: "Добавить услугу",
    addServicePlaceholder: "напр. Мороженое, Фотобудка…",
    removeService: "Удалить",
    serviceTitles: {
      church: "Бронирование церкви", baptism_candle: "Крестильная свеча", cross: "Крестик для малыша",
      kavor: "Крёстный отец (Каvor)", kavork: "Крёстная мать (Кавork)", baby_outfit: "Белый наряд для малыша",
      venue: "Площадка", catering: "Кейтеринг", cake: "Торт", wedding_cake: "Свадебный торт",
      photographer: "Фотограф", videographer: "Видеограф",
      decoration: "Украшения", balloon_decoration: "Воздушные шары",
      flowers: "Цветы", music: "Музыка / DJ", tamada: "Тамада",
      wedding_rings: "Обручальные кольца", ring: "Помолвочное кольцо", bridal_dress: "Свадебное платье",
      ceremony_venue: "Место церемонии", reception_venue: "Банкетный зал",
      av_tech: "AV-техника", entertainment: "Развлечения", animator: "Детский аниматор",
    },
  },
};
const tx = (lang) => T[lang] || T.en;


/* ─────────────────────────────────────────
   ICON MAPS
───────────────────────────────────────── */
const SERVICE_ICON_MAP = {
  church: Building, baptism_candle: Flame, cross: Plus,
  kavor: User, kavork: User, baby_outfit: Package,
  venue: Building2, catering: UtensilsCrossed, cake: Cake,
  wedding_cake: Cake, photographer: Camera, videographer: Video,
  decoration: Sparkles, balloon_decoration: Sparkles,
  flowers: Flower2, music: Music, tamada: Mic, wedding_rings: Gem,
  ring: Gem, bridal_dress: Gem, ceremony_venue: Building,
  reception_venue: Building2, av_tech: Monitor,
  entertainment: Music, animator: Smile,
};
const getServiceIcon = (type, props = {}) => {
  const Icon = SERVICE_ICON_MAP[type] || Star;
  return <Icon {...props} />;
};

const EVENT_ICON_MAP = {
  christening: Building, wedding: Gem, birthday: Cake,
  kids_party: Smile, corporate: Briefcase, engagement: Heart,
  anniversary: Star, baby_shower: Baby, graduation: GraduationCap,
  atamhatik: Building, gender_reveal: Baby, proposal: Gem,
  romantic_dinner: Heart, store_opening: Building2, product_launch: Zap,
  new_year_party: Sparkles, house_party: Smile, prom: GraduationCap,
  school_event: GraduationCap,
};
const getEventIcon = (type, props = {}) => {
  const Icon = EVENT_ICON_MAP[type] || Star;
  return <Icon {...props} />;
};

const CATEGORY_LABELS = {
  religious: "Religious", roles: "Key Roles", clothing: "Attire",
  ceremony: "Ceremony", reception: "Reception", celebration: "Celebration",
  food: "Food & Cake", decoration: "Decorations", media: "Photo & Video",
  entertainment: "Entertainment", attire: "Attire", venue: "Venue",
  tech: "Tech & AV", other: "Other",
};

/* ─────────────────────────────────────────
   EVENT TEMPLATES
───────────────────────────────────────── */
const EVENT_TEMPLATES = {
  christening: {
    label: "Christening / Baptism", accent: "#e11d5c",
    gradient: "linear-gradient(135deg,#e11d5c,#f43f5e)",
    services: [
      { service_type: "church",         title: "Church Booking",              category: "religious",   required: true },
      { service_type: "baptism_candle", title: "Baptism Candle (Knonki Mom)", category: "religious",   required: true },
      { service_type: "cross",          title: "Cross Necklace for Baby",     category: "religious",   required: true },
      { service_type: "kavor",          title: "Godfather (Kavor)",           category: "roles",       required: true },
      { service_type: "kavork",         title: "Godmother (Kavork)",          category: "roles",       required: true },
      { service_type: "baby_outfit",    title: "White Baby Outfit",           category: "clothing",    required: true },
      { service_type: "venue",          title: "Celebration Venue",           category: "celebration", required: true,  canSearch: true },
      { service_type: "catering",       title: "Food & Catering",             category: "celebration", required: true,  canSearch: true },
      { service_type: "cake",           title: "Christening Cake",            category: "celebration", required: true,  canSearch: true },
      { service_type: "photographer",   title: "Photographer",                category: "media",       required: true,  canSearch: true },
      { service_type: "decoration",     title: "Decorations",                 category: "celebration", required: false, canSearch: true },
    ],
  },
  wedding: {
    label: "Wedding", accent: "#e11d5c",
    gradient: "linear-gradient(135deg,#e11d5c,#f97316)",
    services: [
      { service_type: "ceremony_venue",  title: "Ceremony Venue",  category: "ceremony",      required: true },
      { service_type: "reception_venue", title: "Reception Hall",  category: "reception",     required: true, canSearch: true },
      { service_type: "tamada",          title: "Tamada (MC)",     category: "entertainment", required: true },
      { service_type: "wedding_rings",   title: "Wedding Rings",   category: "ceremony",      required: true },
      { service_type: "bridal_dress",    title: "Bridal Gown",     category: "attire",        required: true },
      { service_type: "wedding_cake",    title: "Wedding Cake",    category: "food",          required: true, canSearch: true },
      { service_type: "catering",        title: "Catering",        category: "food",          required: true, canSearch: true },
      { service_type: "photographer",    title: "Photographer",    category: "media",         required: true, canSearch: true },
      { service_type: "videographer",    title: "Videographer",    category: "media",         required: true, canSearch: true },
      { service_type: "flowers",         title: "Bridal Flowers",  category: "decoration",    required: true, canSearch: true },
      { service_type: "music",           title: "DJ / Live Music", category: "entertainment", required: true, canSearch: true },
    ],
  },
  birthday: {
    label: "Birthday Party", accent: "#3b82f6",
    gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    services: [
      { service_type: "cake",               title: "Birthday Cake",       category: "food",          required: true,  canSearch: true },
      { service_type: "venue",              title: "Venue",               category: "celebration",   required: true },
      { service_type: "catering",           title: "Catering",            category: "food",          required: true,  canSearch: true },
      { service_type: "balloon_decoration", title: "Balloon Decorations", category: "decoration",    required: true,  canSearch: true },
      { service_type: "music",              title: "Music / DJ",          category: "entertainment", required: false, canSearch: true },
      { service_type: "photographer",       title: "Photographer",        category: "media",         required: false, canSearch: true },
    ],
  },
  kids_party: {
    label: "Kids' Party", accent: "#10b981",
    gradient: "linear-gradient(135deg,#10b981,#059669)",
    services: [
      { service_type: "cake",               title: "Themed Cake",            category: "food",          required: true,  canSearch: true },
      { service_type: "balloon_decoration", title: "Balloon Decorations",    category: "decoration",    required: true,  canSearch: true },
      { service_type: "animator",           title: "Kids Animator",          category: "entertainment", required: true,  canSearch: true },
      { service_type: "venue",              title: "Venue",                  category: "celebration",   required: true },
      { service_type: "catering",           title: "Kids-Friendly Catering", category: "food",          required: true,  canSearch: true },
      { service_type: "decoration",         title: "Theme Decorations",      category: "decoration",    required: true,  canSearch: true },
      { service_type: "photographer",       title: "Photographer",           category: "media",         required: false, canSearch: true },
    ],
  },
  corporate: {
    label: "Corporate Event", accent: "#475569",
    gradient: "linear-gradient(135deg,#475569,#1e293b)",
    services: [
      { service_type: "venue",         title: "Conference / Event Venue", category: "venue",         required: true },
      { service_type: "catering",      title: "Catering & Coffee Breaks", category: "food",          required: true,  canSearch: true },
      { service_type: "av_tech",       title: "AV & Tech Setup",          category: "tech",          required: true },
      { service_type: "photographer",  title: "Event Photographer",       category: "media",         required: true,  canSearch: true },
      { service_type: "entertainment", title: "Evening Entertainment",    category: "entertainment", required: false, canSearch: true },
    ],
  },
  engagement: {
    label: "Engagement Party", accent: "#8b5cf6",
    gradient: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
    services: [
      { service_type: "ring",         title: "Engagement Ring", category: "ceremony",    required: true },
      { service_type: "flowers",      title: "Flowers",         category: "decoration",  required: true, canSearch: true },
      { service_type: "photographer", title: "Photographer",    category: "media",       required: true, canSearch: true },
      { service_type: "venue",        title: "Party Venue",     category: "celebration", required: true },
      { service_type: "cake",         title: "Engagement Cake", category: "food",        required: true, canSearch: true },
      { service_type: "catering",     title: "Food & Drinks",   category: "food",        required: true, canSearch: true },
    ],
  },
  anniversary: {
    label: "Anniversary", accent: "#d97706",
    gradient: "linear-gradient(135deg,#f59e0b,#d97706)",
    services: [
      { service_type: "flowers",      title: "Flower Arrangement", category: "decoration",  required: true, canSearch: true },
      { service_type: "venue",        title: "Restaurant / Venue", category: "celebration", required: true },
      { service_type: "cake",         title: "Anniversary Cake",   category: "food",        required: true, canSearch: true },
      { service_type: "catering",     title: "Dinner / Catering",  category: "food",        required: true, canSearch: true },
      { service_type: "photographer", title: "Photographer",       category: "media",       required: false, canSearch: true },
    ],
  },
  baby_shower: {
    label: "Baby Shower", accent: "#0ea5e9",
    gradient: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
    services: [
      { service_type: "balloon_decoration", title: "Balloon Decorations",    category: "decoration", required: true,  canSearch: true },
      { service_type: "cake",               title: "Baby Shower Cake",       category: "food",       required: true,  canSearch: true },
      { service_type: "catering",           title: "Finger Food / Catering", category: "food",       required: true,  canSearch: true },
      { service_type: "decoration",         title: "Theme Decorations",      category: "decoration", required: true,  canSearch: true },
      { service_type: "photographer",       title: "Photographer",           category: "media",      required: false, canSearch: true },
    ],
  },
  graduation: {
    label: "Graduation Party", accent: "#ea580c",
    gradient: "linear-gradient(135deg,#f59e0b,#ea580c)",
    services: [
      { service_type: "venue",              title: "Venue",            category: "celebration", required: true },
      { service_type: "cake",               title: "Graduation Cake",  category: "food",        required: true,  canSearch: true },
      { service_type: "catering",           title: "Catering",         category: "food",        required: true,  canSearch: true },
      { service_type: "balloon_decoration", title: "Balloons & Decor", category: "decoration",  required: false, canSearch: true },
      { service_type: "photographer",       title: "Photographer",     category: "media",       required: false, canSearch: true },
    ],
  },
};

/* ─────────────────────────────────────────
   SERVICE CATALOG  — single source of truth
───────────────────────────────────────── */
const SERVICE_CATALOG = {
  // Food & Cake
  cake:               { title: { en: "Cake",                  hy: "Տորթ",                       ru: "Торт" },                          category: "food",          canSearch: true  },
  wedding_cake:       { title: { en: "Wedding Cake",          hy: "Հարսանեկան տորթ",             ru: "Свадебный торт" },                category: "food",          canSearch: true  },
  catering:           { title: { en: "Catering",              hy: "Կերակուր",                    ru: "Кейтеринг" },                     category: "food",          canSearch: true  },
  kids_menu:          { title: { en: "Kids Menu",             hy: "Մանկական մենյու",             ru: "Детское меню" },                  category: "food",          canSearch: true  },
  dessert_table:      { title: { en: "Dessert Table",         hy: "Հյուրասիրություն",            ru: "Десертный стол" },                category: "food",          canSearch: true  },
  // Decoration
  balloon_decoration: { title: { en: "Balloon Decoration",   hy: "Փուչիկների դեկոր",           ru: "Оформление шарами" },             category: "decoration",    canSearch: true  },
  decoration:         { title: { en: "Decorations",           hy: "Դեկոր",                       ru: "Украшения" },                     category: "decoration",    canSearch: true  },
  flowers:            { title: { en: "Flowers",               hy: "Ծաղիկներ",                    ru: "Цветы" },                         category: "decoration",    canSearch: true  },
  theme_decoration:   { title: { en: "Theme Decorations",    hy: "Թեմատիկ դեկոր",              ru: "Тематический декор" },            category: "decoration",    canSearch: true  },
  // Entertainment
  animator:           { title: { en: "Kids Animator",        hy: "Մանկական անիմատոր",          ru: "Детский аниматор" },              category: "entertainment", canSearch: true  },
  music:              { title: { en: "Music / DJ",           hy: "Երաժշտություն / DJ",           ru: "Музыка / DJ" },                   category: "entertainment", canSearch: true  },
  tamada:             { title: { en: "Tamada (MC)",          hy: "Թամադա",                       ru: "Тамада" },                        category: "entertainment", canSearch: true  },
  entertainment:      { title: { en: "Entertainment",         hy: "Ժամանց",                      ru: "Развлечения" },                   category: "entertainment", canSearch: true  },
  magician:           { title: { en: "Magician",              hy: "Կախարդ",                      ru: "Фокусник" },                      category: "entertainment", canSearch: true  },
  face_painting:      { title: { en: "Face Painting",        hy: "Դիմածաղկում",                 ru: "Аквагрим" },                      category: "entertainment", canSearch: true  },
  mascot_character:   { title: { en: "Mascot Character",     hy: "Մուլտheros",                  ru: "Ростовая кукла" },                category: "entertainment", canSearch: true  },
  bubble_show:        { title: { en: "Bubble Show",          hy: "Փուչիկների շոու",             ru: "Шоу мыльных пузырей" },          category: "entertainment", canSearch: true  },
  play_zone:          { title: { en: "Play Zone",            hy: "Խաղահրապարակ",                ru: "Игровая зона" },                  category: "entertainment", canSearch: true  },
  photo_booth:        { title: { en: "Photo Booth",          hy: "Ֆոտո կրպակ",                  ru: "Фотобудка" },                     category: "entertainment", canSearch: true  },
  // Media
  photographer:       { title: { en: "Photographer",          hy: "Լուսանկարիչ",                 ru: "Фотограф" },                      category: "media",         canSearch: true  },
  videographer:       { title: { en: "Videographer",          hy: "Վիդեո օperate",              ru: "Видеограф" },                     category: "media",         canSearch: true  },
  // Venue
  venue:              { title: { en: "Venue",                  hy: "Վայр",                        ru: "Площадка" },                      category: "venue",         canSearch: true  },
  reception_venue:    { title: { en: "Reception Hall",        hy: "Ընդunelution սرahel",         ru: "Банкетный зал" },                category: "venue",         canSearch: true  },
  ceremony_venue:     { title: { en: "Ceremony Venue",        hy: "Արaroğel Venue",              ru: "Место церемонии" },               category: "ceremony",      canSearch: false },
  // Religious / Roles
  church:             { title: { en: "Church Booking",        hy: "Եkleghetsio amsagroom",       ru: "Бронирование церкви" },           category: "religious",     canSearch: false },
  baptism_candle:     { title: { en: "Baptism Candle",        hy: "Mkrtутюн mom",               ru: "Крестильная свеча" },             category: "religious",     canSearch: false },
  cross:              { title: { en: "Cross for Baby",        hy: "Khach yerekhayi hamar",       ru: "Крестик для малыша" },            category: "religious",     canSearch: false },
  kavor:              { title: { en: "Godfather (Kavor)",     hy: "Կavор",                       ru: "Крёстный отец" },                 category: "roles",         canSearch: false },
  kavork:             { title: { en: "Godmother (Kavork)",    hy: "Կavork",                      ru: "Крёстная мать" },                 category: "roles",         canSearch: false },
  baby_outfit:        { title: { en: "White Baby Outfit",     hy: "Spitakaguyni yerekhayi",      ru: "Белый наряд малыша" },            category: "clothing",      canSearch: false },
  // Attire / Ceremony
  wedding_rings:      { title: { en: "Wedding Rings",         hy: "Harsanaknagan mataniNER",     ru: "Обручальные кольца" },            category: "ceremony",      canSearch: false },
  bridal_dress:       { title: { en: "Bridal Gown",           hy: "Harsnazkest",                 ru: "Свадебное платье" },              category: "attire",        canSearch: true  },
  ring:               { title: { en: "Engagement Ring",       hy: "Nshanadrik matani",           ru: "Помолвочное кольцо" },            category: "ceremony",      canSearch: false },
  av_tech:            { title: { en: "AV & Tech Setup",       hy: "AV tekhnika",                 ru: "AV-техника" },                   category: "tech",          canSearch: true  },
  gift_boxes:         { title: { en: "Gift Boxes",            hy: "Nver tufner",                 ru: "Подарочные коробки" },            category: "other",         canSearch: true  },
};

/* Helper: get localised title from SERVICE_CATALOG */
function getSvcTitle(serviceType, lang) {
  const entry = SERVICE_CATALOG[serviceType];
  if (!entry) return serviceType.replace(/_/g, " ");
  return entry.title[lang] || entry.title.en || serviceType.replace(/_/g, " ");
}

/* Helper: build a service object merging EVENT_TEMPLATES data with SERVICE_CATALOG */
function buildService(serviceType, overrides = {}, lang = "en") {
  const cat = SERVICE_CATALOG[serviceType];
  return {
    service_type: serviceType,
    title: getSvcTitle(serviceType, lang),
    category: cat?.category || "other",
    canSearch: cat?.canSearch ?? false,
    required: false,
    status: "pending",
    ...overrides,
  };
}

/* ─────────────────────────────────────────
   EVENT TEMPLATES V2  — references SERVICE_CATALOG
───────────────────────────────────────── */
const EVENT_TEMPLATES_V2 = {
  christening: {
    accent: "#e11d5c", gradient: "linear-gradient(135deg,#e11d5c,#f43f5e)",
    defaultServices:  ["church","baptism_candle","cross","kavor","kavork","baby_outfit","venue","catering","cake","photographer","decoration"],
    optionalServices: ["videographer","balloon_decoration","flowers"],
    requiredInfo:     ["guest_count","date","location"],
  },
  wedding: {
    accent: "#e11d5c", gradient: "linear-gradient(135deg,#e11d5c,#f97316)",
    defaultServices:  ["ceremony_venue","reception_venue","tamada","wedding_rings","bridal_dress","wedding_cake","catering","photographer","videographer","flowers","music"],
    optionalServices: ["decoration","balloon_decoration","dessert_table","entertainment","av_tech"],
    requiredInfo:     ["guest_count","date","location","budget"],
  },
  birthday: {
    accent: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    defaultServices:  ["cake","venue","catering","balloon_decoration","decoration"],
    optionalServices: ["photographer","music","entertainment","photo_booth","dessert_table"],
    requiredInfo:     ["guest_count","date","location","budget"],
  },
  kids_party: {
    accent: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)",
    defaultServices:  ["cake","balloon_decoration","animator","kids_menu","theme_decoration","photographer"],
    optionalServices: ["mascot_character","face_painting","bubble_show","photo_booth","gift_boxes","magician","play_zone"],
    requiredInfo:     ["child_age","guest_count","date","location","budget"],
  },
  corporate: {
    accent: "#475569", gradient: "linear-gradient(135deg,#475569,#1e293b)",
    defaultServices:  ["venue","catering","av_tech","photographer"],
    optionalServices: ["entertainment","music","decoration","videographer","tamada"],
    requiredInfo:     ["guest_count","date","location","budget"],
  },
  engagement: {
    accent: "#8b5cf6", gradient: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
    defaultServices:  ["ring","flowers","photographer","venue","cake","catering"],
    optionalServices: ["videographer","balloon_decoration","decoration","music","dessert_table"],
    requiredInfo:     ["date","location","budget"],
  },
  anniversary: {
    accent: "#d97706", gradient: "linear-gradient(135deg,#f59e0b,#d97706)",
    defaultServices:  ["flowers","venue","cake","catering"],
    optionalServices: ["photographer","videographer","decoration","music","dessert_table"],
    requiredInfo:     ["guest_count","date","location","budget"],
  },
  baby_shower: {
    accent: "#0ea5e9", gradient: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
    defaultServices:  ["balloon_decoration","cake","catering","decoration"],
    optionalServices: ["photographer","dessert_table","gift_boxes","photo_booth"],
    requiredInfo:     ["guest_count","date","location"],
  },
  graduation: {
    accent: "#ea580c", gradient: "linear-gradient(135deg,#f59e0b,#ea580c)",
    defaultServices:  ["venue","cake","catering"],
    optionalServices: ["balloon_decoration","photographer","music","entertainment","dessert_table"],
    requiredInfo:     ["guest_count","date","location","budget"],
  },
  atamhatik: {
    accent: "#e11d5c", gradient: "linear-gradient(135deg,#e11d5c,#f97316)",
    defaultServices:  ["church","venue","catering","cake","photographer","decoration"],
    optionalServices: ["videographer","flowers","balloon_decoration","entertainment"],
    requiredInfo:     ["guest_count","date","location"],
  },
  gender_reveal: {
    accent: "#ec4899", gradient: "linear-gradient(135deg,#ec4899,#3b82f6)",
    defaultServices:  ["balloon_decoration","cake","decoration","catering"],
    optionalServices: ["photographer","dessert_table","gift_boxes","photo_booth"],
    requiredInfo:     ["guest_count","date","location"],
  },
  proposal: {
    accent: "#e11d5c", gradient: "linear-gradient(135deg,#e11d5c,#9333ea)",
    defaultServices:  ["flowers","ring","venue"],
    optionalServices: ["photographer","dessert_table","music","decoration"],
    requiredInfo:     ["date","location","budget"],
  },
  romantic_dinner: {
    accent: "#dc2626", gradient: "linear-gradient(135deg,#dc2626,#e11d5c)",
    defaultServices:  ["venue","flowers","catering"],
    optionalServices: ["photographer","music","decoration","dessert_table"],
    requiredInfo:     ["date","location","budget"],
  },
  store_opening: {
    accent: "#f97316", gradient: "linear-gradient(135deg,#f97316,#eab308)",
    defaultServices:  ["decoration","catering","photographer"],
    optionalServices: ["balloon_decoration","music","entertainment","flowers","av_tech","videographer"],
    requiredInfo:     ["date","location"],
  },
  product_launch: {
    accent: "#6366f1", gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    defaultServices:  ["venue","decoration","catering","av_tech","photographer"],
    optionalServices: ["videographer","entertainment","balloon_decoration","tamada"],
    requiredInfo:     ["guest_count","date","location"],
  },
  new_year_party: {
    accent: "#1d4ed8", gradient: "linear-gradient(135deg,#1d4ed8,#7c3aed)",
    defaultServices:  ["venue","catering","decoration","music","photographer"],
    optionalServices: ["cake","balloon_decoration","entertainment","photo_booth","dessert_table","tamada"],
    requiredInfo:     ["guest_count","date","location","budget"],
  },
  house_party: {
    accent: "#16a34a", gradient: "linear-gradient(135deg,#16a34a,#15803d)",
    defaultServices:  ["catering","decoration","music"],
    optionalServices: ["cake","balloon_decoration","photographer","entertainment","dessert_table"],
    requiredInfo:     ["guest_count","date","budget"],
  },
  prom: {
    accent: "#7c3aed", gradient: "linear-gradient(135deg,#7c3aed,#db2777)",
    defaultServices:  ["venue","catering","decoration","music","photographer"],
    optionalServices: ["cake","balloon_decoration","entertainment","photo_booth","videographer","tamada"],
    requiredInfo:     ["guest_count","date","location","budget"],
  },
  school_event: {
    accent: "#0284c7", gradient: "linear-gradient(135deg,#0284c7,#0ea5e9)",
    defaultServices:  ["venue","catering","decoration","photographer"],
    optionalServices: ["cake","balloon_decoration","entertainment","music","av_tech"],
    requiredInfo:     ["guest_count","date","location"],
  },
};

/* Build full services array for an event type from V2 template */
function buildServicesFromTemplate(eventKey, lang = "en") {
  const tpl = EVENT_TEMPLATES_V2[eventKey];
  if (!tpl) return [];
  return [
    ...(tpl.defaultServices || []).map(key => buildService(key, { required: true,  status: "pending" }, lang)),
    ...(tpl.optionalServices || []).map(key => buildService(key, { required: false, status: "suggested" }, lang)),
  ];
}

/* ─────────────────────────────────────────
   SERVICE RULES  — smart dependency logic
───────────────────────────────────────── */
const SERVICE_RULES = [
  // Food-triggered suggestions
  { if: { service: "cake",    event_type: "kids_party" },  suggest: ["balloon_decoration","kids_menu","photographer"] },
  { if: { service: "cake",    event_type: "birthday" },    suggest: ["balloon_decoration","photographer"] },
  { if: { service: "catering" },                           suggest: ["decoration","photographer"] },
  { if: { service: "wedding_cake" },                       suggest: ["catering","flowers","decoration"] },
  // Venue-triggered suggestions
  { if: { service: "venue" },                              suggest: ["decoration","catering","music"] },
  { if: { service: "reception_venue" },                    suggest: ["catering","decoration","tamada","music"] },
  // Guest count rules
  { if: { guest_count_gt: 50 },                            suggest: ["catering","tamada","photographer","av_tech"] },
  { if: { guest_count_gt: 20 },                            suggest: ["catering","photographer"] },
  // Urgency rules
  { if: { event_date_within_days: 3 },                     priority: "urgent", suggest: ["available_today_vendors"] },
  { if: { event_date_within_days: 7 },                     priority: "high",   suggest: ["photographer","catering","cake"] },
  // Armenian cultural additions
  { if: { event_type: "christening" },                     suggest: ["kavor","kavork","church","baptism_candle"] },
  { if: { event_type: "wedding" },                         suggest: ["tamada","flowers","wedding_rings"] },
];

/* ─────────────────────────────────────────
   BUDGET PRESETS
───────────────────────────────────────── */
const BUDGET_TIERS = {
  low:     { max: 100000,  label: { en: "Budget-friendly",  hy: "Խnayamատ",       ru: "Эконом" } },
  medium:  { max: 300000,  label: { en: "Mid-range",        hy: "Mittler",         ru: "Средний" } },
  premium: { max: 800000,  label: { en: "Premium",          hy: "Բарձ",            ru: "Премиум" } },
  luxury:  { max: Infinity, label: { en: "Luxury",           hy: "Luxe",            ru: "Люкс" } },
};

const BUDGET_SERVICE_FILTER = {
  low:     (s) => ["cake","balloon_decoration","decoration","catering","photographer"].includes(s.service_type),
  medium:  () => true,
  premium: () => true,
  luxury:  () => true,
};

/* ─────────────────────────────────────────
   ACTION PROCESSOR
───────────────────────────────────────── */
function applyActions(actions, prev, lang = "en") {
  let state = { ...prev };
  const searches = [];
  for (const a of actions) {
    switch (a.type) {
      case "set_event_type": {
        if (state.event_type === a.event_type) break;
        // Try V2 template first, fall back to legacy
        const tplV2 = EVENT_TEMPLATES_V2[a.event_type];
        const tplLegacy = EVENT_TEMPLATES[a.event_type];
        const accent   = tplV2?.accent   || tplLegacy?.accent   || C.brand;
        const gradient = tplV2?.gradient || tplLegacy?.gradient || null;
        const label    = tplLegacy?.label || a.event_type_label || a.event_type.replace(/_/g, " ");
        const services = state.services?.length
          ? state.services
          : tplV2
            ? buildServicesFromTemplate(a.event_type, lang)
            : (tplLegacy?.services || []).map(s => ({ ...s, status: "pending" }));
        state = { ...state, event_type: a.event_type, event_type_label: label, accent, gradient, services };
        break;
      }
      case "set_guest_count": state = { ...state, guest_count: a.guest_count }; break;
      case "set_location":    state = { ...state, city: a.city }; break;
      case "set_event_date":  state = { ...state, date: a.date }; break;
      case "set_budget":      state = { ...state, budget: { description: a.description, budget_level: a.budget_level } }; break;
      case "set_style":       state = { ...state, style: a.style }; break;
      case "set_notes":       state = { ...state, notes: a.notes }; break;
      case "add_service": {
        if (state.services?.find(s => s.service_type === a.service_type)) break;
        const catalogEntry = SERVICE_CATALOG[a.service_type];
        const newSvc = {
          service_type: a.service_type,
          title: a.title || getSvcTitle(a.service_type, lang),
          category: a.category || catalogEntry?.category || "other",
          required: a.priority === "required",
          status: "pending",
          canSearch: a.canSearch ?? catalogEntry?.canSearch ?? true,
        };
        state = { ...state, services: [...(state.services || []), newSvc] };
        break;
      }
      // suggest_service: adds to list as optional/suggested (not required)
      case "suggest_service": {
        if (state.services?.find(s => s.service_type === a.service_type)) break;
        const catalogEntry = SERVICE_CATALOG[a.service_type];
        if (!catalogEntry) break; // only suggest known catalog services
        const sugSvc = buildService(a.service_type, { required: false, status: "suggested" }, lang);
        state = { ...state, services: [...(state.services || []), sugSvc] };
        break;
      }
      case "remove_service":
        state = { ...state, services: (state.services || []).filter(s => s.service_type !== a.service_type) }; break;
      case "mark_required_item":
      case "mark_optional_item": {
        const itType = a.item_type || a.service_type;
        if (!state.services?.find(s => s.service_type === itType)) {
          const catalogEntry = SERVICE_CATALOG[itType];
          state = { ...state, services: [...(state.services || []), {
            service_type: itType,
            title: a.title || getSvcTitle(itType, lang),
            category: a.category || catalogEntry?.category || "other",
            required: a.type === "mark_required_item",
            status: "pending",
            canSearch: catalogEntry?.canSearch ?? false,
          }]};
        }
        break;
      }
      case "search_vendors":
        searches.push(a);
        state = { ...state, services: (state.services || []).map(s => s.service_type === a.service_type ? { ...s, searching: true } : s) };
        break;
      case "select_vendor":
        state = {
          ...state,
          selected_vendors: { ...state.selected_vendors, [a.service_type]: { id: a.vendor_id, name: a.vendor_name } },
          services: (state.services || []).map(s => s.service_type === a.service_type ? { ...s, status: "selected", searching: false } : s),
        };
        break;
      case "unselect_vendor": {
        const sv = { ...state.selected_vendors }; delete sv[a.service_type];
        state = { ...state, selected_vendors: sv, services: (state.services || []).map(s => s.service_type === a.service_type ? { ...s, status: "pending" } : s) };
        break;
      }
      default: break;
    }
  }
  return { state, searches };
}

/* ─────────────────────────────────────────
   SERVICE RULES EVALUATOR
───────────────────────────────────────── */
function applyServiceRules(state, lang = "en") {
  const currentTypes = new Set((state.services || []).map(s => s.service_type));
  const toAdd = [];

  // Parse event date to compute urgency
  let daysUntilEvent = Infinity;
  if (state.date) {
    const diff = new Date(state.date) - Date.now();
    daysUntilEvent = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  for (const rule of SERVICE_RULES) {
    const cond = rule.if;
    let matches = true;

    if (cond.service && !currentTypes.has(cond.service)) matches = false;
    if (cond.event_type && state.event_type !== cond.event_type) matches = false;
    if (cond.guest_count_gt && (!(state.guest_count > cond.guest_count_gt))) matches = false;
    if (cond.event_date_within_days && daysUntilEvent > cond.event_date_within_days) matches = false;

    if (!matches) continue;

    for (const svcKey of (rule.suggest || [])) {
      if (svcKey === "available_today_vendors") continue; // handled separately
      if (!currentTypes.has(svcKey) && !toAdd.find(s => s.service_type === svcKey)) {
        const catalogEntry = SERVICE_CATALOG[svcKey];
        if (catalogEntry) {
          toAdd.push(buildService(svcKey, { required: false, status: "suggested" }, lang));
          currentTypes.add(svcKey);
        }
      }
    }
  }

  if (!toAdd.length) return state;
  return { ...state, services: [...(state.services || []), ...toAdd] };
}

/* Compute missing required info for the current event type */
function getMissingInfo(state) {
  const tpl = EVENT_TEMPLATES_V2[state.event_type];
  if (!tpl) return [];
  const required = tpl.requiredInfo || [];
  const missing = [];
  if (required.includes("guest_count") && !state.guest_count) missing.push("guest_count");
  if (required.includes("date") && !state.date) missing.push("date");
  if (required.includes("location") && !state.city) missing.push("location");
  if (required.includes("budget") && !state.budget) missing.push("budget");
  if (required.includes("child_age") && !state.age) missing.push("child_age");
  return missing;
}

/* ─────────────────────────────────────────
   SUGGESTION GENERATOR
───────────────────────────────────────── */
function getContextSuggestions(eventState, lang = "en") {
  if (!eventState.event_type) {
    return tx(lang).suggestions;
  }
  const missing = getMissingInfo(eventState);
  if (missing.includes("guest_count") && missing.includes("date")) {
    return ["How many guests?", "When is the event?", "What's my budget?"];
  }
  if (missing.includes("date")) return ["When is the event?", "Set the location", "What do I need?"];
  if (missing.includes("location")) return ["Event is in Yerevan", "Set location", "Show checklist"];
  if (missing.includes("guest_count")) return ["About 20 guests", "About 50 guests", "Over 100 guests"];
  if (missing.includes("budget")) return ["Budget-friendly plan", "Mid-range", "Premium options"];
  // Urgent — event within 7 days
  if (eventState.date) {
    const daysLeft = Math.ceil((new Date(eventState.date) - Date.now()) / 86400000);
    if (daysLeft <= 7 && daysLeft > 0) {
      const needed = (eventState.services || []).filter(s => s.canSearch && !eventState.selected_vendors?.[s.service_type] && !s.searching);
      if (needed.length) return [`Find ${needed[0].title} urgently`, "Who's available this week?", "What's still missing?"];
    }
  }
  const needed = (eventState.services || []).filter(
    s => s.canSearch && !eventState.selected_vendors?.[s.service_type] && !s.searching && s.status !== "suggested"
  );
  if (needed.length > 0) {
    const chips = [`Find ${needed[0].title}`];
    if (needed[1]) chips.push(`Find ${needed[1].title}`);
    chips.push("What's left to book?");
    return chips;
  }
  const suggested = (eventState.services || []).filter(s => s.status === "suggested" && s.canSearch);
  if (suggested.length > 0) return [`Add ${suggested[0].title}?`, "Budget breakdown?", "Share my plan"];
  return ["Add more services", "Budget breakdown?", "Share my plan"];
}

/* ─────────────────────────────────────────
   BOT AVATAR  (small orb for chat)
───────────────────────────────────────── */
function BotAvatar({ size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "radial-gradient(circle at 32% 28%, #fda4af 0%, #f43f5e 40%, #e11d5c 70%, #9f1239 100%)",
      boxShadow: "0 2px 10px rgba(225,29,92,0.3)", overflow: "hidden", position: "relative",
    }}>
      <div style={{ position: "absolute", top: "12%", left: "16%", width: "36%", height: "30%", borderRadius: "50%", background: "rgba(255,255,255,0.35)", filter: "blur(2px)" }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   ORB LARGE  (welcome screen)
───────────────────────────────────────── */
function OrbLarge({ size = 68 }) {
  return (
    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: size, height: size, borderRadius: "50%", position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: -size * 0.25, borderRadius: "50%", background: "radial-gradient(circle,rgba(225,29,92,0.15) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "radial-gradient(circle at 35% 28%,#fda4af 0%,#f43f5e 35%,#e11d5c 62%,#9f1239 100%)", boxShadow: `0 0 ${size * 0.4}px rgba(225,29,92,0.4),0 ${size * 0.15}px ${size * 0.4}px rgba(0,0,0,0.1)`, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: "12%", left: "18%", width: "38%", height: "32%", borderRadius: "50%", background: "rgba(255,255,255,0.35)", filter: "blur(4px)", transform: "rotate(-25deg)" }} />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   TYPING INDICATOR
───────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 18 }}>
      <BotAvatar />
      <div style={{ paddingBottom: 2 }}>
        <div style={{ fontSize: 11, color: C.text3, marginBottom: 5, fontWeight: 500 }}>Salooote AI</div>
        <div style={{ display: "flex", gap: 5, padding: "10px 14px", background: C.botBg, border: `1px solid ${C.border}`, borderRadius: "18px 18px 18px 4px", width: "fit-content", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          {[0, 0.15, 0.3].map((d, i) => (
            <motion.span key={i}
              animate={{ y: [0, -4, 0], opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 0.65, repeat: Infinity, delay: d, ease: "easeInOut" }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: C.grad, display: "block" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SUGGESTION CHIP
───────────────────────────────────────── */
function SuggestionChip({ text, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => onClick(text)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? `${C.brand}08` : "transparent",
        border: `1px solid ${hov ? C.brand + "44" : C.borderMd}`,
        borderRadius: 999, padding: "5px 12px",
        fontSize: 12, color: hov ? C.brand : C.text2,
        cursor: "pointer", transition: "all 0.18s",
        fontFamily: "inherit", whiteSpace: "nowrap",
      }}
    >{text}</button>
  );
}

/* ─────────────────────────────────────────
   MESSAGE BUBBLE
───────────────────────────────────────── */
function MessageBubble({ msg, onSuggestionClick }) {
  const isBot = msg.role === "bot";
  const lines = msg.text.split("\n");
  const renderLine = (line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={li}>
        {parts.map((p, j) => p.startsWith("**") && p.endsWith("**")
          ? <strong key={j} style={{ fontWeight: 700 }}>{p.slice(2, -2)}</strong>
          : p)}
        {li < lines.length - 1 && <br />}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: "column", alignItems: isBot ? "flex-start" : "flex-end", marginBottom: 18 }}
    >
      {isBot && (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, maxWidth: "82%" }}>
          <BotAvatar />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: C.text3, marginBottom: 4, fontWeight: 500 }}>Salooote AI</div>
            <div style={{
              background: C.botBg, border: `1px solid ${C.border}`,
              borderRadius: "18px 18px 18px 4px", padding: "11px 15px",
              fontSize: "0.875rem", lineHeight: 1.65, color: C.text,
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}>
              {lines.map(renderLine)}
            </div>
          </div>
        </div>
      )}
      {!isBot && (
        <div style={{ maxWidth: "76%" }}>
          <div style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(225,29,92,0.14)",
            borderRadius: "18px 18px 4px 18px",
            padding: "11px 15px", fontSize: "0.875rem", lineHeight: 1.65, color: C.text,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}>
            {lines.map(renderLine)}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   CHAT PANEL HEADER
───────────────────────────────────────── */
function ChatPanelHeader({ onNewChat, lang }) {
  const t = tx(lang);
  return (
    <div style={{
      padding: "12px 16px 10px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: `1px solid ${C.border}`, flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <BotAvatar size={34} />
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>Salooote AI</span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", display: "inline-block" }} />
          </div>
          <div style={{ fontSize: 11, color: C.text3 }}>{t.subtitle}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <button onClick={onNewChat} style={{
          background: "transparent", border: `1px solid ${C.border}`,
          borderRadius: 999, padding: "5px 12px", fontSize: 11.5,
          color: C.text2, cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 5,
          transition: "all 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.brand + "44"; e.currentTarget.style.color = C.brand; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text2; }}
        >
          <Plus size={11} /> {t.newChat}
        </button>
        <button style={{
          width: 30, height: 30, borderRadius: "50%",
          background: "transparent", border: `1px solid ${C.border}`,
          color: C.text3, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderMd; e.currentTarget.style.color = C.text2; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text3; }}
        >
          <Settings size={13} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPOSER (input + pills)
───────────────────────────────────────── */
function Composer({ input, setInput, onSend, loading, onSuggestionClick, lang }) {
  const t = tx(lang);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const canSend = !!input.trim() && !loading;

  return (
    <div style={{ padding: "12px 18px 16px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
      {/* Input row */}
      <div style={{
        background: focused ? "transparent" : "transparent",
        borderRadius: 18,
        padding: focused ? "1.5px" : "1.5px",
        backgroundImage: focused ? C.gradFull : "none",
        boxShadow: focused ? "0 0 24px rgba(225,29,92,0.12),0 0 48px rgba(124,58,237,0.08)" : "none",
        transition: "box-shadow 0.25s",
      }}>
        <div style={{
          background: "#f8fafc", border: focused ? "none" : `1px solid ${C.borderMd}`,
          borderRadius: focused ? 16.5 : 18, padding: "9px 10px 9px 14px",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Sparkles size={14} color={focused ? C.brand : C.text3} strokeWidth={2} style={{ flexShrink: 0, transition: "color 0.2s" }} />
          <form onSubmit={e => { e.preventDefault(); onSend(input); }} style={{ display: "flex", flex: 1, alignItems: "center", gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              disabled={loading}
              placeholder={t.placeholder}
              autoFocus
              style={{ flex: 1, border: "none", outline: "none", fontSize: "0.875rem", background: "transparent", color: C.text, fontFamily: "inherit" }}
            />
            {/* Mic */}
            <button type="button" style={{
              width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
              background: "transparent", border: `1px solid ${C.border}`,
              color: C.text3, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderMd; e.currentTarget.style.color = C.text2; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text3; }}
            >
              <Mic size={12} />
            </button>
            {/* Send */}
            <motion.button type="submit" disabled={!canSend}
              whileHover={canSend ? { scale: 1.08 } : {}}
              whileTap={canSend ? { scale: 0.92 } : {}}
              style={{
                width: 34, height: 34, borderRadius: "50%", flexShrink: 0, border: "none",
                background: canSend ? C.grad : "rgba(15,23,42,0.07)",
                cursor: canSend ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: canSend ? "0 4px 14px rgba(225,29,92,0.3)" : "none",
                transition: "all 0.2s",
              }}
            >
              {loading
                ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}><Loader2 size={14} color={C.text3} /></motion.div>
                : <Send size={14} color={canSend ? "#fff" : C.text3} strokeWidth={2.2} />
              }
            </motion.button>
          </form>
        </div>
      </div>

      {/* Quick pills */}
      <div style={{ display: "flex", gap: 6, marginTop: 10, paddingLeft: 2 }}>
        {[
          { icon: <Paperclip size={11} />, label: t.pill1, action: null },
          { icon: <Bookmark size={11} />, label: t.pill2, action: null },
          { icon: <Zap size={11} />, label: t.pill3, action: "inspire" },
        ].map(({ icon, label, action }) => (
          <button key={label}
            onClick={() => action === "inspire" && onSuggestionClick("Give me event ideas and inspiration")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "transparent", border: `1px solid ${C.border}`,
              borderRadius: 999, padding: "5px 11px",
              fontSize: 11.5, color: C.text3, cursor: "pointer",
              fontFamily: "inherit", transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.brand + "40"; e.currentTarget.style.color = C.brand; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text3; }}
          >
            {icon} {label}
          </button>
        ))}
      </div>
      <p style={{ margin: "8px 0 0", fontSize: "0.62rem", color: C.text3, textAlign: "center" }}>
        {t.disclaimer}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   CHAT WELCOME
───────────────────────────────────────── */
function ChatWelcome({ lang, onFeatureClick }) {
  const t = tx(lang);
  const features = [
    { icon: <Sparkles size={18} color={C.brand} />, title: t.feat1Title, desc: t.feat1Desc, msg: t.feat1Msg, accent: C.brand, bg: "rgba(225,29,92,0.06)", border: "rgba(225,29,92,0.15)" },
    { icon: <Search size={18} color="#7c3aed" />, title: t.feat2Title, desc: t.feat2Desc, msg: t.feat2Msg, accent: "#7c3aed", bg: "rgba(124,58,237,0.06)", border: "rgba(124,58,237,0.15)" },
    { icon: <Heart size={18} color="#0ea5e9" />, title: t.feat3Title, desc: t.feat3Desc, msg: t.feat3Msg, accent: "#0ea5e9", bg: "rgba(14,165,233,0.06)", border: "rgba(14,165,233,0.15)" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "24px 20px", textAlign: "center", overflowY: "auto" }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.05 }} style={{ marginBottom: 18 }}>
        <OrbLarge size={62} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} style={{ marginBottom: 22, maxWidth: 340 }}>
        <h2 style={{ margin: "0 0 6px", fontSize: "1.22rem", fontWeight: 800, color: C.text, letterSpacing: "-0.03em", lineHeight: 1.32 }}>
          <span style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{t.greeting}</span>
        </h2>
        <p style={{ margin: "0 0 4px", fontSize: "0.83rem", color: C.text, lineHeight: 1.6, fontWeight: 500 }}>{t.welcome1}</p>
        <p style={{ margin: "0 0 2px", fontSize: "0.8rem", color: C.text2, lineHeight: 1.55 }}>{t.welcome2}</p>
        <p style={{ margin: 0, fontSize: "0.8rem", color: C.text2, lineHeight: 1.55 }}>{t.welcome3}</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, width: "100%", maxWidth: 420 }}>
        {features.map((f, i) => (
          <motion.button key={i}
            initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.32 + i * 0.07, type: "spring", stiffness: 280 }}
            whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.96 }}
            onClick={() => onFeatureClick && onFeatureClick(f.msg)}
            style={{ background: "#f8fafc", border: `1.5px solid ${C.border}`, borderRadius: 16, padding: "14px 10px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
            onMouseEnter={e => { e.currentTarget.style.background = f.bg; e.currentTarget.style.borderColor = f.border; e.currentTarget.style.boxShadow = `0 8px 24px ${f.accent}18`; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)"; }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 10, background: f.bg, border: `1px solid ${f.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>{f.icon}</div>
            <p style={{ margin: "0 0 5px", fontSize: "0.72rem", fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{f.title}</p>
            <p style={{ margin: 0, fontSize: "0.63rem", color: C.text3, lineHeight: 1.5 }}>{f.desc}</p>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   VENDOR CARD  — image-based grid card
───────────────────────────────────────── */
const VENDOR_GRAD_COLORS = [
  ["#7c3aed","#a855f7"], ["#e11d5c","#f43f5e"], ["#059669","#10b981"],
  ["#d97706","#f59e0b"], ["#0891b2","#06b6d4"], ["#db2777","#ec4899"],
];

function VendorCard({ vendor, isSelected, onPreview }) {
  const name  = vendor.business_name || vendor.name || "Vendor";
  const image = vendor.cover_image || vendor.logo_url || null;
  const rating = parseFloat(vendor.rating) || 0;
  const city   = vendor.city || "";
  const [c1, c2] = VENDOR_GRAD_COLORS[name.charCodeAt(0) % VENDOR_GRAD_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -3, boxShadow: `0 14px 32px rgba(0,0,0,0.14)` }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      onClick={() => onPreview(vendor)}
      style={{
        borderRadius: 12, overflow: "hidden", cursor: "pointer", background: "#fff",
        border: isSelected ? `2.5px solid ${C.purple}` : `1.5px solid ${C.border}`,
        boxShadow: isSelected ? `0 0 0 4px ${C.purple}18, 0 4px 16px rgba(0,0,0,0.08)` : "0 2px 8px rgba(0,0,0,0.06)",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
    >
      {/* Image */}
      <div style={{ height: 120, position: "relative", overflow: "hidden" }}>
        {image ? (
          <img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${c1}33, ${c2}55)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "2rem", fontWeight: 900, color: c1, opacity: 0.55 }}>{name[0]?.toUpperCase()}</span>
          </div>
        )}
        {/* Selected overlay */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "absolute", inset: 0, background: "rgba(225,29,92,0.52)", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <div style={{ background: "#fff", borderRadius: 100, padding: "5px 13px", display: "flex", alignItems: "center", gap: 5, boxShadow: "0 2px 12px rgba(0,0,0,0.18)" }}>
                <Check size={12} color={C.purple} strokeWidth={3} />
                <span style={{ fontSize: "0.74rem", fontWeight: 800, color: C.purple }}>Selected</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Info */}
      <div style={{ padding: "9px 10px 10px" }}>
        <p style={{ margin: "0 0 3px", fontSize: "0.78rem", fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "nowrap", overflow: "hidden" }}>
          {rating > 0 && (
            <>
              <Star size={9} style={{ color: "#f59e0b", fill: "#f59e0b", flexShrink: 0 }} />
              <span style={{ fontSize: "0.66rem", color: C.text2, fontWeight: 600, flexShrink: 0 }}>{rating.toFixed(1)}</span>
            </>
          )}
          {city && <span style={{ fontSize: "0.64rem", color: C.text3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{rating > 0 ? " · " : ""}{city}</span>}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   VENDOR DETAIL POPUP  — masonry photo grid
───────────────────────────────────────── */
function VendorDetailPopup({ vendor, isSelected, onSelect, onClose, lang }) {
  const t = tx(lang);
  const [photos,  setPhotos]  = useState([]);
  const [loading, setLoading] = useState(true);
  const name = vendor.business_name || vendor.name || "Vendor";
  const slug = vendor.slug || "";

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const params = new URLSearchParams({ limit: "16" });
    if (vendor.id) params.set("vendor_id", vendor.id);
    fetch(`${base}/products?${params}`)
      .then(r => r.json())
      .then(d => setPhotos((d.data || []).filter(p => p.thumbnail_url || p.images?.[0]?.url)))
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false));
  }, [vendor.id]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 20, width: "90%", maxWidth: 660, maxHeight: "86vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.22)" }}
      >
        {/* Header */}
        <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <button onClick={onClose}
              style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${C.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.text2, flexShrink: 0 }}>
              <X size={13} />
            </button>
            <span style={{ fontSize: "0.95rem", fontWeight: 800, color: C.text, letterSpacing: "-0.02em" }}>{name}</span>
          </div>
          {slug && (
            <a href={`/${lang}/vendor/${slug}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ background: C.purple, border: "none", borderRadius: 8, padding: "7px 14px", color: "#fff", fontSize: "0.76rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.01em" }}>
                View Business Page
              </motion.button>
            </a>
          )}
        </div>

        {/* Photo masonry */}
        <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "48px 0" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}>
                <Loader2 size={26} color={C.text3} />
              </motion.div>
            </div>
          ) : photos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: C.text3, fontSize: "0.84rem" }}>
              {t.noPhotos}
            </div>
          ) : (
            <div style={{ columns: "4 140px", columnGap: 8 }}>
              {photos.map((p, i) => {
                const img = p.thumbnail_url || p.images?.[0]?.url;
                return (
                  <div key={p.id || i} style={{ breakInside: "avoid", marginBottom: 8, borderRadius: 8, overflow: "hidden", background: C.border }}>
                    <img src={img} alt={p.name || ""} style={{ width: "100%", display: "block", borderRadius: 8 }} loading="lazy" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 18px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, flexShrink: 0 }}>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => { onSelect(vendor); onClose(); }}
            style={{
              flex: 1, padding: "11px 0",
              background: isSelected ? "#f0fdf4" : C.grad,
              border: isSelected ? "1.5px solid #86efac" : "none",
              borderRadius: 12, color: isSelected ? "#16a34a" : "#fff",
              fontSize: "0.88rem", fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              fontFamily: "inherit",
              boxShadow: isSelected ? "none" : "0 6px 20px rgba(225,29,92,0.28)",
            }}>
            <Check size={14} strokeWidth={2.5} />
            {isSelected ? t.alreadySelected : t.selectVendor}
          </motion.button>
          <button onClick={onClose}
            style={{ padding: "11px 18px", background: "transparent", border: `1px solid ${C.borderMd}`, borderRadius: 12, color: C.text2, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            {t.close}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   SERVICE ROW
───────────────────────────────────────── */
function ServiceRow({ service, selectedVendor, vendorResults, onSelectVendor, onSearchVendors, onUnselectVendor, onOpenSearch, onRemoveService, accent, lang = "en" }) {
  const t = tx(lang);
  const results     = vendorResults[service.service_type] || [];
  const isSelected  = !!selectedVendor;
  const isSearching = service.searching;
  const hasResults  = results.length > 0 && !isSelected;
  const iconColor   = isSelected ? C.green : (accent || C.brand);
  const displayTitle = t.serviceTitles?.[service.service_type] || service.title;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 0" }}>
      {/* Status circle */}
      <div style={{ width: 18, height: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isSelected ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 460, damping: 22 }}
            style={{ width: 18, height: 18, borderRadius: "50%", background: "#f0fdf4", border: "1.5px solid #86efac", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Check size={10} color={C.green} strokeWidth={2.5} />
          </motion.div>
        ) : isSearching ? (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${(accent || C.brand)}22`, borderTopColor: accent || C.brand }} />
        ) : (
          <div style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${C.border}` }} />
        )}
      </div>

      {/* Icon */}
      <div style={{ width: 16, height: 16, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: isSelected ? 0.5 : 0.6 }}>
        {getServiceIcon(service.service_type, { size: 13, color: iconColor, strokeWidth: 1.8 })}
      </div>

      {/* Title + vendor name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: isSelected ? 500 : 600, color: isSelected ? C.text3 : C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: isSelected ? "line-through" : "none" }}>
          {displayTitle}
        </p>
        {isSelected && selectedVendor && (
          <p style={{ margin: "1px 0 0", fontSize: "0.68rem", color: C.green, fontWeight: 600 }}>{selectedVendor.name}</p>
        )}
        {!service.required && !isSelected && (
          <span style={{ fontSize: "0.58rem", color: C.text3, fontWeight: 500 }}>{t.optional}</span>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 4 }}>
        {isSelected ? (
          <button onClick={() => onUnselectVendor(service.service_type)}
            style={{ border: "none", background: "none", cursor: "pointer", padding: "2px", color: C.text3, display: "flex", alignItems: "center", borderRadius: 4, transition: "color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color = C.text2} onMouseLeave={e => e.currentTarget.style.color = C.text3}>
            <X size={12} />
          </button>
        ) : hasResults ? (
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => onOpenSearch(service.service_type)}
            style={{ display: "inline-flex", alignItems: "center", gap: 3, background: "#fefce8", border: "1px solid #fde68a", color: "#92400e", borderRadius: 6, padding: "4px 9px", fontSize: "0.67rem", fontWeight: 700, cursor: "pointer" }}>
            {results.length} {t.found} <ChevronRight size={9} strokeWidth={2.5} />
          </motion.button>
        ) : service.canSearch && !isSearching ? (
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => { onSearchVendors(service.service_type, displayTitle); onOpenSearch(service.service_type); }}
            style={{ display: "inline-flex", alignItems: "center", gap: 3, background: "transparent", border: `1px solid ${C.border}`, color: C.text3, borderRadius: 6, padding: "4px 9px", fontSize: "0.67rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.brand + "44"; e.currentTarget.style.color = C.brand; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text3; }}>
            <Search size={9} strokeWidth={2.5} /> {t.find}
          </motion.button>
        ) : null}

        {/* Remove service button */}
        {onRemoveService && (
          <button onClick={() => onRemoveService(service.service_type)}
            title={t.removeService}
            style={{ border: "none", background: "none", cursor: "pointer", padding: "2px 3px", color: "transparent", display: "flex", alignItems: "center", borderRadius: 4, transition: "color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#fca5a5"} onMouseLeave={e => e.currentTarget.style.color = "transparent"}>
            <X size={11} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   CATEGORY SECTION
───────────────────────────────────────── */
function CategorySection({ label, services, selectedVendors, onOpenSearch, lang = "en", ...rowProps }) {
  const [open, setOpen] = useState(true);
  const done = services.filter(s => selectedVendors?.[s.service_type]).length;
  const all  = done === services.length;
  return (
    <div style={{ marginBottom: 2 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "6px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: "0.6rem", fontWeight: 700, color: C.text3, letterSpacing: "0.09em", textTransform: "uppercase" }}>{label}</span>
          {done > 0 && (
            <span style={{ fontSize: "0.58rem", fontWeight: 700, borderRadius: 100, padding: "1px 6px", background: all ? "#f0fdf4" : "transparent", color: all ? "#16a34a" : C.text3, border: `1px solid ${all ? "#bbf7d0" : C.border}` }}>
              {done}/{services.length}
            </span>
          )}
        </div>
        {open ? <ChevronUp size={10} style={{ color: C.text3 }} /> : <ChevronDown size={10} style={{ color: C.text3 }} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} style={{ overflow: "hidden" }}>
            <div>
              {services.map((s, idx) => (
                <div key={s.service_type}>
                  {idx > 0 && <div style={{ height: 1, background: C.border, marginLeft: 27 }} />}
                  <ServiceRow service={s} selectedVendor={selectedVendors?.[s.service_type]} onOpenSearch={onOpenSearch} lang={lang} {...rowProps} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────
   ADD SERVICE ROW  (inline input)
───────────────────────────────────────── */
function AddServiceRow({ onAdd, lang = "en" }) {
  const t = tx(lang);
  const [open, setOpen]   = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  const handleOpen = () => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 60); };
  const handleSubmit = () => {
    const v = value.trim();
    if (!v) { setOpen(false); return; }
    onAdd(v);
    setValue("");
    setOpen(false);
  };

  return (
    <div style={{ marginTop: 8 }}>
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button key="btn"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleOpen}
            style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "transparent", border: `1px dashed ${C.border}`, borderRadius: 8, padding: "6px 12px", fontSize: "0.72rem", color: C.text3, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", width: "100%" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.brand + "50"; e.currentTarget.style.color = C.brand; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text3; }}>
            <Plus size={12} strokeWidth={2} /> {t.addService}
          </motion.button>
        ) : (
          <motion.div key="input"
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 7, background: "#f8fafc", border: `1px solid ${C.brand}44`, borderRadius: 8, padding: "6px 10px" }}>
              <Plus size={12} color={C.brand} strokeWidth={2} />
              <input
                ref={inputRef}
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") { setOpen(false); setValue(""); } }}
                placeholder={t.addServicePlaceholder}
                style={{ flex: 1, border: "none", outline: "none", fontSize: "0.78rem", background: "transparent", color: C.text, fontFamily: "inherit" }}
              />
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              style={{ background: C.grad, border: "none", borderRadius: 7, padding: "6px 12px", fontSize: "0.72rem", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
              <Check size={13} />
            </motion.button>
            <button onClick={() => { setOpen(false); setValue(""); }}
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px", color: C.text3, display: "flex", alignItems: "center" }}>
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────
   META CHIP  (right panel header)
───────────────────────────────────────── */
function MetaChip({ icon, children }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: "rgba(15,23,42,0.04)", border: `1px solid ${C.border}`,
      borderRadius: 999, padding: "5px 11px",
      fontSize: 12, color: C.text2, whiteSpace: "nowrap",
    }}>
      {icon}{children}
    </div>
  );
}

/* ─────────────────────────────────────────
   BUDGET BAR
───────────────────────────────────────── */
function BudgetBar({ sel, total, lang = "en" }) {
  const t = tx(lang);
  const pct = total > 0 ? Math.round((sel / total) * 100) : 0;
  return (
    <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.text3, letterSpacing: "0.07em", textTransform: "uppercase" }}>{t.vendorProgress}</span>
        <span style={{ fontSize: 12, color: C.text2 }}>
          <span style={{ color: C.text, fontWeight: 700 }}>{sel}</span> / {total} {t.confirmed}
        </span>
      </div>
      <div style={{ height: 5, borderRadius: 999, background: "rgba(15,23,42,0.06)", overflow: "hidden" }}>
        <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ height: "100%", background: C.grad, borderRadius: 999, boxShadow: "0 0 8px rgba(225,29,92,0.3)" }} />
      </div>
      <div style={{ fontSize: "0.65rem", color: C.text3, marginTop: 5, fontFamily: "monospace" }}>
        {pct}% {t.confirmed} · {total - sel} {t.stillNeededShort}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   TIMELINE
───────────────────────────────────────── */
function PlanTimeline({ services, selectedVendors, lang = "en" }) {
  const t = tx(lang);
  const items = services.slice(0, 7);
  const firstActiveIdx = items.findIndex(s => !selectedVendors[s.service_type]);
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>{t.timeline}</div>
      <div style={{ position: "relative", paddingLeft: 22 }}>
        <div style={{ position: "absolute", left: 7, top: 6, bottom: 6, width: 1, background: C.border }} />
        {items.map((item, i) => {
          const isDone   = !!selectedVendors[item.service_type];
          const isActive = !isDone && i === firstActiveIdx;
          return (
            <div key={item.service_type} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", position: "relative" }}>
              <div style={{
                position: "absolute", left: -22,
                width: 15, height: 15, borderRadius: "50%",
                background: isDone ? "#f0fdf4" : isActive ? `${C.brand}12` : "#f8fafc",
                border: isDone ? "1.5px solid #86efac" : isActive ? `2px solid ${C.brand}` : `1.5px solid ${C.borderMd}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                animation: isActive ? "plannerGlow 1.8s infinite" : "none",
              }}>
                {isDone && <Check size={8} color={C.green} strokeWidth={2.5} />}
              </div>
              <span style={{
                fontSize: "0.78rem", lineHeight: 1.4,
                color: isDone ? C.text3 : isActive ? C.text : C.text2,
                fontWeight: isActive ? 600 : 400,
                textDecoration: isDone ? "line-through" : "none",
              }}>{item.title}</span>
              {isActive && (
                <span style={{ fontSize: "0.6rem", fontWeight: 700, color: C.brand, background: `${C.brand}10`, border: `1px solid ${C.brand}28`, borderRadius: 100, padding: "2px 7px", flexShrink: 0 }}>{t.now}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PROGRESS BY CATEGORY
───────────────────────────────────────── */
function ProgressByCategory({ services, selectedVendors, lang = "en" }) {
  const t = tx(lang);
  const grouped = {};
  for (const s of services) {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  }
  const entries = Object.entries(grouped).slice(0, 5);
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>{t.progress}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {entries.map(([cat, items]) => {
          const done = items.filter(s => selectedVendors[s.service_type]).length;
          const pct  = done / items.length;
          const complete = pct === 1;
          return (
            <div key={cat} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", background: "rgba(15,23,42,0.02)", border: `1px solid ${C.border}`, borderRadius: 10 }}>
              <div style={{ flex: 1, fontSize: "0.76rem", color: C.text2 }}>{t.catLabels?.[cat] || CATEGORY_LABELS[cat] || cat}</div>
              <div style={{ width: 72, height: 3, borderRadius: 999, background: C.border, overflow: "hidden" }}>
                <div style={{ width: `${pct * 100}%`, height: "100%", background: complete ? "#86efac" : C.brand, borderRadius: 999 }} />
              </div>
              <div style={{ fontSize: "0.68rem", color: complete ? C.green : C.text3, fontWeight: 700, width: 26, textAlign: "right" }}>{done}/{items.length}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   BULK INQUIRY MODAL (T3)
───────────────────────────────────────── */
function BulkInquiryModal({ eventState, sessionId, onClose, lang }) {
  const t = tx(lang);
  const vendors = Object.entries(eventState.selected_vendors || {});
  const [sending,   setSending]   = useState(false);
  const [results,   setResults]   = useState({}); // {service_type: "ok"|"err"}
  const [done,      setDone]      = useState(false);

  const allSent = Object.keys(results).length === vendors.length && Object.values(results).every(v => v === "ok");

  const handleSend = async () => {
    if (!vendors.length) return;
    setSending(true);
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    const eventTypeLine = eventState.event_type_label || eventState.event_type?.replace(/_/g, " ") || "event";
    const guestLine = eventState.guest_count ? `Guests: ${eventState.guest_count}` : "";
    const dateLine  = eventState.date ? `Date: ${eventState.date}` : "";
    const cityLine  = eventState.city ? `Location: ${eventState.city}` : "";
    const budgetLine = eventState.budget?.description ? `Budget: ${eventState.budget.description}` : "";

    const newResults = {};
    await Promise.all(vendors.map(async ([serviceType, vendor]) => {
      const svc = (eventState.services || []).find(s => s.service_type === serviceType);
      const svcTitle = svc?.title || serviceType.replace(/_/g, " ");
      const body = {
        vendor_id: vendor.id,
        subject: `Inquiry for ${svcTitle} — ${eventTypeLine}`,
        message: [
          `Hello! I'm planning a ${eventTypeLine} and I'd love to work with you for ${svcTitle}.`,
          "",
          [dateLine, cityLine, guestLine, budgetLine].filter(Boolean).join("\n"),
          "",
          "Please let me know your availability and pricing. Looking forward to hearing from you!",
        ].join("\n"),
        event_type: eventState.event_type,
        guest_count: eventState.guest_count ? parseInt(eventState.guest_count) : undefined,
        ...(sessionId ? { planner_session_id: sessionId } : {}),
      };
      try {
        const res = await fetch(`${base}/user/inquiries`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(body),
        });
        newResults[serviceType] = res.ok ? "ok" : "err";
      } catch {
        newResults[serviceType] = "err";
      }
    }));

    setResults(newResults);
    setSending(false);
    setDone(true);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,23,42,0.35)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 20, padding: "28px 28px 24px", width: "90%", maxWidth: 480, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }}>

        <div style={{ marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 800, color: C.text }}>
            {done ? (allSent ? "✓ " + t.requestsSent : t.sentWithErrors) : t.sendInquiryAll}
          </h3>
          <p style={{ margin: 0, fontSize: "0.82rem", color: C.text2, lineHeight: 1.5 }}>
            {done ? t.vendorReplyNote : `${t.sendInquiryAll} (${vendors.length})`}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {vendors.map(([serviceType, vendor]) => {
            const result = results[serviceType];
            return (
              <div key={serviceType} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", background: result === "ok" ? "#f0fdf4" : result === "err" ? "#fef2f2" : "#f8fafc", border: `1px solid ${result === "ok" ? "#bbf7d0" : result === "err" ? "#fecaca" : C.border}`, borderRadius: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: result === "ok" ? "#dcfce7" : result === "err" ? "#fee2e2" : "rgba(15,23,42,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {sending && !result
                    ? <Loader2 size={14} color={C.text3} style={{ animation: "spin 0.8s linear infinite" }} />
                    : result === "ok" ? <Check size={14} color="#16a34a" />
                    : result === "err" ? <X size={14} color="#dc2626" />
                    : <Send size={14} color={C.text3} />
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, color: C.text }}>{vendor.name}</p>
                  <p style={{ margin: 0, fontSize: "0.7rem", color: C.text3, textTransform: "capitalize" }}>{serviceType.replace(/_/g, " ")}</p>
                </div>
                {result === "ok" && <span style={{ fontSize: "0.68rem", color: "#16a34a", fontWeight: 700 }}>{t.sent}</span>}
                {result === "err" && <span style={{ fontSize: "0.68rem", color: "#dc2626", fontWeight: 700 }}>{t.failed}</span>}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {done ? (
            <>
              <Link href={`/${lang}/account/inquiries`} style={{ textDecoration: "none", flex: 1 }}>
                <button style={{ width: "100%", padding: "11px 0", background: C.grad, border: "none", borderRadius: 12, color: "#fff", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {t.viewInquiries}
                </button>
              </Link>
              <button onClick={onClose} style={{ padding: "11px 18px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 12, color: C.text2, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {t.close}
              </button>
            </>
          ) : (
            <>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleSend} disabled={sending || !vendors.length}
                style={{ flex: 1, padding: "11px 0", background: vendors.length ? C.grad : "rgba(15,23,42,0.07)", border: "none", borderRadius: 12, color: vendors.length ? "#fff" : C.text3, fontSize: "0.88rem", fontWeight: 700, cursor: vendors.length ? "pointer" : "default", boxShadow: vendors.length ? "0 6px 20px rgba(225,29,92,0.25)" : "none", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {sending ? <><Loader2 size={14} /> Sending…</> : <><Send size={14} /> Send to {vendors.length} Vendors</>}
              </motion.button>
              <button onClick={onClose} style={{ padding: "11px 18px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 12, color: C.text2, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {t.cancel}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   VENDOR SEARCH MODAL  (popup on Find click)
───────────────────────────────────────── */
function VendorSearchModal({ service, vendorResults, onSelect, onClose, onSearch, accent, selectedVendors = {}, lang = "en" }) {
  const t = tx(lang);
  const [query, setQuery] = useState("");
  const [detailVendor, setDetailVendor] = useState(null);
  const results   = vendorResults[service.service_type] || [];
  const isSearching = service.searching;

  const filtered = query.trim()
    ? results.filter(v => (v.business_name || v.name || "").toLowerCase().includes(query.toLowerCase()))
    : results;

  // Auto-trigger search on open if no results yet
  useEffect(() => {
    if (!results.length && !isSearching) onSearch(service.service_type, service.title);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={() => { if (!detailVendor) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,23,42,0.40)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 20, width: "90%", maxWidth: 560, maxHeight: "80vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}
      >
        {/* Header */}
        <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `${accent || C.brand}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {getServiceIcon(service.service_type, { size: 16, color: accent || C.brand, strokeWidth: 1.8 })}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: C.text, letterSpacing: "-0.02em" }}>{service.title}</h3>
              <p style={{ margin: 0, fontSize: "0.72rem", color: C.text3 }}>
                {isSearching ? t.searching : results.length > 0 ? `${results.length} ${t.vendorsFound}` : t.searchForVendors}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${C.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.text3 }}>
            <X size={14} />
          </button>
        </div>

        {/* Search bar */}
        <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", border: `1px solid ${C.borderMd}`, borderRadius: 10, padding: "8px 12px" }}>
            <Search size={13} color={C.text3} />
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t.filterByName}
              style={{ flex: 1, border: "none", outline: "none", fontSize: "0.84rem", background: "transparent", color: C.text, fontFamily: "inherit" }}
            />
            {query && <button onClick={() => setQuery("")} style={{ border: "none", background: "none", cursor: "pointer", color: C.text3, padding: 0, display: "flex" }}><X size={12} /></button>}
          </div>
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px 20px" }}>
          {isSearching && !results.length ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", gap: 12 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}>
                <Loader2 size={24} color={C.text3} />
              </motion.div>
              <p style={{ margin: 0, fontSize: "0.84rem", color: C.text3 }}>{t.findingVendors}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ margin: "0 0 12px", fontSize: "0.88rem", color: C.text2, fontWeight: 600 }}>{t.noVendorsFound}</p>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setQuery(""); onSearch(service.service_type, service.title); }}
                style={{ background: C.grad, border: "none", borderRadius: 8, padding: "8px 18px", fontSize: "0.8rem", color: "#fff", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}>
                <Search size={12} /> {t.searchAgain}
              </motion.button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 10 }}>
              {filtered.map((v, i) => (
                <VendorCard
                  key={v.id || i}
                  vendor={v}
                  isSelected={!!(selectedVendors[service.service_type]?.id === v.id)}
                  onPreview={setDetailVendor}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
          <button onClick={onClose} style={{ padding: "8px 18px", background: "transparent", border: `1px solid ${C.borderMd}`, borderRadius: 8, color: C.text2, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            {t.close}
          </button>
        </div>
      </motion.div>
    </motion.div>

    {/* Vendor detail popup — rendered on top of this modal */}
    <AnimatePresence>
      {detailVendor && (
        <VendorDetailPopup
          vendor={detailVendor}
          isSelected={!!(selectedVendors[service.service_type]?.id === detailVendor.id)}
          onSelect={vendor => { onSelect(service.service_type, vendor); setDetailVendor(null); onClose(); }}
          onClose={() => setDetailVendor(null)}
          lang={lang}
        />
      )}
    </AnimatePresence>
    </>
  );
}

/* ─────────────────────────────────────────
   PLAN PANEL (right, when event active)
───────────────────────────────────────── */
function EventPlanPanel({ eventState, vendorResults, onSelectVendor, onSearchVendors, onUnselectVendor, onAddService, onRemoveService, sessionId, lang, onOpenBulkModal }) {
  const t = tx(lang);
  const { event_type_label, accent, date, city, guest_count, budget, services = [], selected_vendors = {} } = eventState;
  const searchable = services.filter(s => s.canSearch);
  const sel = Object.keys(selected_vendors).length;
  const grouped = {};
  for (const s of services) { if (!grouped[s.category]) grouped[s.category] = []; grouped[s.category].push(s); }
  const missing = services.filter(s => s.required && s.canSearch && !selected_vendors[s.service_type]);
  const pct = searchable.length > 0 ? Math.round((sel / searchable.length) * 100) : 0;

  const [searchModalSvc, setSearchModalSvc] = useState(null);
  const modalService = searchModalSvc ? services.find(s => s.service_type === searchModalSvc) : null;
  const openSearch = (service_type) => setSearchModalSvc(service_type);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Event header */}
      <div style={{ padding: "14px 18px 12px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.6rem", fontWeight: 700, color: C.brand, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.brand, display: "inline-block", animation: "plannerGlow 2s infinite" }} />
              {t.planningInProgress}
            </div>
            <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 400, color: C.text, lineHeight: 1.2, letterSpacing: "-0.03em", fontFamily: "'Georgia', serif" }}>
              {event_type_label}
            </h2>
          </div>
          <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
            {sel > 0 && (
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={onOpenBulkModal}
                style={{ background: C.grad, border: "none", borderRadius: 999, padding: "5px 11px", fontSize: 11, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit", fontWeight: 700, boxShadow: "0 4px 12px rgba(225,29,92,0.22)" }}>
                <Send size={10} /> {t.sendToVendors}
              </motion.button>
            )}
          </div>
        </div>

        {/* Meta chips */}
        {(date || city || guest_count || budget?.description) && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
            {date       && <MetaChip icon={<Calendar size={10} color={C.brand} />}>{date}</MetaChip>}
            {city       && <MetaChip icon={<MapPin    size={10} color={C.brand} />}>{city}</MetaChip>}
            {guest_count && <MetaChip icon={<Users    size={10} color={C.brand} />}>{guest_count} {t.guests}</MetaChip>}
            {budget?.description && <MetaChip icon={<DollarSign size={10} color={C.brand} />}>{budget.description}</MetaChip>}
          </div>
        )}

        {/* Progress bar */}
        {searchable.length > 0 && (
          <div>
            <div style={{ height: 3, borderRadius: 999, background: "rgba(15,23,42,0.06)", overflow: "hidden" }}>
              <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ height: "100%", background: pct === 100 ? "#86efac" : C.grad, borderRadius: 999 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: "0.62rem", color: C.text3 }}>
              <span>{sel} / {searchable.length} {t.confirmed}</span>
              <span>{pct}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px 24px" }}>

        {/* Missing items warning */}
        {missing.length > 0 && sel > 0 && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 12px", marginBottom: 14, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <AlertTriangle size={13} color="#92400e" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: "0.72rem", color: "#92400e", lineHeight: 1.5 }}>
              <strong>{t.stillNeeded}</strong> {missing.map(s => t.serviceTitles?.[s.service_type] || s.title).join(", ")}
            </p>
          </motion.div>
        )}

        {/* Category sections */}
        <div>
          {Object.entries(grouped).map(([cat, items], idx) => (
            <div key={cat}>
              {idx > 0 && <div style={{ height: 1, background: C.border, margin: "6px 0" }} />}
              <CategorySection
                label={t.catLabels?.[cat] || CATEGORY_LABELS[cat] || cat}
                services={items}
                selectedVendors={selected_vendors}
                vendorResults={vendorResults}
                onSelectVendor={onSelectVendor}
                onSearchVendors={onSearchVendors}
                onUnselectVendor={onUnselectVendor}
                onRemoveService={onRemoveService}
                accent={accent}
                lang={lang}
                onOpenSearch={openSearch}
              />
            </div>
          ))}
        </div>

        {/* Add service */}
        {onAddService && (
          <AddServiceRow onAdd={onAddService} lang={lang} />
        )}
      </div>

      {/* Vendor search modal */}
      <AnimatePresence>
        {searchModalSvc && modalService && (
          <VendorSearchModal
            service={modalService}
            vendorResults={vendorResults}
            onSelect={onSelectVendor}
            onClose={() => setSearchModalSvc(null)}
            onSearch={(type, title) => onSearchVendors(type, title)}
            accent={accent}
            selectedVendors={selected_vendors}
            lang={lang}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────
   RIGHT EMPTY STATE  (event type picker)
───────────────────────────────────────── */
const EVENT_TYPES_GRID = [
  { key: "christening", color: "#e11d5c" },
  { key: "wedding",     color: "#e11d5c" },
  { key: "birthday",    color: "#3b82f6" },
  { key: "kids_party",  color: "#10b981" },
  { key: "corporate",   color: "#475569" },
  { key: "baby_shower", color: "#0ea5e9" },
  { key: "engagement",  color: "#8b5cf6" },
  { key: "graduation",  color: "#ea580c" },
];

function RightEmptyState({ onPickType, lang }) {
  const t = tx(lang);
  const pickSub = t.pickSub.split("\n");
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "32px 20px", textAlign: "center" }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: 24 }}>
        <p style={{ margin: "0 0 5px", fontSize: "0.65rem", fontWeight: 700, color: C.text3, letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.quickStart}</p>
        <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem", fontWeight: 800, color: C.text, letterSpacing: "-0.03em" }}>{t.pickType}</h3>
        <p style={{ margin: 0, fontSize: "0.81rem", color: C.text2, lineHeight: 1.5, maxWidth: 240 }}>{pickSub[0]}<br />{pickSub[1]}</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, width: "100%", maxWidth: 360 }}>
        {EVENT_TYPES_GRID.map((ev, i) => {
          const label = t.eventLabels[ev.key] || ev.key;
          return (
            <motion.button key={ev.key}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.22 + i * 0.04, type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.96 }}
              onClick={() => onPickType(label)}
              style={{ background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 7, transition: "all 0.18s", fontFamily: "inherit" }}
              onMouseEnter={e => { e.currentTarget.style.background = `${ev.color}09`; e.currentTarget.style.borderColor = `${ev.color}40`; e.currentTarget.style.boxShadow = `0 8px 20px ${ev.color}14`; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${ev.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {getEventIcon(ev.key, { size: 17, color: ev.color, strokeWidth: 1.8 })}
              </div>
              <span style={{ fontSize: "0.61rem", fontWeight: 700, color: C.text2, textAlign: "center", lineHeight: 1.3 }}>{label}</span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   AUTH GATE  (login wall — shown after 3 free messages)
───────────────────────────────────────── */
function AuthGate({ lang }) {
  const t = tx(lang);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      style={{
        position: "absolute", inset: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.08, type: "spring", stiffness: 300, damping: 28 }}
        style={{
          background: "#fff",
          border: `1px solid rgba(15,23,42,0.1)`,
          borderRadius: 20,
          padding: "36px 32px",
          maxWidth: 400,
          width: "calc(100% - 48px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)",
        }}
      >
        {/* Top: icon + headline */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#fce7f3,#ede9fe)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Sparkles size={20} color={C.brand} strokeWidth={2} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: C.text, letterSpacing: "-0.025em", lineHeight: 1.3 }}>
              {t.saveYourPlan}
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: "0.8rem", color: C.text3 }}>{t.freeAccount}</p>
          </div>
        </div>

        {/* Description */}
        <p style={{ margin: "0 0 20px", fontSize: "0.86rem", color: C.text2, lineHeight: 1.6 }}>
          {t.saveDesc}
        </p>

        {/* Feature list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 24 }}>
          {[
            t.authFeature1,
            t.authFeature2,
            t.authFeature3,
          ].map((text, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: `${C.brand}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <Check size={10} color={C.brand} strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: "0.82rem", color: C.text2, lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Link href={`/${lang}/signup?redirect=/${lang}/planner`} style={{ textDecoration: "none" }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              style={{ width: "100%", padding: "12px 0", background: C.grad, border: "none", borderRadius: 12, color: "#fff", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: "0 6px 20px rgba(225,29,92,0.25)", fontFamily: "inherit" }}>
              <Sparkles size={14} strokeWidth={2} /> {t.createFreeAccount}
            </motion.button>
          </Link>
          <Link href={`/${lang}/login?redirect=/${lang}/planner`} style={{ textDecoration: "none" }}>
            <button style={{ width: "100%", padding: "10px 0", background: "transparent", border: `1px solid rgba(15,23,42,0.12)`, borderRadius: 12, color: C.text2, fontSize: "0.87rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(15,23,42,0.2)"; e.currentTarget.style.color = C.text; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(15,23,42,0.12)"; e.currentTarget.style.color = C.text2; }}>
              {t.signIn}
            </button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   SAVE STATUS BADGE
───────────────────────────────────────── */
function SaveBadge({ status }) {
  if (status === "idle") return null;
  const config = {
    saving: { icon: <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}><Loader2 size={11} /></motion.div>, text: "Saving…", color: C.text3 },
    saved:  { icon: <CheckCircle2 size={11} color={C.green} />, text: "Saved",   color: C.green },
    error:  { icon: <AlertTriangle size={11} color="#b91c1c" />, text: "Not saved", color: "#b91c1c" },
  }[status];
  if (!config) return null;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.72rem", color: config.color, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 100, padding: "4px 10px" }}>
      {config.icon} {config.text}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
const INITIAL_STATE = {
  event_type: null, event_type_label: null,
  accent: C.brand, gradient: null, date: null, city: null,
  guest_count: null, style: null, budget: null, notes: null,
  services: [], selected_vendors: {},
};

const SITE_HEADER_H = 64;

function PlannerClientInner({ lang }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeSessionId = searchParams?.get("session") || null;

  // ── Auth ──────────────────────────────────────────────────
  const [authed,       setAuthed]       = useState(null); // null = checking, true/false
  const [user,         setUser]         = useState(null);
  const [sessionId,    setSessionId]    = useState(null); // backend session id
  const [saveStatus,   setSaveStatus]   = useState("idle"); // "idle"|"saving"|"saved"|"error"
  const [showBulkModal,setShowBulkModal]= useState(false);
  const [mobilePlanOpen, setMobilePlanOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const saveTimerRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const ok = isLoggedIn();
    setAuthed(ok);
    if (ok) setUser(getUser());
  }, []);

  // ── Core state ────────────────────────────────────────────
  const [messages,      setMessages]      = useState([]);
  const [eventState,    setEventState]    = useState(INITIAL_STATE);
  const [vendorResults, setVendorResults] = useState({});
  const [loading,       setLoading]       = useState(false);
  const [input,         setInput]         = useState("");

  const msgsRef = useRef(null);

  const scrollToBottom = useCallback(() => { if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight; }, []);
  useEffect(() => { scrollToBottom(); }, [messages, loading, scrollToBottom]);

  // ── Auto-save to backend ──────────────────────────────────
  const persistSession = useCallback(async (state) => {
    if (!isLoggedIn() || !state.event_type) return;
    setSaveStatus("saving");
    try {
      const payload = {
        title:       `${state.event_type_label || state.event_type}${state.city ? ` in ${state.city}` : ""}`,
        event_type:  state.event_type,
        event_date:  state.date || null,
        guest_count: state.guest_count ? parseInt(state.guest_count) : null,
        currency:    "AMD",
        location:    state.city || "",
        event_data:  state,
      };
      if (sessionId) {
        await plannerAPI.update(sessionId, payload);
      } else {
        const res = await plannerAPI.create(payload);
        const newId = res?.data?.id || res?.id;
        if (newId) setSessionId(newId);
      }
      setSaveStatus("saved");
      // Reset badge after 2s
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => setSaveStatus("idle"), 3000);
    }
  }, [sessionId]);

  // Debounced save whenever eventState changes
  const saveDebounceRef = useRef(null);
  useEffect(() => {
    if (!authed || !eventState.event_type) return;
    if (saveDebounceRef.current) clearTimeout(saveDebounceRef.current);
    saveDebounceRef.current = setTimeout(() => persistSession(eventState), 1500);
    return () => clearTimeout(saveDebounceRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventState, authed]);

  // LocalStorage backup (non-authed fallback)
  useEffect(() => {
    if (eventState.event_type)
      localStorage.setItem("salooote_planner", JSON.stringify({ eventState, vendorResults }));
  }, [eventState, vendorResults]);

  // Welcome message
  useEffect(() => {
    const t = setTimeout(() => {
      const wt = tx(lang);
      setMessages([{
        id: 1, role: "bot",
        text: `${wt.greeting}\n\n${wt.welcome1}\n${wt.welcome2} ${wt.welcome3}`,
        suggestions: wt.suggestions,
      }]);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  // Load saved session from ?session= param (T2)
  useEffect(() => {
    if (!resumeSessionId || !authed) return;
    plannerAPI.getById(resumeSessionId)
      .then(res => {
        const sess = res?.data || res;
        if (!sess) return;
        const savedState = sess.event_data;
        if (savedState && savedState.event_type) {
          setEventState(savedState);
          setSessionId(sess.id);
          setMessages(prev => [...prev, {
            id: Date.now(), role: "bot",
            text: `Welcome back! 🎉 I loaded your **${savedState.event_type_label || savedState.event_type}** plan. You have ${Object.keys(savedState.selected_vendors || {}).length} vendors confirmed. What would you like to work on?`,
            suggestions: getContextSuggestions(savedState, lang),
          }]);
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeSessionId, authed]);

  const pushBot = useCallback((text, currentState) => {
    const suggestions = getContextSuggestions(currentState || eventState, lang);
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), role: "bot", text, suggestions }]);
  }, [eventState, lang]);

  const searchVendors = useCallback(async (service_type, search_term, filters = {}) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      const term = search_term || service_type.replace(/_/g, " ");
      const params = new URLSearchParams({ search: term, limit: "8" });
      const city = filters.city || eventState.city;
      if (city) params.set("city", city);
      let data = null;
      try { const r = await fetch(`${base}/vendors?${params}`); if (r.ok) { const j = await r.json(); data = j.data || []; } } catch {}
      if (!data?.length) { const r = await fetch(`${base}/products?${params}`); if (r.ok) { const j = await r.json(); data = (j.data || []).map(p => ({ id: p.id, business_name: p.vendor_name || p.name, name: p.vendor_name || p.name, rating: p.rating, city: p.vendor_city || city || "", slug: p.vendor_slug || "" })); } }
      if (data?.length) setVendorResults(prev => ({ ...prev, [service_type]: data }));
      setEventState(prev => ({ ...prev, services: prev.services.map(s => s.service_type === service_type ? { ...s, searching: false } : s) }));
    } catch {
      setEventState(prev => ({ ...prev, services: prev.services.map(s => s.service_type === service_type ? { ...s, searching: false } : s) }));
    }
  }, [eventState.city]);

  const sendMessage = useCallback(async (text) => {
    const t = text.trim();
    if (!t || loading) return;
    setInput("");
    const userMsg = { id: Date.now(), role: "user", text: t };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      // Build richer planner state context for the AI
      const missingInfo = getMissingInfo(eventState);
      const plannerMode = !eventState.event_type ? "general"
        : missingInfo.length > 0 ? "planning_event"
        : "searching_product";

      const plannerState = {
        mode: plannerMode,
        event: {
          type: eventState.event_type,
          date: eventState.date,
          location: eventState.city,
          guestCount: eventState.guest_count,
          budget: eventState.budget,
          age: eventState.age,
          theme: eventState.style,
        },
        services: (eventState.services || []).map(s => ({
          service_type: s.service_type,
          status: eventState.selected_vendors?.[s.service_type] ? "selected" : s.status || "pending",
          required: s.required,
          selectedVendorId: eventState.selected_vendors?.[s.service_type]?.id,
        })),
        missingInfo,
        language: lang,
      };

      const data = await sendLegacyPlanMessage({
        messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.text })),
        eventState,
        lang,
      });
      if (data.error) { pushBot(`${data.error}`, eventState); return; }

      // Apply AI actions
      let { state: newState, searches } = applyActions(data.actions || [], eventState, lang);

      // Merge updated_state from new response contract if present
      if (data.updated_state) {
        newState = { ...newState, ...data.updated_state };
      }

      // Apply frontend service rules on top of AI output
      newState = applyServiceRules(newState, lang);

      setEventState(newState);
      const botText = data.assistant_message || data.reply || data.message;
      if (botText) pushBot(botText, newState);
      for (const s of searches) searchVendors(s.service_type, s.search_term, s.filters || {});
    } catch {
      pushBot("Something went wrong. Please try again.", eventState);
    } finally {
      setLoading(false);
    }
  }, [messages, eventState, loading, searchVendors, pushBot, lang]);

  const handleSelectVendor = useCallback((service_type, vendor) => {
    const name = vendor.business_name || vendor.name || "Vendor";
    setEventState(prev => ({
      ...prev,
      selected_vendors: { ...prev.selected_vendors, [service_type]: { id: vendor.id, name } },
      services: prev.services.map(s => s.service_type === service_type ? { ...s, status: "selected", searching: false } : s),
    }));
    setVendorResults(prev => { const n = { ...prev }; delete n[service_type]; return n; });
    setMessages(prev => {
      const newState = { ...eventState, selected_vendors: { ...eventState.selected_vendors, [service_type]: { id: vendor.id, name } } };
      return [...prev, { id: Date.now() + Math.random(), role: "bot", text: `**${name}** added for **${service_type.replace(/_/g, " ")}**. What's next?`, suggestions: getContextSuggestions(newState, lang) }];
    });
  }, [eventState]);

  const handleSearchVendors = useCallback((service_type, title) => {
    setEventState(prev => ({ ...prev, services: prev.services.map(s => s.service_type === service_type ? { ...s, searching: true } : s) }));
    searchVendors(service_type, title);
  }, [searchVendors]);

  const handleUnselectVendor = useCallback(service_type => {
    setEventState(prev => {
      const sv = { ...prev.selected_vendors }; delete sv[service_type];
      return { ...prev, selected_vendors: sv, services: prev.services.map(s => s.service_type === service_type ? { ...s, status: "pending" } : s) };
    });
  }, []);

  const handleAddService = useCallback((title) => {
    const service_type = title.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    setEventState(prev => {
      if (prev.services.find(s => s.service_type === service_type)) return prev;
      return {
        ...prev,
        services: [...prev.services, { service_type, title, category: "other", required: false, canSearch: true, status: "pending" }],
      };
    });
  }, []);

  const handleRemoveService = useCallback(service_type => {
    setEventState(prev => {
      const sv = { ...prev.selected_vendors }; delete sv[service_type];
      return {
        ...prev,
        services: prev.services.filter(s => s.service_type !== service_type),
        selected_vendors: sv,
      };
    });
    setVendorResults(prev => { const n = { ...prev }; delete n[service_type]; return n; });
  }, []);

  const handleNewChat = useCallback(() => {
    const nt = tx(lang);
    setMessages([{ id: 1, role: "bot", text: `${nt.greeting}\n\n${nt.welcome1}\n${nt.welcome2} ${nt.welcome3}`, suggestions: nt.suggestions }]);
    setEventState(INITIAL_STATE);
    setVendorResults({});
    setSessionId(null);
    setSaveStatus("idle");
  }, []);

  const hasEvent    = !!eventState.event_type;
  const showWelcome = messages.length <= 1 && !hasEvent;

  // Show auth gate: when not logged in AND user has sent 3+ messages
  const userMsgCount = messages.filter(m => m.role === "user").length;
  const showAuthGate = authed === false && userMsgCount >= 3;

  // Still checking auth — render nothing until confirmed
  if (authed === null) {
    return (
      <div style={{ height: `calc(100vh - ${SITE_HEADER_H}px)`, display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}>
          <Loader2 size={28} color={C.text3} />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(15,23,42,0.1);border-radius:10px;}
        ::-webkit-scrollbar-thumb:hover{background:rgba(15,23,42,0.18);}
        .planner-hide-scroll::-webkit-scrollbar{display:none;}
        .planner-hide-scroll{scrollbar-width:none;-ms-overflow-style:none;}
        @keyframes plannerGlow{0%,100%{box-shadow:0 0 0 0 rgba(225,29,92,0.35);}50%{box-shadow:0 0 0 6px rgba(225,29,92,0);}}
        @keyframes plannerPulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
      `}</style>

      <div style={{ height: `calc(100vh - ${SITE_HEADER_H}px)`, display: "flex", flexDirection: "column", background: C.bg, overflow: "hidden", position: "relative" }}>

        {/* Auth gate — shown when not logged in and 3 free messages used */}
        <AnimatePresence>
          {showAuthGate && <AuthGate lang={lang} />}
        </AnimatePresence>

        {/* Subtle bg orbs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "45%", height: "50%", borderRadius: "50%", background: "radial-gradient(ellipse,rgba(225,29,92,0.055) 0%,transparent 65%)" }} />
          <div style={{ position: "absolute", bottom: "0", left: "-10%", width: "50%", height: "50%", borderRadius: "50%", background: "radial-gradient(ellipse,rgba(124,58,237,0.055) 0%,transparent 65%)" }} />
        </div>

        {/* Main two-column layout */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", padding: isMobile ? "8px 10px 80px" : "16px 28px 16px", gap: 16, position: "relative", zIndex: 1 }}>

          {/* ── LEFT: Chat panel ── */}
          <div style={{
            flex: isMobile ? 1 : "1.4", minWidth: 0, display: "flex", flexDirection: "column",
            background: C.panel, border: `1px solid ${C.border}`,
            borderRadius: isMobile ? 16 : 20, boxShadow: "0 4px 24px rgba(0,0,0,0.05),0 1px 4px rgba(0,0,0,0.03)",
            overflow: "hidden",
          }}>
            <ChatPanelHeader onNewChat={handleNewChat} lang={lang} />

            {/* Messages */}
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <AnimatePresence mode="wait">
                {showWelcome ? (
                  <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.18 }} style={{ flex: 1, overflow: "hidden" }}>
                    <ChatWelcome lang={lang} onFeatureClick={sendMessage} />
                  </motion.div>
                ) : (
                  <motion.div key="chat" ref={msgsRef} className="planner-hide-scroll"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                    style={{ flex: 1, overflowY: "auto", padding: "20px 20px 8px" }}>
                    {messages.map(msg => (
                      <MessageBubble key={msg.id} msg={msg} onSuggestionClick={sendMessage} />
                    ))}
                    {loading && <TypingIndicator />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Composer
              input={input}
              setInput={setInput}
              onSend={showAuthGate ? () => {} : sendMessage}
              loading={loading || showAuthGate}
              onSuggestionClick={showAuthGate ? () => {} : sendMessage}
              lang={lang}
            />
          </div>

          {/* ── RIGHT: Plan panel (desktop only) ── */}
          {!isMobile && <div style={{
            flex: "1", minWidth: 0, display: "flex", flexDirection: "column",
            background: C.panel, border: `1px solid ${C.border}`,
            borderRadius: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.05),0 1px 4px rgba(0,0,0,0.03)",
            overflow: "hidden",
          }}>
            <AnimatePresence mode="wait">
              {!hasEvent ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <RightEmptyState onPickType={label => sendMessage(`I want to plan a ${label}`)} lang={lang} />
                </motion.div>
              ) : (
                <motion.div key="plan" initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <EventPlanPanel
                    eventState={eventState}
                    vendorResults={vendorResults}
                    onSelectVendor={handleSelectVendor}
                    onSearchVendors={handleSearchVendors}
                    onUnselectVendor={handleUnselectVendor}
                    onAddService={handleAddService}
                    onRemoveService={handleRemoveService}
                    sessionId={sessionId}
                    lang={lang}
                    onOpenBulkModal={() => setShowBulkModal(true)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>}

        </div>
      </div>

      {/* ── MOBILE: Floating Plan Button ── */}
      {isMobile && (
        <motion.button
          onClick={() => setMobilePlanOpen(true)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.93 }}
          style={{
            position: "fixed",
            bottom: 24,
            right: 20,
            zIndex: 150,
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: hasEvent ? C.grad : "#ffffff",
            border: hasEvent ? "none" : `1.5px solid ${C.borderMd}`,
            boxShadow: hasEvent
              ? "0 8px 28px rgba(225,29,92,0.4), 0 4px 12px rgba(0,0,0,0.12)"
              : "0 6px 20px rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <ClipboardList size={22} color={hasEvent ? "#fff" : C.brand} strokeWidth={1.8} />
          {hasEvent && Object.keys(eventState.selected_vendors).length > 0 && (
            <span style={{
              position: "absolute",
              top: -3,
              right: -3,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#22c55e",
              border: "2px solid #fff",
              fontSize: "0.58rem",
              fontWeight: 800,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {Object.keys(eventState.selected_vendors).length}
            </span>
          )}
        </motion.button>
      )}

      {/* ── MOBILE: Plan Panel Overlay (slides up) ── */}
      <AnimatePresence>
        {isMobile && mobilePlanOpen && (
          <motion.div
            key="mobile-plan"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: C.bg,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Overlay top bar */}
            <div style={{
              height: 52,
              flexShrink: 0,
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setMobilePlanOpen(false)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    border: `1px solid ${C.border}`,
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <ChevronDown size={16} color={C.text2} />
                </motion.button>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>
                  {hasEvent ? eventState.event_type_label : "Event Plan"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <AnimatePresence mode="wait">
                  <SaveBadge key={saveStatus} status={saveStatus} />
                </AnimatePresence>
                {hasEvent && Object.keys(eventState.selected_vendors).length > 0 && (
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => { setShowBulkModal(true); setMobilePlanOpen(false); }}
                    style={{
                      background: C.grad,
                      border: "none",
                      borderRadius: 999,
                      padding: "5px 12px",
                      fontSize: 11.5,
                      color: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontFamily: "inherit",
                      fontWeight: 700,
                      boxShadow: "0 4px 14px rgba(225,29,92,0.25)",
                    }}
                  >
                    <Send size={11} /> Contact Vendors
                  </motion.button>
                )}
              </div>
            </div>

            {/* Overlay content */}
            <div style={{ flex: 1, overflow: "hidden", padding: "10px 10px 16px" }}>
              <div style={{
                height: "100%",
                background: C.panel,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                overflow: "hidden",
              }}>
                <AnimatePresence mode="wait">
                  {!hasEvent ? (
                    <motion.div key="empty-mobile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <RightEmptyState
                        onPickType={label => {
                          sendMessage(`I want to plan a ${label}`);
                          setMobilePlanOpen(false);
                        }}
                        lang={lang}
                      />
                    </motion.div>
                  ) : (
                    <motion.div key="plan-mobile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                      <EventPlanPanel
                        eventState={eventState}
                        vendorResults={vendorResults}
                        onSelectVendor={handleSelectVendor}
                        onSearchVendors={handleSearchVendors}
                        onUnselectVendor={handleUnselectVendor}
                        onAddService={handleAddService}
                        onRemoveService={handleRemoveService}
                        sessionId={sessionId}
                        lang={lang}
                        onOpenBulkModal={() => { setShowBulkModal(true); setMobilePlanOpen(false); }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Inquiry Modal */}
      {showBulkModal && (
        <BulkInquiryModal
          eventState={eventState}
          sessionId={sessionId}
          lang={lang}
          onClose={() => setShowBulkModal(false)}
        />
      )}
    </>
  );
}

export default function PlannerClient({ lang }) {
  return (
    <Suspense fallback={null}>
      <PlannerClientInner lang={lang} />
    </Suspense>
  );
}
