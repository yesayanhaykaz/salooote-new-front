"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { productsAPI, vendorsAPI } from "@/lib/api";
import {
  Heart, PartyPopper, Users, Sparkles, Star, Gift,
  Cake, Baby, TreePine, Smile,
  ChevronRight, ArrowLeft, ArrowRight, CheckCircle2, Wand2,
  Calendar, MapPin, Clock, ShieldCheck,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────
   Localized text — full source-of-truth, no mixed-script gibberish
──────────────────────────────────────────────────────────────────── */
const T = {
  en: {
    home: "Home",
    events: "Events",
    eyebrow: "Plan your moment",
    heroCtaVendors: "Browse vendors",
    heroCtaAI: "Ask Sali AI",
    statsVendors: "trusted vendors",
    statsAvgPrep: "avg. planning time",
    statsHappy: "happy customers",
    overview: "Overview",
    products: "Products",
    vendors: "Vendors",
    plan: "Plan",
    aboutTitle: "About this celebration",
    productsTitle: "Curated products",
    productsAll: "Browse all products",
    productsEmpty: "No products yet — check back soon.",
    vendorsTitle: "Recommended vendors",
    vendorsAll: "See all vendors",
    aiTitle: "Not sure where to start?",
    aiSubtitle: "Tell Sali what you're celebrating — get a personalized checklist, vendor matches, and pricing in seconds.",
    aiCta: "Open AI Planner",
    aiBadge: "AI Assistant",
    checklistTitle: "Planning checklist",
    checklistDone: "done",
    checklistProgress: "Progress",
    suggestedTitle: "Vendors you may need",
    relatedTitle: "Other occasions",
    relatedSubtitle: "Explore more event types",
    trustQuality: "Verified quality",
    trustOnTime: "On-time delivery",
    trustSupport: "Friendly support",
    daysAhead: "days ahead",
    inYerevan: "Yerevan & Armenia",
    minutes: "min to plan",
    quickFacts: "Quick facts",
    bestFor: "Best for",
  },
  hy: {
    home: "Գլխավոր",
    events: "Միջոցառումներ",
    eyebrow: "Պլանավորիր քո միջոցառումը",
    heroCtaVendors: "Տեսնել մատակարարներին",
    heroCtaAI: "Հարցրու Sali AI-ին",
    statsVendors: "վստահելի մատակարար",
    statsAvgPrep: "միջին պլանավորման ժամանակ",
    statsHappy: "գոհ հաճախորդ",
    overview: "Ընդհանուր",
    products: "Ապրանքներ",
    vendors: "Մատակարարներ",
    plan: "Պլան",
    aboutTitle: "Այս առիթի մասին",
    productsTitle: "Ընտրված ապրանքներ",
    productsAll: "Տեսնել բոլորը",
    productsEmpty: "Դեռ ապրանքներ չկան",
    vendorsTitle: "Առաջարկվող մատակարարներ",
    vendorsAll: "Տեսնել բոլորին",
    aiTitle: "Չգիտե՞ք որտեղից սկսել",
    aiSubtitle: "Պատմեք Sali-ին, թե ինչ միջոցառում եք նշում և ստացեք անհատական ընթացակարգ, համապատասխան մատակարարներ ու ծանոթացեք գներին վայրկյանների ընթացքում։",
    aiCta: "AI Օգնական",
    aiBadge: "AI Օգնական",
    checklistTitle: "Պլանավորման քայլեր",
    checklistDone: "կատարված",
    checklistProgress: "Առաջընթաց",
    suggestedTitle: "Մատակարարներ",
    relatedTitle: "Այլ առիթներ",
    relatedSubtitle: "Բացահայտեք ավելին",
    trustQuality: "Ստուգված որակ",
    trustOnTime: "Ժամանակին առաքում",
    trustSupport: "Որակյալ աջակցություն",
    daysAhead: "օր նախապես",
    inYerevan: "Երևան և ողջ Հայաստան",
    minutes: "րոպե պլանավորելու համար",
    quickFacts: "Հիմնական փաստեր",
    bestFor: "Հարմար է",
  },
  ru: {
    home: "Главная",
    events: "Мероприятия",
    eyebrow: "Спланируй свой момент",
    heroCtaVendors: "Все поставщики",
    heroCtaAI: "Спросить Sali AI",
    statsVendors: "проверенных поставщиков",
    statsAvgPrep: "среднее время подготовки",
    statsHappy: "довольных клиентов",
    overview: "Обзор",
    products: "Товары",
    vendors: "Поставщики",
    plan: "План",
    aboutTitle: "Об этом празднике",
    productsTitle: "Подборка товаров",
    productsAll: "Все товары",
    productsEmpty: "Пока нет товаров — заходите позже.",
    vendorsTitle: "Рекомендуемые поставщики",
    vendorsAll: "Все поставщики",
    aiTitle: "Не знаете, с чего начать?",
    aiSubtitle: "Расскажите Sali, что вы празднуете — получите персональный чеклист, подбор поставщиков и цены за секунды.",
    aiCta: "Открыть AI-планировщик",
    aiBadge: "AI-Помощник",
    checklistTitle: "Чеклист подготовки",
    checklistDone: "выполнено",
    checklistProgress: "Прогресс",
    suggestedTitle: "Нужные поставщики",
    relatedTitle: "Другие поводы",
    relatedSubtitle: "Изучите больше",
    trustQuality: "Проверенное качество",
    trustOnTime: "Доставка вовремя",
    trustSupport: "Дружелюбная поддержка",
    daysAhead: "дней заранее",
    inYerevan: "Ереван и вся Армения",
    minutes: "минут на план",
    quickFacts: "Кратко",
    bestFor: "Подходит для",
  },
};







const kidsLinks = {
  decorations: {
    hy: "ձևավորում",
    en: "decorations",
    ru: "оформление",
    href: "/categories/decorations",
  },
  balloons: {
    hy: "փուչիկներ",
    en: "balloons",
    ru: "шары",
    href: "/categories/balloons",
  },
  entertainment: {
    hy: "ժամանց",
    en: "entertainment",
    ru: "развлечения",
    href: "/categories/entertainment",
  },
  cake: {
    hy: "տորթ",
    en: "cake",
    ru: "торт",
    href: "/categories/cakes",
  },
  gifts: {
    hy: "նվերներ",
    en: "gifts",
    ru: "подарки",
    href: "/categories/gifts",
  },
  photography: {
    hy: "լուսանկարահանում",
    en: "photography",
    ru: "фотосъёмка",
    href: "/categories/photography",
  },
};




const anniversaryLinks = {
  decorations: {
    hy: "ձևավորում",
    en: "decorations",
    ru: "оформление",
    href: "/categories/decorations",
  },
  music: {
    hy: "երաժշտություն",
    en: "music",
    ru: "музыка",
    href: "/categories/music",
  },
  catering: {
    hy: "սնունդ",
    en: "catering",
    ru: "кейтеринг",
    href: "/categories/catering",
  },
  photography: {
    hy: "լուսանկարահանում",
    en: "photography",
    ru: "фотосъёмка",
    href: "/categories/photography",
  },
  cake: {
    hy: "տորթ",
    en: "cake",
    ru: "торт",
    href: "/categories/cakes",
  },
  gifts: {
    hy: "նվերներ",
    en: "gifts",
    ru: "подарки",
    href: "/categories/gifts",
  },
};






const engagementLinks = {
  flowers: {
    hy: "ծաղիկներ",
    en: "flowers",
    ru: "цветы",
    href: "/categories/flowers",
  },
  decorations: {
    hy: "ձևավորում",
    en: "decorations",
    ru: "оформление",
    href: "/categories/decorations",
  },
  music: {
    hy: "երաժշտություն",
    en: "music",
    ru: "музыка",
    href: "/categories/music",
  },
  photography: {
    hy: "լուսանկարահանում",
    en: "photography",
    ru: "фотосъёмка",
    href: "/categories/photography",
  },
  gifts: {
    hy: "նվերներ",
    en: "gifts",
    ru: "подарки",
    href: "/categories/gifts",
  },
  cake: {
    hy: "տորթ",
    en: "cake",
    ru: "торт",
    href: "/categories/cakes",
  },
  wedding: {
    hy: "հարսանիք",
    en: "wedding",
    ru: "свадьбе",
    href: "/events/wedding",
  },
};






const birthdayLinks = {
  balloons: {
    hy: "փուչիկներ",
    en: "balloons",
    ru: "шары",
    href: "/categories/balloons",
  },
  decorations: {
    hy: "ձևավորում",
    en: "decorations",
    ru: "оформление",
    href: "/categories/decorations",
  },
  catering: {
    hy: "սնունդ",
    en: "catering",
    ru: "кейтеринг",
    href: "/categories/catering",
  },
  music: {
    hy: "երաժշտություն",
    en: "music",
    ru: "музыка",
    href: "/categories/music",
  },
  entertainment: {
    hy: "ժամանց",
    en: "entertainment",
    ru: "развлечения",
    href: "/categories/entertainment",
  },
  photography: {
    hy: "լուսանկարահանում",
    en: "photography",
    ru: "фотосъёмка",
    href: "/categories/photography",
  },
  cake: {
    hy: "տորթ",
    en: "cake",
    ru: "торт",
    href: "/categories/cakes",
  },
  gifts: {
    hy: "նվերներ",
    en: "gifts",
    ru: "подарки",
    href: "/categories/gifts",
  },
};

const weddingLinks = {
  flowers: {
    hy: "ծաղիկներ",
    en: "flowers",
    ru: "цветы",
    href: "/categories/flowers",
  },
  decorations: {
    hy: "ձևավորում",
    en: "decorations",
    ru: "оформление",
    href: "/categories/decorations",
  },
  catering: {
    hy: "սննդի մատուցում",
    en: "catering",
    ru: "кейтеринг",
    href: "/categories/catering",
  },
  cake: {
    hy: "տորթ",
    en: "cake",
    ru: "торт",
    href: "/categories/cakes",
  },
  music: {
    hy: "երաժշտություն",
    en: "music",
    ru: "музыка",
    href: "/categories/music",
  },
  photography: {
    hy: "լուսանկարահանում",
    en: "photography",
    ru: "фотосъёмка",
    href: "/categories/photography",
  },
};





const newYearLinks = {
  decorations: {
    hy: "ձևավորում",
    en: "decorations",
    ru: "оформление",
    href: "/categories/decorations",
  },
  balloons: {
    hy: "փուչիկներ",
    en: "balloons",
    ru: "шары",
    href: "/categories/balloons",
  },
  catering: {
    hy: "սնունդ",
    en: "catering",
    ru: "кейтеринг",
    href: "/categories/catering",
  },
  cake: {
    hy: "տորթ",
    en: "cake",
    ru: "торт",
    href: "/categories/cakes",
  },
  gifts: {
    hy: "նվերներ",
    en: "gifts",
    ru: "подарки",
    href: "/categories/gifts",
  },
  photography: {
    hy: "լուսանկարահանում",
    en: "photography",
    ru: "фотосъёмка",
    href: "/categories/photography",
  },
};



const corporateLinks = {
  venue: {
    hy: "վայրը",
    en: "venue",
    ru: "место",
    href: "/categories/venues",
  },
  catering: {
    hy: "սննդի մատուցումը",
    en: "catering",
    ru: "кейтеринг",
    href: "/categories/catering",
  },
  music: {
    hy: "երաժշտությունը",
    en: "music",
    ru: "музыка",
    href: "/categories/music",
  },
  entertainment: {
    hy: "ժամանցային ծրագրերը",
    en: "entertainment",
    ru: "развлечения",
    href: "/categories/entertainment",
  },
  photography: {
    hy: "լուսանկարահանումը",
    en: "photography",
    ru: "фотосъёмка",
    href: "/categories/photography",
  },
  decorations: {
    hy: "ձևավորումը",
    en: "decorations",
    ru: "оформление",
    href: "/categories/decorations",
  },
};








const baptismLinks = {
  balloons: {
    hy: "փուչիկներ",
    en: "balloons",
    ru: "шарами",
    href: "/categories/balloons",
  },
  decorations: {
    hy: "ձևավորումներով",
    en: "decorations",
    ru: "оформления",
    href: "/categories/decorations",
  },
  gifts: {
    hy: "նվերներով",
    en: "gifts",
    ru: "подарков",
    href: "/categories/gifts",
  },
  cake: {
    hy: "տորթով",
    en: "cake",
    ru: "торта",
    href: "/categories/cakes",
  },
  photography: {
    hy: "լուսանկարահանում",
    en: "photography",
    ru: "фотосъёмкой",
    href: "/categories/photography",
  },
};


/* ────────────────────────────────────────────────────────────────────
   Event metadata — fully translated, no mixed-script
──────────────────────────────────────────────────────────────────── */
const EVENT_META = {
  balloons: {
    label: "Balloons & Decor",
    labelHy: "Փուչիկներ և Ձևավորում",
    labelRu: "Шары и Оформление",
    desc: "Find top balloon decoration professionals for your event.",
    descHy: "Գտե՛ք փուչիկներով ձևավորման լավագույն մասնագետներին Ձեր միջոցառման համար։",
    descRu: "Найдите лучших специалистов по оформлению воздушными шарами для вашего мероприятия.",
    about: {
      hy: "Salooote հարթակում կարող եք գտնել փուչիկներով ձևավորման լավագույն մասնագետներին՝ Ձեր միջոցառումը յուրահատուկ դարձնելու համար։\n\nՄեր գործընկերները ձևավորում են հոբելյաններ, մկրտություններ, ծննդյան տոներ, ատամհատիկներ և կորպորատիվ միջոցառումներ՝ անհատական դիզայնով՝ ըստ Ձեր նախասիրությունների։\n\nԿարող եք ընտրել պատրաստի տարբերակներից կամ կապ հաստատել մասնագետների հետ՝ Ձեր գաղափարը կյանքի կոչելու համար։",
      en: "On Salooote you can find top balloon decoration professionals to make your event truly special.\n\nOur vendors offer custom-designed decorations for birthdays, baptisms, anniversaries, tooth parties, and corporate events — tailored to your preferences.\n\nBrowse ready-made designs or connect directly with vendors to bring your own ideas to life.",
      ru: "На Salooote вы найдёте лучших специалистов по оформлению воздушными шарами для создания незабываемой атмосферы.\n\nНаши партнёры оформляют юбилеи, крещения, дни рождения и корпоративные мероприятия с индивидуальным подходом.\n\nВыберите готовый дизайн или свяжитесь с исполнителями, чтобы воплотить свою идею.",
    },
    icon: Sparkles,
    image: "/images/balloons-blue.jpg",
    accent: "from-rose-500 to-pink-500",
    keywords: ["balloon", "decor", "balloons", "ձևավորում", "փուչիկ"],
    suggestedCats: ["balloons", "decor", "gifts"],
    checklist: {
      en: ["Choose decoration style", "Pick a color theme", "Order balloons & decor", "Arrange delivery / setup", "Book photographer"],
      hy: ["Ընտրել ձևավորման ոճը", "Ընտրել գույների թեման", "Պատվիրել փուչիկներ և դեկոր", "Կազմակերպել առաքում / տեղադրում", "Ամրագրել ֆոտոգրաֆ"],
      ru: ["Выбрать стиль оформления", "Подобрать цветовую гамму", "Заказать шары и декор", "Организовать доставку / монтаж", "Забронировать фотографа"],
    },
    bestFor: { en: "Birthdays · Baby showers · Engagements", hy: "Ծնունդներ · Մանկական տոներ · Նշանդրեքներ", ru: "Дни рождения · Бэби-шауэры · Помолвки" },
    daysAhead: 3,
  },
  cakes: {
    label: "Cakes & Pastry",
    labelHy: "Տորթեր և Հրուշակեղեն",
    labelRu: "Торты и Десерты",
    desc: "Order beautiful custom cakes for any occasion from the best pastry vendors.",
    descHy: "Պատվիրե՛ք գեղեցիկ տոնական տորթեր ցանկացած առիթի համար՝ Հայաստանի լավագույն հրուշակագործներից։",
    descRu: "Заказывайте красивые праздничные торты для любого повода у лучших кондитеров Армении.",
    about: {
      hy: "Salooote-ում կարող եք պատվիրել տոնական տորթեր լավագույն հրուշակագործներից՝ ըստ Ձեր նախասիրությունների։\n\nՀարթակում ներկայացված են մանկական, մրգային, թեմատիկ և անհատական դիզայնով տորթեր տարբեր առիթների համար՝ լինի ծննդյան տոն, մկրտություն, ատամհատիկ թե հոբելյան։\n\nՊատվերներն ընդունվում են 2-3 օր առաջ և առաքվում են Երևանում և ամբողջ Հայաստանում։",
      en: "On Salooote, you can order cakes from the best pastry vendors in Armenia, tailored to your taste.\n\nBrowse children's cakes, fruit cakes, themed designs, and fully custom creations for any occasion — be it a birthday, baptism, tooth party, or anniversary.\n\nOrders are accepted 2–3 days in advance and delivered across Yerevan and Armenia.",
      ru: "На Salooote вы можете заказать торты у лучших кондитеров Армении по вашему вкусу.\n\nПредставлены детские, фруктовые, тематические и полностью индивидуальные торты для любого повода — дня рождения, крещения, праздника первого зубика или юбилея.\n\nЗаказы принимаются за 2–3 дня и доставляются по Еревану и всей Армении.",
    },
    icon: Cake,
    image: "/images/wedding-cake2.jpg",
    accent: "from-amber-500 to-rose-500",
    keywords: ["cake", "tort", "pastry", "տորթ", "торт"],
    suggestedCats: ["cakes-desserts", "gifts"],
    checklist: {
      en: ["Choose cake design", "Select filling", "Decide on size & portions", "Order 2–3 days ahead", "Arrange delivery"],
      hy: ["Ընտրել տորթի դիզայնը", "Ընտրել միջուկը", "Որոշել չափն ու քանակը", "Պատվիրել 2–3 օր առաջ", "Կազմակերպել առաքումը"],
      ru: ["Выбрать дизайн торта", "Выбрать начинку", "Определить размер и порции", "Заказать за 2–3 дня", "Организовать доставку"],
    },
    bestFor: { en: "Any celebration", hy: "Ցանկացած տոն", ru: "Любой праздник" },
    daysAhead: 3,
  },
  "cartoon-characters": {
    label: "Cartoon Characters",
    labelHy: "Մուլտֆիլմերի Հերոսներ",
    labelRu: "Герои Мультфильмов",
    desc: "Bring magic to your child's party with favorite cartoon characters.",
    descHy: "Կյանքի կոչե՛ք հեքիաթը և կազմակերպե՛ք անմոռանալի ժամանցային ծրագիր Ձեր երեխայի տոնի համար։",
    descRu: "Подарите ребёнку сказку и организуйте незабываемую программу с героями мультфильмов.",
    about: {
      hy: "Salooote հարթակում կարող եք գտնել մուլտֆիլմերի հերոսների ծառայություններ մատուցող մասնագետներ, ովքեր կդարձնեն մանկական տոները ավելի ուրախ ու հիշարժան։\n\nԵրեխաները բոլոր տարիքներում սիրում են մուլտֆիլմեր և երազում հանդիպել իրենց սիրելի հերոսների հետ։\n\nՀարթակի մատակարարները առաջարկում են տարբեր ոճեր, սցենարներ և խաղային ծրագրեր ամեն տարիքի երեխաների համար։",
      en: "Find cartoon character entertainment professionals on Salooote and make your child's party truly magical.\n\nChildren of all ages adore cartoons and dream of meeting their favorite characters in person.\n\nVendors offer a variety of characters, custom scripts, and interactive programs for kids of all ages.",
      ru: "Найдите на Salooote специалистов по развлечениям с героями мультфильмов и сделайте праздник ребёнка по-настоящему волшебным.\n\nДети всех возрастов обожают мультфильмы и мечтают встретить любимых персонажей.\n\nПоставщики предлагают разнообразных персонажей, сценарии и интерактивные программы для детей любого возраста.",
    },
    icon: Smile,
    image: "/images/party-hats.jpg",
    accent: "from-violet-500 to-fuchsia-500",
    keywords: ["cartoon", "character", "kids", "animation", "մուլտ", "мульт"],
    suggestedCats: ["entertainment", "cakes-desserts", "balloons"],
    checklist: {
      en: ["Find out child's favorite character", "Book animator / performer", "Plan entertainment program", "Order themed cake", "Get matching decor"],
      hy: ["Պարզել երեխայի սիրելի հերոսին", "Ամրագրել անիմատոր / դերասան", "Պլանավորել ժամանցային ծրագիրը", "Պատվիրել թեմատիկ տորթ", "Ապահովել համապատասխան դեկոր"],
      ru: ["Узнать любимого героя ребёнка", "Забронировать аниматора", "Спланировать программу", "Заказать тематический торт", "Подобрать декор"],
    },
    bestFor: { en: "Kids' birthdays · Baby showers", hy: "Մանկական ծնունդներ · Մանկական տոներ", ru: "Детские дни рождения · Бэби-шауэры" },
    daysAhead: 7,
  },
  gifts: {
    label: "Gifts",
    labelHy: "Նվերներ",
    labelRu: "Подарки",
    desc: "Discover unique and original gifts for any occasion and any person.",
    descHy: "Գտե՛ք օրիգինալ և յուրահատուկ նվերներ ցանկացած տարիքի, սեռի և առիթի համար։",
    descRu: "Найдите оригинальные и уникальные подарки для любого возраста, пола и случая.",
    about: {
      hy: "Salooote-ում կարող եք գտնել օրիգինալ և յուրահատուկ նվերներ տարբեր վաճառողներից։\n\nՀարթակում ներկայացված են նվերների լայն ընտրանի ցանկացած տարիքի, սեռի և առիթի համար։ Բոլոր ապրանքները կարող են ունենալ գեղեցիկ փաթեթավորում և անհատական մոտեցում։\n\nՀետաքրքիր ու յուրահատուկ նվերներ Ձեր մտերիմների համար։",
      en: "Discover unique and original gifts from multiple vendors on Salooote.\n\nBrowse a wide range of gift ideas for all ages, genders, and occasions. Many products come with premium packaging and personalization options.\n\nFind the perfect gift for your loved ones — Salooote has everything you're looking for.",
      ru: "Откройте для себя оригинальные и уникальные подарки от разных продавцов на Salooote.\n\nШирокий выбор идей для любого возраста, пола и случая. Многие товары доступны с подарочной упаковкой и возможностью персонализации.\n\nНайдите идеальный подарок для своих близких.",
    },
    icon: Gift,
    image: "/images/cookies-box.jpg",
    accent: "from-teal-500 to-cyan-500",
    keywords: ["gift", "present", "նվեր", "подарок"],
    suggestedCats: ["gifts", "cakes-desserts"],
    checklist: {
      en: ["Choose recipient & occasion", "Set your budget", "Pick the gift", "Add personalized packaging", "Arrange delivery"],
      hy: ["Ընտրել ստացողին և առիթը", "Որոշել բյուջեն", "Ընտրել նվերը", "Անհատականացնել փաթեթավորումը", "Կազմակերպել առաքումը"],
      ru: ["Выбрать получателя и повод", "Определить бюджет", "Подобрать подарок", "Оформить упаковку", "Организовать доставку"],
    },
    bestFor: { en: "Any occasion", hy: "Ցանկացած առիթ", ru: "Любой повод" },
    daysAhead: 2,
  },



  romantic: {
    label: "Romantic & Proposals",
    labelHy: "Ռոմանտիկ և Սիրո Խոստովանություն",
    labelRu: "Романтика и Предложения",
    desc: "Create an unforgettable romantic moment with the help of our vendors.",
    descHy: "Ռոմանտիկ միջոցառումներ և սիրո խոստովանություններ",
    descRu: "Создайте незабываемый романтический момент с помощью специалистов на Salooote.",
about: {
  hy: `Ի՞նչը կարող է լինել ավելի լուսավոր ու հուզիչ, քան նոր կյանքի առաջին կարևոր օրվա նշումը։

Մկրտությունը պարզապես արարողություն չէ․ դա օրհնության, հավատքի և նոր սկիզբի խորհրդանիշ է։ Այս օրը միավորում է ընտանիքին, հարազատներին ու մտերիմներին՝ կիսելու փոքրիկի կյանքի կարևորագույն պահերից մեկը։

Յուրաքանչյուր մկրտություն առանձնահատուկ է իր ջերմությամբ ու հոգևոր խորությամբ։ Եկեղեցական արարողությունը լի է խորհրդանշական պահերով, իսկ դրանից հետո օրը հաճախ շարունակվում է ընտանեկան ջերմ հավաքույթով կամ փոքրիկ տոնակատարությամբ։

Մկրտության օրը կարելի է ավելի գեղեցիկ դարձնել նուրբ {{balloons}}-ով, թեմատիկ {{decorations}}-ով, փոքրիկի համար ընտրված {{gifts}}-ով և, իհարկե, հատուկ պատրաստված {{cake}}-ով։

Այս օրը հաճախ ուղեկցվում է գեղեցիկ ավանդույթներով՝ նվերներ փոքրիկին, բարեմաղթանքներ, ընտանեկան {{photography}} և ուրախ պահեր, որոնք դառնում են ընտանեկան պատմության մի մասը։

Եթե ցանկանում եք, որ այս օրը անցնի խաղաղ և կազմակերպված, կարևոր է նախապես մտածել բոլոր մանրուքների մասին՝ եկեղեցու ընտրությունը, ժամանակացույցը, հյուրերի ցանկը և հետագա տոնակատարությունը։

Պարզապես վստահեք այդ օրվա գեղեցկությանը — իսկ մնացածը կարելի է հեշտությամբ կազմակերպել Salooote-ի միջոցով։`,

  en: `What could be brighter and more emotional than celebrating one of the first important days of a new life?

A baptism is not just a ceremony; it is a symbol of blessing, faith, and a new beginning. This day brings family and loved ones together to share one of the child’s most meaningful moments.

Every baptism is special with its warmth and spiritual meaning. After the church ceremony, the day often continues with a family gathering or a small celebration.

You can make the baptism day even more beautiful with gentle {{balloons}}, themed {{decorations}}, thoughtful {{gifts}} for the child, and, of course, a custom {{cake}}.

This day is often filled with beautiful traditions: gifts for the child, warm wishes, family {{photography}}, and joyful moments that become part of your family story.

To make the day peaceful and well-organized, it is important to plan the details in advance: the church, schedule, guest list, and celebration after the ceremony.

Simply trust the beauty of this day — and organize the rest easily with Salooote.`,

  ru: `Что может быть светлее и трогательнее, чем один из первых важных дней в жизни ребёнка?

Крещение — это не просто церемония, а символ благословения, веры и нового начала. В этот день семья и близкие собираются вместе, чтобы разделить один из самых значимых моментов в жизни малыша.

Каждое крещение особенно своей теплотой и духовным смыслом. После церковной церемонии день часто продолжается семейной встречей или небольшим праздником.

День крещения можно сделать ещё красивее с помощью нежных {{balloons}}, тематического {{decorations}}, памятных {{gifts}} для ребёнка и, конечно, особенного {{cake}}.

Этот день часто сопровождается красивыми традициями: подарками малышу, тёплыми пожеланиями, семейной {{photography}} и радостными моментами, которые становятся частью семейной истории.

Чтобы день прошёл спокойно и организованно, важно заранее продумать детали: церковь, расписание, список гостей и праздник после церемонии.

Просто доверьтесь красоте этого дня — а остальное легко организовать с Salooote.`,
},
    icon: Heart,
    image: "/images/flowers-roses.jpg",
    accent: "from-rose-600 to-red-500",
    keywords: ["romantic", "proposal", "love", "valentine", "ռոմանտիկ", "романтик"],
    suggestedCats: ["balloons", "gifts", "flowers"],
    checklist: {
      en: ["Choose the moment & venue", "Plan the surprise", "Order flowers", "Set up candles & decor", "Book photographer"],
      hy: ["Ընտրել պահն ու վայրը", "Պլանավորել անակնկալը", "Պատվիրել ծաղիկներ", "Տեղադրել մոմեր և դեկոր", "Ամրագրել ֆոտոգրաֆ"],
      ru: ["Выбрать момент и место", "Спланировать сюрприз", "Заказать цветы", "Расставить свечи и декор", "Забронировать фотографа"],
    },
    bestFor: { en: "Proposals · Anniversaries · Date nights", hy: "Նշանդրեքներ · Ամյակներ · Ռոմանտիկ երեկոներ", ru: "Помолвки · Юбилеи · Романтические вечера" },
    daysAhead: 5,
  },
  baptism: {
    label: "Baptism",
    labelHy: "Մկրտություն",
    labelRu: "Крещение",
    desc: "Make your child's baptism ceremony as beautiful and memorable as possible.",
    descHy: "Կյանքի ամենակարևոր արարողություններից մեկը դարձրե՛ք անմոռանալի՝ Salooote-ի մատակարարների օգնությամբ։",
    descRu: "Сделайте одно из самых важных таинств жизни незабываемым с помощью специалистов Salooote.",
    about: {

  hy: `Ի՞նչը կարող է ավելի լավ միավորել թիմին, քան լավ կազմակերպված կորպորատիվ միջոցառումը։

Կորպորատիվ տոները պարզապես հանգիստ կամ ժամանց չեն․ դրանք թիմային մշակույթի կարևոր մասն են։ Դրանք հնարավորություն են ստեղծում աշխատակիցներին դուրս գալ առօրյա աշխատանքային ռեժիմից, շփվել ավելի ազատ միջավայրում և ձևավորել ավելի ամուր կապեր միմյանց հետ։

Անկախ նրանից՝ կազմակերպում եք տարեվերջյան միջոցառում, թիմբիլդինգ, ընկերության տարեդարձ կամ նոր նախագծի մեկնարկ, կարևոր է ստեղծել այնպիսի մթնոլորտ, որը կլինի միաժամանակ հաճելի, մոտիվացնող և հիշվող։

Կորպորատիվ միջոցառումները կարող են լինել տարբեր ձևաչափերով՝ պաշտոնական ընթրիքներից մինչև ակտիվ թիմային խաղեր, բացօթյա միջոցառումներ կամ թեմատիկ երեկույթներ։ Ճիշտ ընտրված կոնցեպտը կարող է բարձրացնել թիմի տրամադրությունը, խթանել համագործակցությունը և ստեղծել դրական էներգիա ամբողջ կազմակերպությունում։

Այսպիսի միջոցառումների ընթացքում կարևոր են մանրուքները՝ ճիշտ ընտրված {{venue}}, որակյալ {{catering}}, լավ {{music}}, հետաքրքիր {{entertainment}} և պրոֆեսիոնալ {{photography}}։ Երբ ամեն ինչ մտածված է, արդյունքը զգացվում է ոչ միայն այդ օրը, այլ նաև աշխատանքի արդյունավետության մեջ։

Կորպորատիվ տոները նաև հիանալի հնարավորություն են գնահատելու թիմի աշխատանքը, նշելու ձեռքբերումները և ներշնչելու նոր նպատակների հասնելու համար։

Եթե ցանկանում եք, որ միջոցառումը լինի հաջողված և օգտակար, կարևոր է ճիշտ պլանավորումը։ Պետք է հաշվի առնել թիմի չափը, նպատակները, ձևաչափը և բյուջեն։

Salooote-ում կարող եք գտնել կորպորատիվ միջոցառումների կազմակերպման բոլոր ծառայությունները մեկ հարթակում՝ սկսած {{catering}}-ից և {{decorations}}-ից մինչև {{entertainment}} և {{photography}}։

Պարզապես սահմանեք ձեր նպատակը — իսկ մնացածը կարելի է վստահել ճիշտ կազմակերպմանը։`,
      en: "A baptism is one of the most important and memorable moments in your family's life.\n\nOn Salooote, you can find experienced professionals who will help make this special day as beautiful as possible.\n\nChoose a decoration style, order a cake, gifts, or any other services you need.",
      ru: "Крещение — один из самых важных и памятных моментов в жизни вашей семьи.\n\nНа Salooote вы найдёте опытных специалистов, которые помогут сделать этот особый день максимально красивым.\n\nВыберите стиль оформления, закажите торт, подарки или другие необходимые услуги.",
    },
    icon: Baby,
    image: "/images/cupcakes.jpg",
    accent: "from-sky-500 to-indigo-500",
    keywords: ["baptism", "christening", "baby", "մկրտություն", "крещение"],
    suggestedCats: ["balloons", "cakes-desserts", "gifts"],
    checklist: {
      en: ["Book the ceremony", "Choose decoration style", "Order baptism cake", "Prepare gifts", "Arrange catering / reception"],
      hy: ["Ամրագրել արարողությունը", "Ընտրել ձևավորման ոճը", "Պատվիրել մկրտության տորթ", "Պատրաստել նվերներ", "Կազմակերպել ճաշկերույթը"],
      ru: ["Забронировать обряд", "Выбрать стиль оформления", "Заказать торт", "Подготовить подарки", "Организовать угощение"],
    },
    bestFor: { en: "Family ceremony · Baby celebration", hy: "Ընտանեկան արարողություն", ru: "Семейная церемония" },
    daysAhead: 14,
  },
  "baby-tooth": {
    label: "Tooth Party",
    labelHy: "Ատամհատիկ",
    labelRu: "Праздник Первого Зубика",
    desc: "Celebrate your little one's first tooth with a beautifully organized party.",
    descHy: "Ձեր փոքրիկի ատամհատիկն անմոռանալի դարձրե՛ք Salooote-ի մատակարարների օգնությամբ։",
    descRu: "Сделайте праздник первого зубика вашего малыша незабываемым с помощью Salooote.",
about: {
  hy: `Ի՞նչը կարող է լինել ավելի քնքուշ ու հիշարժան, քան փոքրիկի առաջին ատամիկի տոնը։

Ատամհատիկը հայկական ամենաջերմ ու գեղեցիկ ընտանեկան ավանդույթներից է։ Այն պարզապես փոքրիկ տոն չէ․ դա երեխայի աճի, ուրախության և նոր փուլի խորհրդանիշ է, որը ընտանիքը նշում է սիրով ու ժպիտներով։

Այս օրը սովորաբար լի է գեղեցիկ մանրուքներով՝ ընտանեկան ջերմ հավաքույթ, փոքրիկի համար ընտրված թեմատիկ {{decorations}}, գունավոր {{balloons}}, գեղեցիկ {{cake}} և հիշարժան {{photography}}։

Ատամհատիկի տոնը կարող է լինել շատ պարզ ու մտերմիկ կամ ավելի մեծ ու ձևավորված միջոցառում՝ կախված Ձեր ցանկությունից, հյուրերի քանակից և ընտրված ոճից։

Շատ ծնողներ սիրում են այս օրը լրացնել նաև փոքրիկ {{gifts}}-ով, քաղցրավենիքով, գեղեցիկ սեղանի ձևավորմամբ և ընտանեկան խաղերով, որոնք տոնին տալիս են ավելի ջերմ ու ուրախ մթնոլորտ։

Եթե ցանկանում եք, որ ամեն ինչ լինի գեղեցիկ և կազմակերպված, կարևոր է նախապես մտածել ձևավորման, տորթի, լուսանկարահանման և անհրաժեշտ պարագաների մասին։

Salooote-ում կարող եք գտնել ատամհատիկի համար անհրաժեշտ ծառայություններն ու մասնագետներին մեկ հարթակում՝ արագ, հարմար և գեղեցիկ։

Պարզապես ընտրեք տոնի ոճը — իսկ մնացածը կարելի է կազմակերպել ճիշտ մասնագետների օգնությամբ։`,

  en: `What could be more tender and memorable than celebrating your little one’s first tooth?

A first tooth celebration is one of the warmest family traditions. It is not just a small party; it is a symbol of your child’s growth, joy, and a new stage in life, celebrated with love and smiles.

This day is usually filled with beautiful details: a warm family gathering, themed {{decorations}}, colorful {{balloons}}, a lovely {{cake}}, and memorable {{photography}}.

The celebration can be simple and intimate or larger and more decorated, depending on your wishes, guest count, and chosen style.

Many parents also like to add small {{gifts}}, sweets, a beautifully arranged table, and family activities that make the atmosphere even warmer and more joyful.

To make everything beautiful and well-organized, it is important to plan the decorations, cake, photography, and necessary supplies in advance.

On Salooote, you can find all the services and professionals you need for a first tooth celebration in one place — quickly, easily, and beautifully.

Simply choose the style of the celebration — and organize the rest with the help of the right professionals.`,

  ru: `Что может быть нежнее и памятнее, чем праздник первого зубика малыша?

Праздник первого зубика — одна из самых тёплых семейных традиций. Это не просто маленькое торжество, а символ роста ребёнка, радости и нового этапа в жизни, который семья отмечает с любовью и улыбками.

Этот день обычно наполнен красивыми деталями: тёплой семейной встречей, тематическим {{decorations}}, яркими {{balloons}}, красивым {{cake}} и памятной {{photography}}.

Праздник может быть простым и уютным или более большим и оформленным — всё зависит от ваших пожеланий, количества гостей и выбранного стиля.

Многие родители также добавляют небольшие {{gifts}}, сладости, красивое оформление стола и семейные активности, которые делают атмосферу ещё более тёплой и радостной.

Чтобы всё прошло красиво и организованно, важно заранее продумать оформление, торт, фотосъёмку и необходимые аксессуары.

На Salooote вы можете найти все услуги и специалистов для праздника первого зубика в одном месте — быстро, удобно и красиво.

Просто выберите стиль праздника — а остальное организуйте с помощью подходящих специалистов.`,
},
    icon: Baby,
    image: "/images/cookies-box2.jpg",
    accent: "from-emerald-500 to-teal-500",
    keywords: ["baby", "tooth", "ատամ", "зуб", "atam"],
    suggestedCats: ["cakes-desserts", "balloons", "gifts"],
    checklist: {
      en: ["Pick a theme & color", "Order tooth party cake", "Get balloons & decor", "Prepare profession items", "Invite family & friends"],
      hy: ["Ընտրել թեման և գույները", "Պատվիրել ատամհատիկի տորթ", "Ապահովել փուչիկներ և դեկոր", "Պատրաստել մասնագիտական իրեր", "Հրավիրել ընտանիքին և ընկերներին"],
      ru: ["Выбрать тему и цвет", "Заказать торт", "Купить шары и декор", "Подготовить предметы-профессии", "Пригласить семью и друзей"],
    },
    bestFor: { en: "Baby celebrations", hy: "Մանկական տոներ", ru: "Детские праздники" },
    daysAhead: 5,
  },
  christmas: {
    label: "New Year & Christmas",
    labelHy: "Ամանոր և Սուրբ Ծնունդ",
    labelRu: "Новый Год и Рождество",
    desc: "Create the perfect festive atmosphere for New Year and Christmas.",
    descHy: "Ամանորն ու Սուրբ Ծնունդն անմոռանալի դարձրե՛ք Salooote-ի լավագույն մատակարարների շնորհիվ։",
    descRu: "Сделайте Новый год и Рождество незабываемыми с лучшими поставщиками на Salooote.",
about: {
  hy: `Ի՞նչը կարող է լինել ավելի կախարդական, քան Ամանորի գիշերը և տոնական սպասումը։

Ամանորը տարվա ամենասիրված և սպասված տոնն է, որը միավորում է ընտանիքին, ընկերներին և ստեղծում ջերմ ու ուրախ մթնոլորտ։ Այս օրերին յուրաքանչյուր մանրուք կարևոր է՝ սկսած տան ձևավորումից մինչև նվերների ընտրություն։

Տոնական տրամադրությունը սկսվում է գեղեցիկ {{decorations}}-ից, փայլուն լույսերից և գունավոր {{balloons}}-ից, որոնք տունը լցնում են ուրախությամբ և կախարդանքով։

Ամանորի սեղանը նույնպես կարևոր մասն է տոնի, որտեղ առանձնանում են համեղ {{catering}}-ը և գեղեցիկ պատրաստված {{cake}}-ը, որոնք դարձնում են երեկոն ավելի ամբողջական։

Իհարկե, Ամանորը դժվար է պատկերացնել առանց յուրահատուկ {{gifts}}-ի, որոնք փոխանցում են ջերմություն և ուրախություն ձեր սիրելիներին։

Շատերը նաև նախընտրում են ֆիքսել այդ գեղեցիկ պահերը պրոֆեսիոնալ {{photography}}-ով՝ հիշողությունները պահպանելու համար։

Եթե ցանկանում եք ստեղծել իսկապես կախարդական տոն, կարևոր է նախապես պլանավորել ամեն ինչ՝ ձևավորումից մինչև նվերներ և տոնական մթնոլորտ։

Salooote-ում կարող եք գտնել ամանորյա տոնի կազմակերպման համար անհրաժեշտ բոլոր ծառայությունները մեկ հարթակում։

Պարզապես պատկերացրեք Ձեր իդեալական Ամանորը — իսկ մնացածը կարելի է վստահել ճիշտ մասնագետներին։`,

  en: `What could be more magical than New Year’s Eve and the anticipation of the holiday?

New Year is one of the most beloved and awaited celebrations, bringing family and friends together and creating a warm, joyful atmosphere. During this time, every detail matters — from decorating your home to choosing the perfect gifts.

The festive mood begins with beautiful {{decorations}}, sparkling lights, and colorful {{balloons}} that fill your space with joy and magic.

The holiday table is also an important part of the celebration, featuring delicious {{catering}} and a beautifully crafted {{cake}} that complete the evening.

Of course, New Year wouldn’t be the same without thoughtful {{gifts}} that bring warmth and happiness to your loved ones.

Many people also choose to capture these special moments with professional {{photography}} to preserve the memories.

If you want to create a truly magical celebration, it’s important to plan everything in advance — from decorations to gifts and the overall atmosphere.

On Salooote, you can find all the services you need to organize your perfect New Year celebration in one place.

Simply imagine your ideal New Year — and let the rest be handled by the right professionals.`,

  ru: `Что может быть более волшебным, чем новогодняя ночь и ожидание праздника?

Новый год — один из самых любимых и долгожданных праздников, который объединяет семью и друзей, создавая тёплую и радостную атмосферу. В эти дни важна каждая деталь — от украшения дома до выбора подарков.

Праздничное настроение начинается с красивого {{decorations}}, сияющих огней и ярких {{balloons}}, которые наполняют пространство радостью и магией。

Новогодний стол также играет важную роль — вкусный {{catering}} и красиво оформленный {{cake}} делают вечер ещё более особенным।

Конечно, Новый год невозможно представить без душевных {{gifts}}, которые дарят тепло и радость вашим близким。

Многие также предпочитают сохранить эти моменты с помощью профессиональной {{photography}}, чтобы воспоминания остались на долгие годы。

Чтобы создать по-настоящему волшебный праздник, важно заранее продумать всё — от оформления до подарков и общей атмосферы。

На Salooote вы найдёте все услуги для организации идеального Нового года в одном месте。

Просто представьте свой идеальный праздник — а остальное доверьте профессионалам։`,
},
    icon: TreePine,
    image: "/images/wedding-dance.jpg",
    accent: "from-emerald-600 to-rose-500",
    keywords: ["christmas", "new year", "ամանոր", "Новый год"],
    suggestedCats: ["gifts", "cakes-desserts", "balloons"],
    checklist: {
      en: ["Plan the decoration theme", "Order New Year gifts", "Book festive cake", "Get Christmas decor", "Arrange entertainment"],
      hy: ["Ընտրել ձևավորման թեման", "Պատվիրել ամանորյա նվերներ", "Ամրագրել տոնական տորթ", "Ապահովել ամանորյա դեկոր", "Կազմակերպել ժամանց"],
      ru: ["Выбрать тему оформления", "Заказать новогодние подарки", "Заказать праздничный торт", "Подобрать декор", "Организовать развлечения"],
    },
    bestFor: { en: "December · January", hy: "Դեկտեմբեր · Հունվար", ru: "Декабрь · Январь" },
    daysAhead: 14,
  },
  wedding: {
    label: "Weddings",
    labelHy: "Հարսանիքներ",
    labelRu: "Свадьбы",
    desc: "Everything you need to make your wedding day absolutely perfect.",
    descHy: "Ձեր հարսանյաց օրն անմոռանալի դարձնելու համար անհրաժեշտ ամեն ինչ՝ Salooote-ում։",
    descRu: "Всё необходимое для того, чтобы ваш свадебный день был идеальным — на Salooote.",
about: {
  hy: `Անշուշտ կհամաձայնեք, որ յուրաքանչյուր տոն ունի իր յուրահատուկ մոգությունը, իսկ ճիշտ ընտրված դետալներն են այն դարձնում իսկապես հիշվող։

Հատկապես հարսանիքը Ձեր կյանքի ամենակարևոր ու զգացմունքային օրերից է։ Այս օրը պետք է լինի կատարյալ՝ լի գեղեցկությամբ, սիրով և անմոռանալի պահերով։

Հարսանեկան մթնոլորտը ստեղծվում է մանրուքներից՝ նուրբ {{flowers}}, ոճային {{decorations}}, ճաշակով ընտրված {{catering}}, գեղեցիկ {{cake}}, կենդանի {{music}} և պրոֆեսիոնալ {{photography}}։

Յուրաքանչյուր այս բաղադրիչ իր տեղում ստեղծում է ներդաշնակ ամբողջություն, որը երկար ժամանակ կմնա Ձեր և Ձեր հյուրերի հիշողության մեջ։

Ժամանակակից հարսանիքները կարող են լինել տարբեր ոճերի՝ դասականից մինչև ժամանակակից, բացօթյա արարողություններից մինչև շքեղ հանդիսություններ։ Կարևորն այն է, որ ամեն ինչ արտացոլի հենց Ձեր պատմությունն ու անհատականությունը։

Ճիշտ կազմակերպման դեպքում նույնիսկ ամենափոքր դետալը կարող է դառնալ հիշարժան պահ, որը կհուզի և կուրախացնի բոլոր ներկաներին։

Եթե ցանկանում եք, որ Ձեր հարսանիքը լինի կատարյալ, կարևոր է վստահել փորձառու մասնագետներին և նախապես մտածել բոլոր մանրուքների մասին։

Salooote-ում կարող եք գտնել հարսանեկան միջոցառման համար անհրաժեշտ բոլոր ծառայությունները մեկ հարթակում՝ սկսած {{flowers}}-ից և {{decorations}}-ից մինչև {{catering}}, {{music}} և {{photography}}։

Պարզապես պատկերացրեք Ձեր իդեալական օրը — իսկ մնացածը կարելի է վստահել ճիշտ մասնագետներին։`,

  en: `Every celebration has its own magic, and it is the right details that make it truly unforgettable.

A wedding, in particular, is one of the most important and emotional days of your life. It should be perfect — filled with beauty, love, and unforgettable moments.

The wedding atmosphere is created through details: elegant {{flowers}}, stylish {{decorations}}, refined {{catering}}, a beautiful {{cake}}, live {{music}}, and professional {{photography}}.

Each element plays its role in creating a harmonious experience that will stay in your and your guests’ memories for years.

Modern weddings can take many forms — from classic to contemporary, from outdoor ceremonies to luxurious receptions. What matters most is that everything reflects your story and personality.

With the right planning, even the smallest detail can become a meaningful and emotional moment.

If you want your wedding to be truly perfect, it is important to trust experienced professionals and plan everything in advance.

On Salooote, you can find all the services you need for your wedding in one place — from {{flowers}} and {{decorations}} to {{catering}}, {{music}}, and {{photography}}.

Simply imagine your perfect day — and let the rest be handled by the right professionals.`,

  ru: `Каждое торжество имеет свою магию, и именно детали делают его по-настоящему незабываемым.

Свадьба — один из самых важных и эмоциональных дней в вашей жизни. Этот день должен быть идеальным — наполненным красотой, любовью и яркими моментами.

Атмосфера свадьбы создаётся из деталей: изящные {{flowers}}, стильное {{decorations}}, качественный {{catering}}, красивый {{cake}}, живая {{music}} и профессиональная {{photography}}.

Каждый элемент играет свою роль, создавая гармоничное впечатление, которое надолго останется в памяти вас и ваших гостей.

Современные свадьбы могут быть разными — от классических до современных, от выездных церемоний до роскошных банкетов. Главное — чтобы всё отражало вашу историю и индивидуальность.

При правильной организации даже самая маленькая деталь может стать особенным моментом.

Если вы хотите, чтобы ваша свадьба была идеальной, важно довериться профессионалам и заранее продумать все детали.

На Salooote вы найдёте все услуги для свадьбы в одном месте — от {{flowers}} и {{decorations}} до {{catering}}, {{music}} и {{photography}}.

Просто представьте свой идеальный день — а остальное доверьте профессионалам.`,
},
    icon: Heart,
    image: "/images/wedding-arch-beach.jpg",
    accent: "from-rose-500 to-fuchsia-500",
    keywords: ["wedding", "bride", "cake", "flowers", "catering", "ring"],
    suggestedCats: ["cakes", "flowers", "catering", "music", "photography"],
    checklist: {
      en: ["Book venue", "Order wedding cake", "Hire florist", "Book catering", "Find photographer", "Book DJ / Band", "Arrange transport", "Order invitations"],
      hy: ["Ամրագրել վայրը", "Պատվիրել հարսանյաց տորթ", "Աշխատեցնել ծաղկավաճառին", "Ամրագրել քեյթրինգ", "Գտնել ֆոտոգրաֆ", "Ամրագրել DJ / նվագախումբ", "Կազմակերպել տրանսպորտ", "Պատվիրել հրավիրատոմսեր"],
      ru: ["Забронировать площадку", "Заказать свадебный торт", "Нанять флориста", "Заказать кейтеринг", "Найти фотографа", "Забронировать DJ / группу", "Организовать транспорт", "Заказать приглашения"],
    },
    bestFor: { en: "Engaged couples", hy: "Նշանված զույգերի համար", ru: "Помолвленные пары" },
    daysAhead: 90,
  },
  birthday: {
    label: "Birthdays",
    labelHy: "Ծննդյան Տոներ",
    labelRu: "Дни Рождения",
    desc: "Celebrate every birthday in style with the best vendors in Armenia.",
    descHy: "Ծննդյան տոնն ամենաանմոռանալի ձևով կազմակերպե՛ք Salooote-ի լավագույն մատակարարների հետ։",
    descRu: "Организуйте день рождения самым незабываемым образом с лучшими поставщиками на Salooote.",
about: {
  hy: `Ուրիշ ի՞նչը կարող է ավելի ուրախացնել մարդուն, քան իր ծննդյան օրը՝ լի ժպիտներով, անակնկալներով ու սիրելի մարդկանց ներկայությամբ։

Խոստովանենք՝ անկախ տարիքից, բոլորս էլ անհամբեր սպասում ենք մեր ծննդյան օրվան։ Դա այն օրն է, երբ ուզում ենք կտրվել առօրյայից, լինել ուշադրության կենտրոնում և պարզապես վայելել պահը։

Ծննդյան տոնը յուրահատուկ է յուրաքանչյուրի համար։ Ոմանք նախընտրում են հանգիստ ընտանեկան հավաքույթ, մյուսները՝ մեծ ու շքեղ երեկույթ ընկերների հետ։

Տոնական մթնոլորտը ստեղծվում է մանրուքներից՝ գունավոր {{balloons}}, գեղեցիկ {{decorations}}, համեղ {{catering}}, հաճելի {{music}} և հիշարժան {{photography}}։

Փոքրիկների ծննդյան տոները լի են խաղով ու կախարդանքով, որտեղ կարևոր դեր ունեն նաև թեմատիկ {{entertainment}}-ը և անակնկալ {{gifts}}-ը։

Երիտասարդների և մեծահասակների համար ծննդյան օրը հաճախ դառնում է հիշողություններով լի երեկո՝ ընկերների, երաժշտության և ուրախ մթնոլորտի մեջ։

Իսկ ի՞նչ ծնունդ առանց գեղեցիկ ու համեղ {{cake}}-ի։ Դա այն պահն է, երբ բոլորի հայացքները միավորվում են, մոմերը վառվում են, և հոբելյարը պահ է գտնում իր ցանկությունը պահելու։

Ինչ ձևաչափ էլ ընտրեք՝ փոքր, մեծ, ընտանեկան թե շքեղ, ծննդյան տոնը միշտ մնում է սիրով ու ժպիտներով լի օր։

Եթե ցանկանում եք, որ այդ օրը լինի իսկապես առանձնահատուկ, կարևոր է ամեն ինչ ճիշտ պլանավորել։

Salooote-ում կարող եք գտնել ծննդյան տոնի համար անհրաժեշտ բոլոր ծառայությունները մեկ հարթակում՝ սկսած {{balloons}}-ից և {{decorations}}-ից մինչև {{catering}}, {{music}}, {{entertainment}} և {{photography}}։

Պարզապես պատկերացրեք Ձեր իդեալական օրը — իսկ մնացածը կարելի է հեշտությամբ իրականացնել ճիշտ մասնագետների օգնությամբ։`,

  en: `What could make a person happier than their birthday — filled with smiles, surprises, and the presence of loved ones?

Let’s admit it — regardless of age, we all look forward to our birthday. It’s a day to step away from routine, be in the spotlight, and simply enjoy the moment.

Every birthday is unique. Some prefer a quiet family gathering, while others choose a big celebration with friends.

The festive atmosphere is created through details: colorful {{balloons}}, beautiful {{decorations}}, delicious {{catering}}, enjoyable {{music}}, and memorable {{photography}}.

Children’s birthday parties are full of magic and joy, often enhanced with themed {{entertainment}} and fun {{gifts}}.

For adults, birthdays often become evenings full of memories, friends, music, and great conversations.

And what is a birthday without a beautiful {{cake}}? It’s the moment when everyone gathers, candles are lit, and a wish is made.

No matter the format — small or large, simple or luxurious — a birthday is always a day filled with joy and warmth.

If you want your celebration to be truly special, proper planning is essential.

On Salooote, you can find everything you need for a perfect birthday in one place — from {{balloons}} and {{decorations}} to {{catering}}, {{music}}, {{entertainment}}, and {{photography}}.

Just imagine your perfect day — and let the rest be handled by the right professionals.`,

  ru: `Что может сделать человека счастливее, чем его день рождения — полный улыбок, сюрпризов и любимых людей рядом?

Признаемся — независимо от возраста, мы все с нетерпением ждём свой день рождения. Это день, когда хочется отвлечься от повседневности и просто наслаждаться моментом.

Каждый день рождения уникален. Кто-то выбирает уютный семейный вечер, а кто-то — масштабную вечеринку с друзьями.

Праздничная атмосфера создаётся деталями: яркие {{balloons}}, красивое {{decorations}}, вкусный {{catering}}, приятная {{music}} и памятная {{photography}}.

Детские праздники наполнены магией и весельем, где важную роль играют тематические {{entertainment}} и сюрпризы {{gifts}}.

Для взрослых это часто вечер воспоминаний, общения и хорошего настроения.

И какой день рождения без красивого {{cake}}? Это момент, когда зажигаются свечи и загадываются желания.

Независимо от формата — небольшой или большой праздник — день рождения всегда остаётся днём радости и тепла.

Если вы хотите, чтобы праздник был действительно особенным, важно всё заранее продумать.

На Salooote вы найдёте всё для идеального дня рождения в одном месте — от {{balloons}} и {{decorations}} до {{catering}}, {{music}}, {{entertainment}} и {{photography}}.

Просто представьте свой идеальный день — а остальное доверьте профессионалам.`,
},
    icon: PartyPopper,
    image: "/images/party-balloons.jpg",
    accent: "from-sky-500 to-cyan-500",
    keywords: ["birthday", "party", "cake", "balloons", "kids"],
    suggestedCats: ["cakes", "balloons", "catering", "music"],
    checklist: {
      en: ["Order birthday cake", "Get balloons & decor", "Book catering", "Arrange entertainment", "Send invitations"],
      hy: ["Պատվիրել ծննդյան տորթ", "Ապահովել փուչիկներ և դեկոր", "Ամրագրել քեյթրինգ", "Կազմակերպել ժամանց", "Ուղարկել հրավիրատոմսեր"],
      ru: ["Заказать торт", "Купить шары и декор", "Заказать кейтеринг", "Организовать развлечения", "Отправить приглашения"],
    },
    bestFor: { en: "Kids & adults", hy: "Փոքրեր և մեծեր", ru: "Дети и взрослые" },
    daysAhead: 7,
  },
  corporate: {
    label: "Corporate Events",
    labelHy: "Կորպորատիվ Միջոցառումներ",
    labelRu: "Корпоративные Мероприятия",
    desc: "Impress your clients and team with a professionally organized corporate event.",
    descHy: "Կազմակերպե՛ք Ձեր կորպորատիվ միջոցառումն անթերի՝ Salooote-ի մատակարարների օգնությամբ։",
    descRu: "Организуйте безупречное корпоративное мероприятие с помощью поставщиков Salooote.",
about: {
  hy: `Ի՞նչը կարող է ավելի լավ միավորել թիմին, քան լավ կազմակերպված կորպորատիվ միջոցառումը։

Կորպորատիվ տոները պարզապես հանգիստ կամ ժամանց չեն․ դրանք թիմային մշակույթի կարևոր մասն են։ Դրանք հնարավորություն են ստեղծում աշխատակիցներին դուրս գալ առօրյա աշխատանքային ռեժիմից, շփվել ավելի ազատ միջավայրում և ձևավորել ավելի ամուր կապեր միմյանց հետ։

Անկախ նրանից՝ կազմակերպում եք տարեվերջյան միջոցառում, թիմբիլդինգ, ընկերության տարեդարձ կամ նոր նախագծի մեկնարկ, կարևոր է ստեղծել այնպիսի մթնոլորտ, որը կլինի միաժամանակ հաճելի, մոտիվացնող և հիշվող։

Կորպորատիվ միջոցառումները կարող են լինել տարբեր ձևաչափերով՝ պաշտոնական ընթրիքներից մինչև ակտիվ թիմային խաղեր, բացօթյա միջոցառումներ կամ թեմատիկ երեկույթներ։ Ճիշտ ընտրված կոնցեպտը կարող է բարձրացնել թիմի տրամադրությունը, խթանել համագործակցությունը և ստեղծել դրական էներգիա ամբողջ կազմակերպությունում։

Այսպիսի միջոցառումների ընթացքում կարևոր են մանրուքները՝ ճիշտ ընտրված {{venue}}, որակյալ {{catering}}, լավ {{music}}, հետաքրքիր {{entertainment}} և պրոֆեսիոնալ {{photography}}։

Կորպորատիվ տոները նաև հիանալի հնարավորություն են գնահատելու թիմի աշխատանքը, նշելու ձեռքբերումները և ներշնչելու նոր նպատակների հասնելու համար։

Եթե ցանկանում եք, որ միջոցառումը լինի հաջողված և օգտակար, կարևոր է ճիշտ պլանավորումը։

Salooote-ում կարող եք գտնել կորպորատիվ միջոցառումների կազմակերպման բոլոր ծառայությունները մեկ հարթակում՝ սկսած {{catering}}-ից և {{decorations}}-ից մինչև {{entertainment}} և {{photography}}։

Պարզապես սահմանեք ձեր նպատակը — իսկ մնացածը կարելի է վստահել ճիշտ կազմակերպմանը։`,

  en: `What could bring a team together better than a well-organized corporate event?

Corporate events are not just about отдых and entertainment — they are an essential part of company culture. They give employees the opportunity to step out of their daily routine, connect in a relaxed environment, and build stronger relationships.

Whether you are planning a year-end party, team building, company anniversary, or a project launch, it is important to create an atmosphere that is enjoyable, motivating, and memorable.

Corporate events can take many forms — from formal dinners to active team games, outdoor activities, or themed parties. The right concept can boost team morale, encourage collaboration, and create positive energy within the organization.

During such events, details matter: the right {{venue}}, quality {{catering}}, good {{music}}, engaging {{entertainment}}, and professional {{photography}}.

Corporate celebrations are also a great way to recognize your team’s efforts, celebrate achievements, and inspire future goals.

If you want your event to be successful and impactful, proper planning is key.

On Salooote, you can find all corporate event services in one place — from {{catering}} and {{decorations}} to {{entertainment}} and {{photography}}.

Simply define your goal — and leave the rest to the right professionals.`,

  ru: `Что может лучше объединить команду, чем хорошо организованное корпоративное мероприятие?

Корпоративные события — это не просто отдых и развлечения, а важная часть корпоративной культуры. Они помогают сотрудникам выйти из повседневного рабочего режима, пообщаться в более свободной обстановке и укрепить отношения внутри команды.

Независимо от того, организуете ли вы новогодний вечер, тимбилдинг, юбилей компании или запуск нового проекта, важно создать атмосферу, которая будет одновременно приятной, мотивирующей и запоминающейся.

Корпоративные мероприятия могут быть разными по формату — от официальных ужинов до активных командных игр, выездных событий или тематических вечеринок. Правильно выбранная концепция повышает настроение команды, способствует сотрудничеству и создаёт позитивную энергию внутри компании.

В таких мероприятиях важны детали: подходящее {{venue}}, качественный {{catering}}, хорошая {{music}}, интересные {{entertainment}} и профессиональная {{photography}}.

Корпоративные события также дают отличную возможность оценить работу команды, отметить достижения и вдохновить на новые цели.

Если вы хотите, чтобы мероприятие было успешным и полезным, важно заранее продумать все детали.

На Salooote вы можете найти все услуги для корпоративных мероприятий в одном месте — от {{catering}} и {{decorations}} до {{entertainment}} и {{photography}}.

Просто определите свою цель — а остальное доверьте профессионалам.`,
},
    icon: Users,
    image: "/images/event-dinner.jpg",
    accent: "from-slate-700 to-slate-500",
    keywords: ["corporate", "business", "catering", "conference"],
    suggestedCats: ["catering", "music", "decor"],
    checklist: {
      en: ["Book venue", "Arrange catering", "Set up AV / tech", "Book entertainment", "Print materials"],
      hy: ["Ամրագրել վայրը", "Կազմակերպել քեյթրինգը", "Տեղադրել տեխնիկան", "Ամրագրել ժամանց", "Տպել նյութեր"],
      ru: ["Забронировать площадку", "Организовать кейтеринг", "Настроить аппаратуру", "Заказать развлечения", "Напечатать материалы"],
    },
    bestFor: { en: "Teams · Clients · Conferences", hy: "Թիմեր · Հաճախորդներ · Կոնֆերանսներ", ru: "Команды · Клиенты · Конференции" },
    daysAhead: 21,
  },
  engagement: {
    label: "Engagements",
    labelHy: "Նշանդրեքներ",
    labelRu: "Помолвки",
    desc: "Plan the perfect engagement — from the ring moment to the celebration.",
    descHy: "Կազմակերպե՛ք կատարյալ նշանդրեք՝ Salooote-ի մատակարարների օգնությամբ։",
    descRu: "Организуйте идеальную помолвку с помощью поставщиков Salooote.",
about: {
  hy: `Ի՞նչը կարող է լինել ավելի հուզիչ, քան այն պահը, երբ երկու մարդ որոշում են միասին կերտել իրենց ապագան։

Նշանադրությունը պարզապես արարողություն չէ․ դա սիրո խոստում է, նոր ճանապարհի սկիզբ և այն պահը, երբ երկու ընտանիքներ դառնում են մեկ։

Յուրաքանչյուր նշանադրություն յուրահատուկ է։ Ոմանք նախընտրում են ինտիմ ընտանեկան միջավայր, իսկ մյուսները՝ ավելի մեծ և տպավորիչ միջոցառում։

Նշանադրության մթնոլորտը ստեղծվում է ճիշտ մանրուքներից՝ նուրբ {{flowers}}, գեղեցիկ {{decorations}}, ռոմանտիկ {{music}}, հիշարժան {{photography}} և հատուկ ընտրված {{gifts}}։

Այս օրը նաև հնարավորություն է գեղեցիկ կերպով ներկայացնելու ձեր սերը՝ ընտրված միջավայրի, լուսավորության և ընդհանուր ոճի միջոցով։

Իհարկե, նշանադրությունը առաջին քայլն է դեպի {{wedding}}, և այն հաճախ դառնում է ձեր ապագա տոնակատարության ոճի նախաբանը։

Եթե ցանկանում եք, որ այդ օրը լինի իսկապես յուրահատուկ, կարևոր է մտածել ամեն մանրուքի մասին՝ վայրը, մթնոլորտը, հյուրերի ցանկը և ընդհանուր ոճը։

Salooote-ում կարող եք գտնել նշանադրության համար անհրաժեշտ ծառայությունները մեկ հարթակում՝ սկսած {{flowers}}-ից և {{decorations}}-ից մինչև {{photography}}, {{music}} և {{cake}}։

Պարզապես պատկերացրեք ձեր իդեալական պահը — իսկ մնացածը կարելի է իրականացնել ճիշտ մասնագետների օգնությամբ։`,

  en: `What could be more emotional than the moment when two people decide to build their future together?

An engagement is not just a ceremony; it is a promise of love, the beginning of a new journey, and the moment when two families become one.

Every engagement is unique. Some prefer an intimate family setting, while others choose a larger and more impressive celebration.

The engagement atmosphere is created through the right details: elegant {{flowers}}, beautiful {{decorations}}, romantic {{music}}, memorable {{photography}}, and carefully chosen {{gifts}}.

This day is also a chance to express your love beautifully through the venue, lighting, and overall style.

Of course, an engagement is the first step toward the {{wedding}}, often setting the tone for your future celebration.

If you want this day to be truly special, it is important to think through every detail: the venue, atmosphere, guest list, and overall style.

On Salooote, you can find all the services you need for an engagement in one place — from {{flowers}} and {{decorations}} to {{photography}}, {{music}}, and {{cake}}.

Simply imagine your ideal moment — and make the rest happen with the help of the right professionals.`,

  ru: `Что может быть трогательнее момента, когда два человека решают вместе строить своё будущее?

Помолвка — это не просто церемония, а обещание любви, начало нового пути и момент, когда две семьи становятся одной.

Каждая помолвка уникальна. Кто-то выбирает тёплую семейную атмосферу, а кто-то — более масштабное и впечатляющее мероприятие.

Атмосфера помолвки создаётся деталями: нежные {{flowers}}, красивое {{decorations}}, романтичная {{music}}, памятная {{photography}} и тщательно выбранные {{gifts}}.

Этот день также даёт возможность красиво выразить вашу любовь через место, освещение и общий стиль.

Конечно, помолвка — это первый шаг к {{wedding}}, и она часто задаёт настроение будущего торжества.

Если вы хотите, чтобы этот день был действительно особенным, важно продумать каждую деталь: место, атмосферу, список гостей и общий стиль.

На Salooote вы найдёте все услуги для помолвки в одном месте — от {{flowers}} и {{decorations}} до {{photography}}, {{music}} и {{cake}}.

Просто представьте свой идеальный момент — а остальное реализуйте с помощью подходящих специалистов.`,
},
    icon: Sparkles,
    image: "/images/flowers-roses.jpg",
    accent: "from-violet-500 to-rose-500",
    keywords: ["engagement", "proposal", "ring", "flowers", "romantic"],
    suggestedCats: ["flowers", "cakes", "photography"],
    checklist: {
      en: ["Choose the venue", "Order flowers", "Get a cake", "Book photographer", "Plan the surprise"],
      hy: ["Ընտրել վայրը", "Պատվիրել ծաղիկներ", "Պատվիրել տորթ", "Ամրագրել ֆոտոգրաֆ", "Պլանավորել անակնկալը"],
      ru: ["Выбрать место", "Заказать цветы", "Заказать торт", "Забронировать фотографа", "Спланировать сюрприз"],
    },
    bestFor: { en: "Couples · Pre-wedding", hy: "Զույգեր · Հարսանիքից առաջ", ru: "Пары · До свадьбы" },
    daysAhead: 14,
  },
  anniversary: {
    label: "Anniversaries",
    labelHy: "Ամյակներ",
    labelRu: "Юбилеи",
    desc: "Honor every milestone with a celebration your loved ones will treasure.",
    descHy: "Ամյակն անմոռանալի դարձրե՛ք Salooote-ի լավագույն մատակարարների հետ։",
    descRu: "Сделайте юбилей незабываемым с лучшими поставщиками Salooote.",
about: {
  hy: `Ի՞նչը կարող է լինել ավելի ջերմ ու նշանակալի, քան տարիների ընթացքում կերտված սիրո և հիշողությունների նշումը։

Հոբելյանը պարզապես տարեդարձ չէ․ դա անցած ճանապարհի գնահատում է, միասին հաղթահարված պահերի հիշեցում և նոր պատմությունների սկիզբ։

Անկախ նրանից՝ նշում եք ամուսնության տարեդարձ, ծննդյան հոբելյան կամ ընկերության կարևոր փուլ, այս օրը հնարավորություն է կանգ առնելու, նայելու հետ և գնահատելու այն ամենը, ինչ արդեն ստեղծել եք։

Հոբելյանական մթնոլորտը ստեղծվում է մանրուքներից՝ գեղեցիկ {{decorations}}, ջերմ {{music}}, համեղ {{catering}}, հիշարժան {{photography}} և, իհարկե, հատուկ պատրաստված {{cake}}։

Այս օրը հաճախ դառնում է նաև անակնկալների օր՝ {{gifts}}, շնորհավորական խոսքեր, հիշողություններով լի տեսանյութեր և պահեր, որոնք հուզում ու միավորում են բոլոր ներկաներին։

Հոբելյանական տոները կարող են լինել տարբեր՝ ջերմ ընտանեկան ընթրիքից մինչև մեծ ու շքեղ միջոցառում։ Կարևորն այն է, որ այդ օրը արտացոլի հենց ձեր պատմությունն ու արժեքները։

Եթե ցանկանում եք, որ այս օրը լինի իսկապես առանձնահատուկ, կարևոր է մտածել յուրաքանչյուր մանրուքի մասին՝ վայրը, հյուրերի ցանկը, երաժշտությունը և ընդհանուր մթնոլորտը։

Salooote-ում կարող եք գտնել հոբելյանական միջոցառման համար անհրաժեշտ ծառայությունները մեկ հարթակում՝ սկսած {{decorations}}-ից և {{catering}}-ից մինչև {{music}}, {{photography}} և {{cake}}։

Պարզապես պատկերացրեք Ձեր իդեալական օրը — իսկ մնացածը կարելի է վստահել ճիշտ մասնագետներին։`,

  en: `What could be warmer and more meaningful than celebrating love, memories, and the journey built over the years?

An anniversary is not just a date; it is a celebration of the path you have taken, the moments you have overcome together, and the beginning of new memories.

Whether you are celebrating a wedding anniversary, a birthday milestone, or an important company achievement, this day is a chance to pause, look back, and appreciate everything you have created.

The anniversary atmosphere is created through thoughtful details: beautiful {{decorations}}, warm {{music}}, delicious {{catering}}, memorable {{photography}}, and, of course, a special {{cake}}.

This day often becomes a day of surprises too — {{gifts}}, heartfelt speeches, memory-filled videos, and moments that touch and unite everyone present.

Anniversary celebrations can be very different: from a warm family dinner to a large and elegant event. What matters most is that the day reflects your story and values.

If you want this day to be truly special, it is important to think through every detail: the venue, guest list, music, and overall atmosphere.

On Salooote, you can find all the services you need for an anniversary celebration in one place — from {{decorations}} and {{catering}} to {{music}}, {{photography}}, and {{cake}}.

Simply imagine your ideal day — and leave the rest to the right professionals.`,

  ru: `Что может быть теплее и значимее, чем отметить любовь, воспоминания и путь, пройденный за годы?

Юбилей — это не просто дата, а возможность оценить пройденный путь, вспомнить моменты, пережитые вместе, и начать новую главу воспоминаний.

Независимо от того, отмечаете ли вы годовщину свадьбы, день рождения или важный этап компании, этот день даёт возможность остановиться, оглянуться назад и оценить всё, что уже создано.

Атмосфера юбилея создаётся деталями: красивое {{decorations}}, тёплая {{music}}, вкусный {{catering}}, памятная {{photography}} и, конечно, особенный {{cake}}.

Этот день часто становится днём сюрпризов — {{gifts}}, трогательные слова, видео с воспоминаниями и моменты, которые объединяют всех присутствующих.

Юбилейные праздники могут быть разными: от уютного семейного ужина до большого и элегантного мероприятия. Главное, чтобы этот день отражал вашу историю и ценности.

Если вы хотите, чтобы этот день был действительно особенным, важно продумать каждую деталь: место, список гостей, музыку и общую атмосферу.

На Salooote вы найдёте все услуги для юбилея в одном месте — от {{decorations}} и {{catering}} до {{music}}, {{photography}} и {{cake}}.

Просто представьте свой идеальный день — а остальное доверьте профессионалам.`,
},
    icon: Star,
    image: "/images/wedding-cake.jpg",
    accent: "from-amber-500 to-orange-500",
    keywords: ["anniversary", "celebration", "flowers", "cake", "romantic"],
    suggestedCats: ["cakes", "flowers", "catering"],
    checklist: {
      en: ["Pick a venue", "Order a special cake", "Get flowers", "Plan dinner / event", "Arrange entertainment"],
      hy: ["Ընտրել վայրը", "Պատվիրել հատուկ տորթ", "Պատվիրել ծաղիկներ", "Պլանավորել ընթրիք / միջոցառում", "Կազմակերպել ժամանց"],
      ru: ["Выбрать место", "Заказать особый торт", "Заказать цветы", "Спланировать ужин", "Организовать развлечения"],
    },
    bestFor: { en: "Couples · Family milestones", hy: "Զույգեր · Ընտանեկան տարեդարձներ", ru: "Пары · Семейные юбилеи" },
    daysAhead: 14,
  },
  "kids-party": {
    label: "Kids' Parties",
    labelHy: "Մանկական Տոներ",
    labelRu: "Детские Праздники",
    desc: "Create magical moments that little ones will remember forever.",
    descHy: "Երեխաների համար ստեղծե՛ք հեքիաթային հիշողություններ Salooote-ի մատակարարների հետ։",
    descRu: "Создайте сказочные воспоминания для детей с поставщиками Salooote.",
about: {
  hy: `Ի՞նչը կարող է լինել ավելի ուրախ ու կախարդական, քան երեխայի տոնը՝ լի ծիծաղով, խաղերով և անմոռանալի պահերով։

Մանկական տոները առանձնահատուկ են, քանի որ յուրաքանչյուր մանրուք ստեղծված է փոքրիկի ուրախության համար։ Այս օրը պետք է լինի լի գույներով, հույզերով և անակնկալներով։

Տոնական մթնոլորտը ձևավորվում է գեղեցիկ {{decorations}}, գունավոր {{balloons}}, թեմատիկ {{entertainment}} և սիրելի հերոսների մասնակցությամբ։

Փոքրիկների համար տոնը դառնում է իրական հեքիաթ, որտեղ կարևոր դեր ունեն նաև համեղ {{cake}}-ը, քաղցրավենիքները և փոքրիկ {{gifts}}-ը։

Ծնողները կարող են ընտրել տարբեր ձևաչափեր՝ փոքր ընտանեկան տոնից մինչև մեծ ու կազմակերպված միջոցառում՝ խաղերով, ծրագրերով և ակտիվություններով։

Եթե ցանկանում եք, որ Ձեր երեխայի օրը լինի իսկապես հիշվող, կարևոր է նախապես պլանավորել ամեն ինչ՝ սկսած ձևավորումից մինչև ժամանցային ծրագիր։

Salooote-ում կարող եք գտնել մանկական տոնի համար անհրաժեշտ բոլոր ծառայությունները մեկ հարթակում՝ սկսած {{decorations}}-ից և {{balloons}}-ից մինչև {{entertainment}}, {{cake}} և {{photography}}։

Դարձրեք Ձեր երեխայի տոնը իսկապես անմոռանալի։`,

  en: `What could be more joyful and magical than a child’s celebration filled with laughter, games, and unforgettable moments?

Kids’ parties are truly special, where every detail is designed to bring happiness to the little one. This day should be full of color, эмоции, and surprises.

The festive atmosphere is created through beautiful {{decorations}}, colorful {{balloons}}, themed {{entertainment}}, and beloved characters.

For children, the celebration becomes a real fairy tale, where a delicious {{cake}}, sweets, and fun {{gifts}} play an important role.

Parents can choose different formats — from a small family gathering to a larger, fully organized event with games and activities.

If you want your child’s day to be truly memorable, it is important to plan everything in advance — from decorations to entertainment.

On Salooote, you can find everything you need for a perfect kids’ party in one place — from {{decorations}} and {{balloons}} to {{entertainment}}, {{cake}}, and {{photography}}.

Make your child’s celebration truly unforgettable.`,

  ru: `Что может быть радостнее и волшебнее, чем детский праздник, наполненный смехом, играми и незабываемыми моментами?

Детские праздники особенные, ведь каждая деталь создаётся для радости ребёнка. Этот день должен быть ярким, эмоциональным и полным сюрпризов.

Праздничная атмосфера создаётся благодаря красивому {{decorations}}, ярким {{balloons}}, тематическим {{entertainment}} и любимым героям.

Для детей праздник превращается в настоящую сказку, где важную роль играют вкусный {{cake}}, сладости и небольшие {{gifts}}.

Родители могут выбрать разные форматы — от уютного семейного праздника до масштабного мероприятия с играми и активностями.

Чтобы праздник был действительно запоминающимся, важно заранее продумать все детали — от оформления до развлекательной программы.

На Salooote вы найдёте всё для идеального детского праздника в одном месте — от {{decorations}} и {{balloons}} до {{entertainment}}, {{cake}} и {{photography}}.

Сделайте праздник вашего ребёнка по-настоящему незабываемым.`,
},
    icon: Gift,
    image: "/images/party-balloons2.jpg",
    accent: "from-emerald-500 to-cyan-500",
    keywords: ["kids", "children", "birthday", "balloons", "party", "fun"],
    suggestedCats: ["cakes", "balloons", "catering"],
    checklist: {
      en: ["Order themed cake", "Get balloons & decor", "Arrange entertainment", "Prepare party favors", "Invite friends"],
      hy: ["Պատվիրել թեմատիկ տորթ", "Ապահովել փուչիկներ և դեկոր", "Կազմակերպել ժամանց", "Պատրաստել նվերներ-հուշանվերներ", "Հրավիրել ընկերներին"],
      ru: ["Заказать тематический торт", "Купить шары и декор", "Организовать развлечения", "Подготовить подарки гостям", "Пригласить друзей"],
    },
    bestFor: { en: "Children of all ages", hy: "Բոլոր տարիքի երեխաներ", ru: "Дети всех возрастов" },
    daysAhead: 7,
  },
};

const SUGGESTED_VENDORS = {
  balloons:             ["Balloon Decor", "Event Decoration", "Florists"],
  cakes:                ["Pastry & Cakes", "Desserts", "Catering"],
  "cartoon-characters": ["Animators", "Entertainment", "Performers"],
  gifts:                ["Gift Shops", "Packaging", "Personalized Gifts"],
  romantic:             ["Florists", "Balloon Decor", "Photography"],
  baptism:              ["Balloon Decor", "Pastry & Cakes", "Gift Shops"],
  "baby-tooth":         ["Balloon Decor", "Pastry & Cakes", "Gift Shops"],
  christmas:            ["Gift Shops", "Pastry & Cakes", "Holiday Decor"],
  wedding:              ["Cakes & Pastry", "Florists", "Catering", "Photography", "DJ & Music"],
  birthday:             ["Cakes & Pastry", "Balloons", "Catering", "Entertainment"],
  corporate:            ["Catering", "AV & Tech", "Entertainment", "Decor"],
  engagement:           ["Florists", "Cakes & Pastry", "Photography", "Jewelry"],
  anniversary:          ["Cakes & Pastry", "Florists", "Catering", "Entertainment"],
  "kids-party":         ["Cakes & Pastry", "Balloons & Decor", "Catering", "Animators"],
};

/* ────────────────────────────────────────────────────────────────────
   Component
──────────────────────────────────────────────────────────────────── */
export default function EventTypeClient({ lang, type, dict }) {
  const t = T[lang] || T.en;

  const meta = EVENT_META[type] || {
    label: type.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    labelHy: type.replace(/-/g, " "),
    labelRu: type.replace(/-/g, " "),
    desc: "Find the best vendors for your event on Salooote.",
    descHy: "Salooote-ում գտե՛ք լավագույն մատակարարներին Ձեր միջոցառման համար։",
    descRu: "Найдите лучших поставщиков для вашего мероприятия на Salooote.",
    about: { hy: "", en: "", ru: "" },
    icon: Sparkles,
    image: "/images/wedding-cake.jpg",
    accent: "from-rose-500 to-fuchsia-500",
    keywords: [],
    suggestedCats: [],
    checklist: { en: [], hy: [], ru: [] },
    bestFor: { en: "", hy: "", ru: "" },
    daysAhead: 7,
  };

  const Icon = meta.icon;
  const [products, setProducts] = useState([]);
  const [vendors, setVendors]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [checked, setChecked]   = useState({});

  useEffect(() => {
    const q = meta.keywords[0] || type;
    Promise.all([
      productsAPI.list({ search: q, limit: 8, locale: lang }).catch(() => null),
      vendorsAPI.list({ limit: 8 }).catch(() => null),
    ]).then(([pRes, vRes]) => {
      setProducts((pRes?.data || []).map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug || "",
        vendor_slug: p.vendor_slug || "",
        price: parseFloat(p.price) || 0,
        originalPrice: p.compare_price ? parseFloat(p.compare_price) : null,
        rating: parseFloat(p.rating) || 0,
        reviews: p.review_count || 0,
        vendor: p.vendor_name || "",
        image: p.thumbnail_url || p.images?.[0]?.url || null,
        tags: p.tags || [],
        gradient: "from-brand-50 to-brand-100",
      })));
      setVendors(vRes?.data || []);
    }).finally(() => setLoading(false));
  }, [type, lang]);

  const localLabel = lang === "hy" ? meta.labelHy : lang === "ru" ? meta.labelRu : meta.label;
  const localDesc  = lang === "hy" ? meta.descHy  : lang === "ru" ? meta.descRu  : meta.desc;
  const aboutText  = meta.about?.[lang] || meta.about?.en || "";
  const checklist  = meta.checklist?.[lang] || meta.checklist?.en || [];
  const bestForText = meta.bestFor?.[lang] || meta.bestFor?.en || "";

  const doneCount = Object.values(checked).filter(Boolean).length;
  const progressPct = checklist.length > 0 ? (doneCount / checklist.length) * 100 : 0;

  // Related events: only true "occasions" (not service categories like balloons, cakes, gifts)
  const REAL_EVENTS = ["wedding", "birthday", "engagement", "anniversary", "kids-party", "corporate", "baptism", "baby-tooth", "christmas"];
  const related = useMemo(() => {
    return REAL_EVENTS.filter(k => k !== type && EVENT_META[k]).slice(0, 6).map(k => ({
      slug: k,
      label: lang === "hy" ? EVENT_META[k].labelHy : lang === "ru" ? EVENT_META[k].labelRu : EVENT_META[k].label,
      image: EVENT_META[k].image,
      accent: EVENT_META[k].accent,
    }));
  }, [type, lang]);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero — full-bleed photo + gradient overlay ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={meta.image}
            alt={localLabel}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${meta.accent} opacity-85`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
          <div
            className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />
        </div>

        <div className="relative max-w-container mx-auto px-6 md:px-8 pt-8 pb-20 md:pt-10 md:pb-28">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/80 text-sm mb-10">
            <Link href={`/${lang}`} className="inline-flex items-center gap-1.5 hover:text-white no-underline text-white/80 transition-colors">
              <ArrowLeft size={14} /> {t.home}
            </Link>
            <ChevronRight size={12} className="opacity-50" />
            <Link href={`/${lang}/events`} className="hover:text-white no-underline text-white/80 transition-colors">
              {t.events}
            </Link>
            <ChevronRight size={12} className="opacity-50" />
            <span className="text-white font-medium truncate">{localLabel}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-8"
            >
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full pl-2 pr-3.5 py-1 mb-5">
                <span className="w-7 h-7 rounded-full bg-white/95 flex items-center justify-center">
                  <Icon size={15} className="text-surface-900" strokeWidth={2.2} />
                </span>
                <span className="text-white text-xs font-semibold tracking-wide uppercase">{t.eyebrow}</span>
              </div>

              <h1 className="text-white font-display text-[42px] md:text-[68px] leading-[1.02] font-black tracking-tight mb-4">
                {localLabel}
              </h1>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed">
                {localDesc}
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <Link
                  href={`/${lang}/vendor`}
                  className="inline-flex items-center gap-2 bg-white text-surface-900 hover:bg-white/95 px-5 py-3 rounded-full font-semibold text-sm shadow-lg shadow-black/10 transition-all hover:scale-[1.02] no-underline"
                >
                  {t.heroCtaVendors} <ArrowRight size={16} />
                </Link>
                <Link
                  href={`/${lang}/planner`}
                  className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white/25 px-5 py-3 rounded-full font-semibold text-sm transition-all no-underline"
                >
                  <Wand2 size={16} /> {t.heroCtaAI}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-4"
            >
              {/* Quick Facts card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5">
                <p className="text-white/70 text-[11px] font-bold tracking-widest uppercase mb-3">{t.quickFacts}</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Calendar size={14} />
                    </div>
                    <div className="text-sm leading-tight">
                      <div className="font-semibold">{meta.daysAhead}+ {t.daysAhead}</div>
                      <div className="text-white/70 text-xs">{t.statsAvgPrep}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <MapPin size={14} />
                    </div>
                    <div className="text-sm leading-tight">
                      <div className="font-semibold">{t.inYerevan}</div>
                      <div className="text-white/70 text-xs">{t.bestFor} · {bestForText}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Clock size={14} />
                    </div>
                    <div className="text-sm leading-tight">
                      <div className="font-semibold">2 {t.minutes}</div>
                      <div className="text-white/70 text-xs">{t.statsHappy}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 inset-x-0 h-6 bg-white" style={{ clipPath: "ellipse(70% 100% at 50% 100%)" }} />
      </section>

      {/* ── Trust strip ── */}
      <section className="border-b border-surface-100 bg-white">
        <div className="max-w-container mx-auto px-6 md:px-8 py-5 grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, label: t.trustQuality },
            { icon: Clock,       label: t.trustOnTime },
            { icon: Heart,       label: t.trustSupport },
          ].map(({ icon: I, label }, i) => (
            <div key={i} className="flex items-center gap-2.5 text-surface-700 text-sm">
              <I size={16} className="text-rose-500" />
              <span className="font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main grid ── */}
      <div className="max-w-container mx-auto px-6 md:px-8 py-14">
        <div className="flex gap-10 flex-wrap lg:flex-nowrap">

          {/* MAIN COLUMN */}
          <div className="flex-1 min-w-0">

            {/* About */}
            {aboutText && (
              <section className="mb-14">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${meta.accent}`} />
                  <h2 className="text-2xl md:text-[28px] font-bold text-surface-900 tracking-tight">{t.aboutTitle}</h2>
                </div>
                <div className="bg-surface-50 rounded-3xl border border-surface-100 p-6 md:p-8">
                  {aboutText.split("\n\n").map((para, i) => (
                    <p key={i} className={`text-surface-700 leading-[1.75] text-[15px] md:text-base${i < aboutText.split("\n\n").length - 1 ? " mb-4" : ""}`}>
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* AI CTA */}
            <section className="mb-14">
              <Link
                href={`/${lang}/planner`}
                className="block no-underline group"
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-600 p-7 md:p-9 text-white">
                  {/* glow */}
                  <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-2.5 py-1 mb-3">
                        <Sparkles size={12} />
                        <span className="text-[10px] font-bold tracking-widest uppercase">{t.aiBadge}</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2">{t.aiTitle}</h3>
                      <p className="text-white/90 text-sm md:text-base max-w-xl leading-relaxed">{t.aiSubtitle}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center gap-2 bg-white text-rose-600 px-5 py-3 rounded-full font-bold text-sm shadow-lg group-hover:scale-[1.04] transition-transform">
                        <Wand2 size={16} /> {t.aiCta}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </section>

            {/* Products */}
            <section className="mb-14">
              <div className="flex items-end justify-between mb-6 gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${meta.accent}`} />
                  <h2 className="text-2xl md:text-[28px] font-bold text-surface-900 tracking-tight">{t.productsTitle}</h2>
                </div>
                <Link href={`/${lang}/products`} className="text-sm text-rose-600 font-semibold no-underline inline-flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap">
                  {t.productsAll} <ChevronRight size={14} />
                </Link>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-[300px] bg-surface-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <ProductCard product={p} lang={lang} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center bg-surface-50 rounded-3xl border border-surface-100">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white border border-surface-200 flex items-center justify-center">
                    <Gift size={22} className="text-surface-400" />
                  </div>
                  <p className="text-surface-500 text-sm mb-3">{t.productsEmpty}</p>
                  <Link href={`/${lang}/products`} className="inline-flex items-center gap-1 text-rose-600 text-sm font-semibold no-underline hover:gap-2 transition-all">
                    {t.productsAll} <ChevronRight size={14} />
                  </Link>
                </div>
              )}
            </section>

            {/* Vendors */}
            {vendors.length > 0 && (
              <section className="mb-14">
                <div className="flex items-end justify-between mb-6 gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${meta.accent}`} />
                    <h2 className="text-2xl md:text-[28px] font-bold text-surface-900 tracking-tight">{t.vendorsTitle}</h2>
                  </div>
                  <Link href={`/${lang}/vendor`} className="text-sm text-rose-600 font-semibold no-underline inline-flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap">
                    {t.vendorsAll} <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vendors.slice(0, 6).map((v, i) => (
                    <motion.div key={v.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <Link href={`/${lang}/vendor/${v.slug}`} className="no-underline group">
                        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-surface-200 hover:border-rose-300 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.accent} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                            {v.business_name?.[0] || "V"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-surface-900 text-sm truncate group-hover:text-rose-600 transition-colors">{v.business_name}</p>
                            {v.city && <p className="text-xs text-surface-400 mt-0.5 inline-flex items-center gap-1"><MapPin size={10} /> {v.city}</p>}
                          </div>
                          <ChevronRight size={14} className="text-surface-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Related occasions */}
            {related.length > 0 && (
              <section>
                <div className="flex items-end justify-between mb-6 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${meta.accent}`} />
                      <h2 className="text-2xl md:text-[28px] font-bold text-surface-900 tracking-tight">{t.relatedTitle}</h2>
                    </div>
                    <p className="text-sm text-surface-500 ml-3">{t.relatedSubtitle}</p>
                  </div>
                  <Link href={`/${lang}/events`} className="text-sm text-rose-600 font-semibold no-underline inline-flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap">
                    {t.events} <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {related.map(r => (
                    <Link key={r.slug} href={`/${lang}/events/${r.slug}`} className="no-underline group">
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-surface-100 group-hover:ring-rose-200 transition-all">
                        <Image src={r.image} alt={r.label} fill sizes="(max-width:640px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${r.accent} opacity-60 group-hover:opacity-50 transition-opacity`} />
                        <div className="absolute inset-0 flex items-end p-4">
                          <div className="text-white font-bold text-base md:text-lg leading-tight">{r.label}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* SIDEBAR */}
          {checklist.length > 0 && (
            <aside className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
              {/* Checklist */}
              <div className="bg-white rounded-3xl border border-surface-200 shadow-sm p-5 lg:sticky lg:top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-surface-900 text-base">{t.checklistTitle}</h3>
                  <span className="text-xs text-surface-500 font-medium">
                    {doneCount}/{checklist.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-5">
                  <div className="h-1.5 rounded-full bg-surface-100 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${meta.accent} transition-all duration-500`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-surface-400 mt-1.5">{t.checklistProgress} · {Math.round(progressPct)}%</p>
                </div>

                <div className="space-y-1.5">
                  {checklist.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setChecked(prev => ({ ...prev, [i]: !prev[i] }))}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-50 transition-colors cursor-pointer border-none bg-transparent text-left"
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        checked[i]
                          ? "bg-rose-600 border-rose-600"
                          : "border-surface-300 group-hover:border-rose-300"
                      }`}>
                        {checked[i] && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm leading-snug transition-colors ${checked[i] ? "line-through text-surface-400" : "text-surface-700"}`}>
                        {item}
                      </span>
                    </button>
                  ))}
                </div>

                {/* AI helper inside sidebar */}
                <div className="mt-5 pt-5 border-t border-surface-100">
                  <Link
                    href={`/${lang}/planner`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 border border-rose-100 transition-colors no-underline"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white flex-shrink-0">
                      <Wand2 size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-surface-900 leading-tight">{t.aiCta}</p>
                      <p className="text-[11px] text-surface-500 mt-0.5 truncate">{t.aiBadge} · Sali</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Suggested vendor categories */}
              <div className="bg-surface-50 rounded-3xl border border-surface-100 p-5">
                <h3 className="font-bold text-surface-900 text-sm mb-3">{t.suggestedTitle}</h3>
                <div className="flex flex-wrap gap-2">
                  {(SUGGESTED_VENDORS[type] || []).map((v, i) => {
                    const slug = (meta.suggestedCats || [])[i];
                    return slug ? (
                      <Link
                        key={i}
                        href={`/${lang}/category/${slug}`}
                        className="inline-flex items-center gap-1 text-xs bg-white text-surface-700 border border-surface-200 px-3 py-1.5 rounded-full font-medium hover:border-rose-300 hover:text-rose-600 transition-colors no-underline"
                      >
                        <CheckCircle2 size={11} className="text-rose-400" />
                        {v}
                      </Link>
                    ) : (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-xs bg-white text-surface-700 border border-surface-200 px-3 py-1.5 rounded-full font-medium"
                      >
                        <CheckCircle2 size={11} className="text-rose-400" />
                        {v}
                      </span>
                    );
                  })}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
