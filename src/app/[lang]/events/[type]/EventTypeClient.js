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
    eyebrow: "Պլանավորիր քո պահը",
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
    productsAll: "Տեսնել բոլոր ապրանքները",
    productsEmpty: "Դեռ ապրանքներ չկան — շուտով հասանելի կլինեն։",
    vendorsTitle: "Առաջարկվող մատակարարներ",
    vendorsAll: "Տեսնել բոլորին",
    aiTitle: "Չգիտե՞ք որտեղից սկսել",
    aiSubtitle: "Պատմեք Sali-ին, թե ինչ եք նշում — և ստացեք անձնավորված ստուգաթերթ, համապատասխան մատակարարներ ու գները վայրկյանների ընթացքում։",
    aiCta: "Բացել AI Պլանավորողը",
    aiBadge: "AI Օգնական",
    checklistTitle: "Պլանավորման ստուգաթերթ",
    checklistDone: "կատարված",
    checklistProgress: "Առաջընթաց",
    suggestedTitle: "Անհրաժեշտ մատակարարներ",
    relatedTitle: "Այլ առիթներ",
    relatedSubtitle: "Բացահայտեք ավելին",
    trustQuality: "Ստուգված որակ",
    trustOnTime: "Ժամանակին առաքում",
    trustSupport: "Բարյացակամ աջակցություն",
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
      hy: "Salooote հարթակում կարող եք գտնել փուչիկներով ձևավորման լավագույն մասնագետներին՝ Ձեր միջոցառումը յուրահատուկ դարձնելու համար։\n\nՄեր գործընկերները ձևավորում են հոբելյաններ, մկրտություններ, ծննդյան տոներ, ատամհատիքներ և կորպորատիվ միջոցառումներ՝ անհատական դիզայնով՝ ըստ Ձեր նախասիրության։\n\nԿարող եք ընտրել պատրաստի տարբերակներից կամ կապ հաստատել մասնագետների հետ՝ Ձեր գաղափարը կյանքի կոչելու համար։",
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
    descHy: "Պատվիրե՛ք գեղեցիկ տոնական տորթեր ամենատարբեր առիթների համար Հայաստանի լավագույն հրուշակագործներից։",
    descRu: "Заказывайте красивые праздничные торты для любого повода у лучших кондитеров Армении.",
    about: {
      hy: "Salooote-ում կարող եք պատվիրել տոնական տորթեր լավագույն հրուշակագործներից՝ ըստ Ձեր նախասիրության։\n\nՀարթակում ներկայացված են մանկական, մրգային, թեմատիկ և անհատական դիզայնով տորթեր ամենատարբեր առիթների համար՝ լինի ծննդյան տոն, մկրտություն, ատամհատիկ թե հոբելյան։\n\nՊատվերներն ընդունվում են 2-3 օր առաջ և առաքվում են Երևանում և ամբողջ Հայաստանում։",
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
    descHy: "Կյանքի կոչե՛ք հեքիաթն ու ժամանցի անմոռանալի ծրագիր կազմակերպե՛ք Ձեր երեխայի տոնի համար։",
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
    descHy: "Գտե՛ք օրիգինալ ու յուրահատուկ նվերներ ցանկացած տարիքի, սեռի և առիթի համար։",
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
    descHy: "Ստեղծե՛ք անմոռանալի ռոմանտիկ պահ Salooote-ի մատակարարների օգնությամբ։",
    descRu: "Создайте незабываемый романтический момент с помощью специалистов на Salooote.",
    about: {
      hy: "Salooote-ում կարող եք գտնել ռոմանտիկ ձևավորումների և սիրո խոստովանությունների կազմակերպման մասնագետներ։\n\nԴուք ուզում եք, որ ամեն ինչ կատարյալ լինի։ Ուզում եք, որ Ձեր փոխարեն խոսեն գեղեցիկ իրերը՝ մոմերը, ծաղիկները, փուչիկները, ֆոտոզոնաները…\n\nՍտեղծե՛ք անմոռանալի պահ՝ ընտրելով պատրաստի սցենար կամ ձևակերպելով Ձեր սեփական գաղափարը մատակարարների հետ։",
      en: "Find professionals for romantic setups and proposals on Salooote.\n\nYou want everything to be perfect. You want the flowers, candles, balloons, and photo zones to speak for you — and Salooote vendors are here to make that happen.\n\nCreate an unforgettable moment by choosing a ready-made concept or designing your own unique experience.",
      ru: "Найдите на Salooote специалистов по романтическим оформлениям и предложениям руки и сердца.\n\nВы хотите, чтобы всё было идеально. Чтобы вместо вас говорили красивые вещи — свечи, цветы, шары, фотозоны.\n\nСоздайте незабываемый момент, выбрав готовый сценарий или разработав уникальную идею вместе с исполнителями.",
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
    descHy: "Կյանքի ամենակարևոր արարողություններից մեկն անմոռանալի դարձրե՛ք Salooote-ի մատակարարների օգնությամբ։",
    descRu: "Сделайте одно из самых важных таинств жизни незабываемым с помощью специалистов Salooote.",
    about: {
      hy: "Կնունքի արարողությունն ամենակարևոր ու հիշարժան պահերից է Ձեր ընտանիքի կյանքում։\n\nSalooote-ում կարող եք գտնել փորձառու մասնագետներ, ովքեր կօգնեն ձևավորել այս հատուկ օրը ամենագեղեցիկ ձևով։\n\nԸնտրե՛ք ձևավորման ոճ, պատվիրե՛ք տորթ, նվերներ կամ այլ անհրաժեշտ ծառայություններ։",
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
      hy: "Ձեր փոքրիկն արդեն ատամ է հանե՞լ։ Ատամհատիկը հատուկ առիթ է, որ արժե նշել գեղեցիկ ու անմոռանալի կերպով։\n\nՇատերն ինքնուրույն կազմակերպում են ատամհատիքը, ոմանք էլ նախընտրում են վստահել ավելի փորձառուներին։\n\nSalooote-ում կարող եք գտնել ատամհատիկի ձևավորման մասնագետներ, տորթ պատվիրել, ընտրել անհրաժեշտ պարագաներ։",
      en: "Has your little one cut their first tooth? A tooth party is a special occasion worth celebrating beautifully.\n\nSome parents organize it themselves, while others prefer to entrust the planning to experienced professionals.\n\nOn Salooote, you can find decoration specialists, order a cake, choose all the necessary supplies, and plan the entire celebration.",
      ru: "Ваш малыш уже прорезал первый зубик? Праздник первого зубика — особый повод, который стоит отметить красиво и незабываемо.\n\nОдни родители организуют его самостоятельно, другие предпочитают доверить подготовку опытным специалистам.\n\nНа Salooote вы найдёте специалистов по оформлению, закажете торт, выберете нужные аксессуары.",
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
      hy: "Ամանորը մոտենում է, և Salooote-ը կօգնի Ձեզ կատարյալ դարձնել տոնական մթնոլորտը։\n\nՀարկ է ճիշտ նվեր ընտրել, ձևավորել տունն ու միջոցառումը, պատվիրել տոնական տորթ։\n\nՀարթակում կարող եք գտնել ամանորյա ձևավորման մատակարարներ, ընտրել օրիգինալ ամանորյա նվերներ և բոլոր անհրաժեշտ պարագաները։",
      en: "The New Year is approaching, and Salooote is here to help you create the perfect festive atmosphere.\n\nChoosing the right gift, decorating your home, ordering a festive cake — these are questions that concern almost everyone.\n\nFind Christmas decoration vendors, choose original New Year gifts, gift boxes, and everything you need for a magical celebration.",
      ru: "Новый год приближается, и Salooote поможет вам создать идеальную праздничную атмосферу.\n\nВыбрать правильный подарок, украсить дом, заказать праздничный торт — вопросы, которые волнуют почти каждого.\n\nНайдите поставщиков новогодних украшений, выберите оригинальные подарки, подарочные коробки и всё необходимое.",
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
    descHy: "Ձեր հարսանյաց օրն անմոռանալի դարձնելու համար անհրաժեշտ ամեն ինչ Salooote-ում։",
    descRu: "Всё необходимое для того, чтобы ваш свадебный день был идеальным — на Salooote.",
    about: {
      hy: "Հարսանիքն Ձեր կյանքի ամենակարևոր ու հիշարժան օրերից է։ Salooote-ում կարող եք գտնել լավագույն մատակարարներ Ձեր հարսանյաց բոլոր կարիքների համար։\n\nԾաղիկներ, տորթ, սննդի մատուցում, ֆոտոգրաֆ, երաժշտություն — ամեն ինչ Salooote-ի հարթակում մեկ տեղում։\n\nՀամեմատե՛ք, ընտրե՛ք, կազմակերպե՛ք Ձեր կատարյալ հարսանիքը հեշտ ու արագ։",
      en: "Your wedding day is one of the most important and memorable days of your life. On Salooote, you can find the best vendors for all your wedding needs.\n\nFlowers, cakes, catering, photography, music — all in one place on the Salooote platform.\n\nCompare, choose, and plan your perfect wedding easily and quickly.",
      ru: "Свадьба — один из самых важных и незабываемых дней в вашей жизни. На Salooote вы найдёте лучших поставщиков для всех свадебных нужд.\n\nЦветы, торты, кейтеринг, фотография, музыка — всё в одном месте на платформе Salooote.\n\nСравнивайте, выбирайте и организовывайте идеальную свадьбу легко и быстро.",
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
      hy: "Ծննդյան տոնը հատուկ օր է, որ արժե նշել հեքիաթային ձևով — թե՛ փոքրի, թե՛ մեծի համար։\n\nSalooote-ում կարող եք գտնել լավագույն մատակարարներ ծննդյան տոնի բոլոր կարիքների համար՝ գունագեղ փուչիկներ, թեմատիկ ձևավորում, մոմեր, լույսեր, տորթ, ժամանցային ծրագիր։\n\nԿազմակերպե՛ք Ձեր կամ Ձեր սիրելիի ծննդյան տոնը հեշտ ու արագ՝ մեկ հարթակում։",
      en: "A birthday is a special day worth celebrating in the most magical way — for kids and adults alike.\n\nOn Salooote, you can find the best vendors for all birthday needs: colorful balloons, themed decorations, candles, lights, cakes, and entertainment.\n\nPlan your own or your loved one's birthday easily and quickly in one platform.",
      ru: "День рождения — особый день, который стоит отмечать самым волшебным образом — и для детей, и для взрослых.\n\nНа Salooote вы найдёте лучших поставщиков для всех потребностей дня рождения: красочные шары, тематическое оформление, свечи, торты, развлечения.\n\nОрганизуйте свой или чужой день рождения легко и быстро на одной платформе.",
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
    descHy: "Ձեր կորպորատիվ միջոցառումն անթերի կազմակերպե՛ք Salooote-ի մատակարարների օգնությամբ։",
    descRu: "Организуйте безупречное корпоративное мероприятие с помощью поставщиков Salooote.",
    about: {
      hy: "Salooote-ում կարող եք գտնել կորպորատիվ միջոցառումների կազմակերպման բոլոր ծառայությունները մեկ հարթակում։\n\nՍննդի մատուցում, ձևավորում, ժամանցային ծրագրեր, ֆոտոգրաֆ — ամեն ինչ, ինչ անհրաժեշտ է Ձեր կամ Ձեր ընկերության միջոցառման համար։\n\nՀամեմատե՛ք, ընտրե՛ք, կազմակերպե՛ք։",
      en: "On Salooote, you can find all the services for organizing corporate events in one platform.\n\nCatering, decoration, entertainment programs, photography — everything your company event needs.\n\nCompare vendors, choose the best, and organize effortlessly.",
      ru: "На Salooote вы найдёте все услуги для организации корпоративных мероприятий на одной платформе.\n\nКейтеринг, оформление, развлекательные программы, фотография — всё необходимое для вашего корпоратива.\n\nСравнивайте поставщиков, выбирайте лучших и организовывайте без лишних хлопот.",
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
    descHy: "Կատարյալ նշանդրեք կազմակերպե՛ք Salooote-ի մատակարարների օգնությամբ։",
    descRu: "Организуйте идеальную помолвку с помощью поставщиков Salooote.",
    about: {
      hy: "Նշանդրեքն անմոռանալի պահ է, որ պահանջում է կատարյալ կազմակերպում։\n\nSalooote-ում կարող եք գտնել ծաղիկներ, տորթ, ֆոտոգրաֆ, ռոմանտիկ ձևավորում — ամեն ինչ Ձեր կատարյալ նշանդրեքի համար։\n\nՊարզ ու հեշտ ճանապարհ՝ ամեն մանրուքը մեկ տեղում կազմակերպելու։",
      en: "An engagement is an unforgettable moment that deserves perfect planning.\n\nOn Salooote, you can find flowers, cakes, photography, and romantic setups — everything for your perfect engagement.\n\nA simple way to organize every detail in one place.",
      ru: "Помолвка — незабываемый момент, требующий идеальной организации.\n\nНа Salooote вы найдёте цветы, торты, фотографию и романтическое оформление — всё для идеальной помолвки.\n\nПростой способ организовать каждую деталь в одном месте.",
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
      hy: "Ամյակն ու հոբելյանն արժե նշել հատուկ կերպով։\n\nSalooote-ում կարող եք գտնել ամեն ինչ, ինչ անհրաժեշտ է կատարյալ հոբելյանի համար՝ ձևավորում, տորթ, ծաղիկներ, ժամանցային ծրագիր և ոչ միայն։\n\nԴարձրեք ամեն տարեդարձն իսկապես հիշարժան։",
      en: "An anniversary deserves a special celebration.\n\nOn Salooote, you can find everything needed for the perfect anniversary: decoration, cake, flowers, entertainment, and much more.\n\nMake every milestone truly memorable.",
      ru: "Юбилей заслуживает особого праздника.\n\nНа Salooote вы найдёте всё необходимое: оформление, торт, цветы, развлекательную программу и многое другое.\n\nСделайте каждый юбилей по-настоящему запоминающимся.",
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
      hy: "Մանկական տոները հատուկ են՝ փոքրիկ հոբելյարն ու հյուրերը կհիշեն ամեն մանրուք։\n\nSalooote-ում կարող եք գտնել ամեն ինչ կատարյալ մանկական տոնի համար՝ թեմատիկ ձևավորում, տորթ, մուլտֆիլմերի հերոսներ, ժամանցային ծրագիր և ոչ միայն։\n\nԴարձրեք Ձեր երեխայի տոնը անմոռանալի։",
      en: "Kids' parties are special — the little birthday star and guests will remember every detail.\n\nOn Salooote, you can find everything for a perfect children's party: themed decoration, cakes, cartoon characters, entertainment programs, and much more.\n\nMake your child's celebration truly unforgettable.",
      ru: "Детские праздники особенные — именинник и гости запомнят каждую деталь.\n\nНа Salooote вы найдёте всё для идеального детского праздника: тематическое оформление, торты, героев мультфильмов, развлекательные программы и многое другое.\n\nСделайте праздник вашего ребёнка по-настоящему незабываемым.",
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

  // Related events: pick 4 other event types
  const related = useMemo(() => {
    const all = Object.keys(EVENT_META).filter(k => k !== type);
    return all.slice(0, 6).map(k => ({
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
                  {(SUGGESTED_VENDORS[type] || []).map((v, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-xs bg-white text-surface-700 border border-surface-200 px-3 py-1.5 rounded-full font-medium hover:border-rose-300 hover:text-rose-600 transition-colors"
                    >
                      <CheckCircle2 size={11} className="text-rose-400" />
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
