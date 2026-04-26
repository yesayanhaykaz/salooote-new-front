"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, CreditCard, RotateCcw, Store, User, Settings,
  ChevronRight, ChevronDown, Search, Sparkles, MessageCircle,
  HelpCircle, ArrowRight, Wand2,
} from "lucide-react";

const T = {
  en: {
    home: "Home",
    crumb: "Help Center",
    eyebrow: "Help Center",
    title: "How can we help?",
    subtitle: "Browse guides by topic or jump straight into our most-asked questions.",
    searchPh: "Search articles, topics, or keywords…",
    topicsTitle: "Browse by topic",
    faqTitle: "Top questions",
    faqMore: "See all questions",
    contactTitle: "Still stuck?",
    contactSubtitle: "Real humans, fast replies — usually within a few hours.",
    contactCta: "Contact support",
    aiTitle: "Plan with Sali AI",
    aiSubtitle: "Tell Sali what you're celebrating — get a personalized plan in seconds.",
    aiCta: "Open AI Planner",
    aiBadge: "AI Assistant",
    topics: {
      orders: { title: "Orders & Delivery", desc: "Tracking, timelines, and shipping info." },
      payments: { title: "Payments", desc: "Methods, billing, and invoices." },
      returns: { title: "Returns & Refunds", desc: "Eligibility, process, and timelines." },
      vendors: { title: "Vendor Questions", desc: "How vendors work, reviews, disputes." },
      account: { title: "Account & Profile", desc: "Manage your profile, preferences, security." },
      tech: { title: "Technical Issues", desc: "App bugs, errors, and performance." },
    },
    faqs: [
      { q: "How do I place an order?", a: "Browse vendors, select a service or product, add it to your cart, and proceed to checkout. Payment is processed securely." },
      { q: "Can I cancel my order?", a: "You can cancel orders within 24 hours of placing them. After that, cancellation depends on the vendor's policy." },
      { q: "How long does delivery take?", a: "Delivery times vary by vendor and product type. You'll see an estimated delivery window on the product page before checkout." },
      { q: "What payment methods are accepted?", a: "We accept Visa, Mastercard, American Express, and PayPal. Local bank transfers are also available for Armenian customers." },
      { q: "How do I contact a vendor?", a: "Once you've placed an order, you can message the vendor directly from your order details page. Response times are typically within a few hours." },
    ],
  },
  hy: {
    home: "Գլխավոր",
    crumb: "Աջակցության կենտրոն",
    eyebrow: "Աջակցության կենտրոն",
    title: "Ինչպե՞ս կարող ենք օգնել",
    subtitle: "Փնտրեք թեմայով կամ անցեք ուղիղ ամենահաճախ տրվող հարցերին։",
    searchPh: "Փնտրեք հոդվածներ, թեմաներ կամ բանալի բառեր…",
    topicsTitle: "Թեմաների ընտրություն",
    faqTitle: "Ամենահաճախ տրվող հարցեր",
    faqMore: "Տեսնել բոլոր հարցերը",
    contactTitle: "Դեռ խնդիր ունե՞ք",
    contactSubtitle: "Իրական մարդիկ, արագ պատասխաններ՝ սովորաբար մի քանի ժամում։",
    contactCta: "Կապ աջակցության հետ",
    aiTitle: "Պլանավորի՛ր Sali AI-ի հետ",
    aiSubtitle: "Պատմիր Sali-ին քո առիթի մասին — ստացիր անձնավորված պլան վայրկյանների ընթացքում։",
    aiCta: "Բացել AI Պլանավորողը",
    aiBadge: "AI Օգնական",
    topics: {
      orders: { title: "Պատվերներ և Առաքում", desc: "Հետևում, ժամանակացույց, առաքում։" },
      payments: { title: "Վճարումներ", desc: "Մեթոդներ, հաշիվներ, ապրանքագրեր։" },
      returns: { title: "Վերադարձներ", desc: "Պայմաններ, գործընթաց, ժամկետներ։" },
      vendors: { title: "Մատակարարների հարցեր", desc: "Ինչպես են աշխատում, կարծիքներ, վեճեր։" },
      account: { title: "Հաշիվ և Պրոֆիլ", desc: "Կարգավորեք պրոֆիլը, անվտանգությունը։" },
      tech: { title: "Տեխնիկական խնդիրներ", desc: "Սխալներ, անսարքություններ, արագագործություն։" },
    },
    faqs: [
      { q: "Ինչպե՞ս պատվեր կատարել", a: "Դիտեք մատակարարներին, ընտրեք ապրանք կամ ծառայություն, ավելացրեք զամբյուղ և ավարտեք պատվերը։ Վճարումն ապահով է։" },
      { q: "Կարո՞ղ եմ չեղարկել պատվերը", a: "Պատվերներն կարող եք չեղարկել 24 ժամվա ընթացքում։ Հետո չեղարկումը կախված է մատակարարից։" },
      { q: "Որքա՞ն է տևում առաքումը", a: "Առաքման ժամկետները կախված են մատակարարից և ապրանքի տեսակից։ Մոտավոր ժամկետը տեսանելի է վճարումից առաջ։" },
      { q: "Ի՞նչ վճարման եղանակներ եք ընդունում", a: "Ընդունում ենք Visa, Mastercard, American Express, PayPal և տեղական փոխանցումներ։" },
      { q: "Ինչպե՞ս կապ հաստատել մատակարարի հետ", a: "Պատվերից հետո կարող եք գրել մատակարարին պատվերի էջից։ Սովորաբար պատասխանում են մի քանի ժամում։" },
    ],
  },
  ru: {
    home: "Главная",
    crumb: "Центр поддержки",
    eyebrow: "Центр поддержки",
    title: "Чем мы можем помочь?",
    subtitle: "Найдите гид по теме или переходите к самым частым вопросам.",
    searchPh: "Поиск статей, тем или ключевых слов…",
    topicsTitle: "По темам",
    faqTitle: "Популярные вопросы",
    faqMore: "Все вопросы",
    contactTitle: "Не нашли ответ?",
    contactSubtitle: "Живые люди, быстрые ответы — обычно за несколько часов.",
    contactCta: "Связаться с поддержкой",
    aiTitle: "Спланируйте с Sali AI",
    aiSubtitle: "Расскажите Sali, что празднуете — персональный план за секунды.",
    aiCta: "Открыть AI-планировщик",
    aiBadge: "AI-Помощник",
    topics: {
      orders: { title: "Заказы и Доставка", desc: "Отслеживание, сроки, доставка." },
      payments: { title: "Оплата", desc: "Способы, счета, платежи." },
      returns: { title: "Возвраты и Возмещения", desc: "Условия, процесс, сроки." },
      vendors: { title: "Вопросы о поставщиках", desc: "Как работают, отзывы, споры." },
      account: { title: "Аккаунт и Профиль", desc: "Профиль, настройки, безопасность." },
      tech: { title: "Технические проблемы", desc: "Ошибки, баги, производительность." },
    },
    faqs: [
      { q: "Как сделать заказ?", a: "Просмотрите поставщиков, выберите товар или услугу, добавьте в корзину и оформите заказ. Оплата защищена." },
      { q: "Можно ли отменить заказ?", a: "Вы можете отменить заказ в течение 24 часов. Далее — по условиям поставщика." },
      { q: "Сколько занимает доставка?", a: "Сроки зависят от поставщика и категории. Точное окно показывается до оформления." },
      { q: "Какие способы оплаты принимаются?", a: "Visa, Mastercard, American Express, PayPal и локальные переводы из Армении." },
      { q: "Как связаться с поставщиком?", a: "После оформления вы можете написать поставщику со страницы заказа. Ответ обычно в течение нескольких часов." },
    ],
  },
};

const TOPIC_KEYS = [
  { key: "orders",   icon: ShoppingBag,  href: "track-order" },
  { key: "payments", icon: CreditCard,   href: "faq" },
  { key: "returns",  icon: RotateCcw,    href: "returns" },
  { key: "vendors",  icon: Store,        href: "faq" },
  { key: "account",  icon: User,         href: "account" },
  { key: "tech",     icon: Settings,     href: "contact" },
];

export default function HelpPageClient({ lang = "en" }) {
  const t = T[lang] || T.en;
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const filteredFaqs = search
    ? t.faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
    : t.faqs;

  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-amber-50 border-b border-rose-100">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #e11d5c 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-rose-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-container mx-auto px-6 md:px-8 pt-12 pb-14 md:pt-14 md:pb-20">
          <nav className="flex items-center gap-2 text-surface-500 text-sm mb-8">
            <Link href={`/${lang}`} className="hover:text-rose-600 no-underline text-surface-500 transition-colors">{t.home}</Link>
            <ChevronRight size={12} className="opacity-50" />
            <span className="text-surface-900 font-medium">{t.crumb}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-white border border-rose-100 rounded-full px-3 py-1 mb-4 shadow-sm">
              <HelpCircle size={11} className="text-rose-500" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-rose-600">{t.eyebrow}</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-black tracking-tight text-surface-900 leading-[1.05] mb-4">
              {t.title}
            </h1>
            <p className="text-surface-600 text-base md:text-lg leading-relaxed mb-7 max-w-2xl">
              {t.subtitle}
            </p>

            {/* Search */}
            <div className="relative max-w-xl">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t.searchPh}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-surface-200 rounded-2xl text-[15px] text-surface-900 placeholder:text-surface-400 shadow-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Topic grid */}
      <section className="max-w-container mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-rose-500 to-pink-500" />
          <h2 className="text-2xl md:text-[28px] font-bold text-surface-900 tracking-tight">{t.topicsTitle}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPIC_KEYS.map(({ key, icon: Icon, href }, i) => {
            const topic = t.topics[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/${lang}/${href}`}
                  className="group block no-underline bg-white border border-surface-200 hover:border-rose-300 hover:shadow-lg hover:-translate-y-0.5 transition-all rounded-2xl p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                      <Icon size={18} strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-surface-900 text-base mb-1 group-hover:text-rose-600 transition-colors">{topic.title}</p>
                      <p className="text-sm text-surface-500 leading-relaxed">{topic.desc}</p>
                    </div>
                    <ChevronRight size={16} className="text-surface-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Top FAQ */}
      <section className="max-w-container mx-auto px-6 md:px-8 pb-12 md:pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-rose-500 to-pink-500" />
              <h2 className="text-2xl md:text-[28px] font-bold text-surface-900 tracking-tight">{t.faqTitle}</h2>
            </div>
            <Link href={`/${lang}/faq`} className="text-sm text-rose-600 font-semibold no-underline inline-flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap">
              {t.faqMore} <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`rounded-2xl overflow-hidden border transition-all ${
                  openFaq === i ? "border-rose-200 bg-white shadow-md" : "border-surface-200 bg-white hover:border-rose-200"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 md:py-5 text-left transition-colors group"
                >
                  <span className="font-semibold text-surface-900 text-[15px] pr-4 leading-snug group-hover:text-rose-600 transition-colors">{faq.q}</span>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    openFaq === i ? "bg-rose-600 text-white rotate-180" : "bg-surface-100 text-surface-500 group-hover:bg-rose-50 group-hover:text-rose-600"
                  }`}>
                    <ChevronDown size={14} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 pt-1 text-[14px] text-surface-600 leading-[1.7]">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-container mx-auto px-6 md:px-8 pb-20">
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <Link
            href={`/${lang}/contact`}
            className="group no-underline bg-white border border-surface-200 hover:border-rose-300 hover:shadow-lg transition-all rounded-3xl p-6"
          >
            <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
              <MessageCircle size={20} className="text-rose-600" />
            </div>
            <h3 className="font-bold text-surface-900 text-lg mb-1.5">{t.contactTitle}</h3>
            <p className="text-sm text-surface-500 leading-relaxed mb-4">{t.contactSubtitle}</p>
            <span className="inline-flex items-center gap-1 text-rose-600 text-sm font-semibold group-hover:gap-2 transition-all">
              {t.contactCta} <ChevronRight size={14} />
            </span>
          </Link>

          <Link
            href={`/${lang}/planner`}
            className="group no-underline relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-600"
          >
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/15 rounded-full blur-2xl pointer-events-none" />
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                <Sparkles size={20} />
              </div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-white/80 mb-1">{t.aiBadge}</p>
              <h3 className="font-bold text-lg mb-1.5">{t.aiTitle}</h3>
              <p className="text-sm text-white/85 leading-relaxed mb-4">{t.aiSubtitle}</p>
              <span className="inline-flex items-center gap-1 text-white text-sm font-semibold group-hover:gap-2 transition-all">
                <Wand2 size={14} /> {t.aiCta}
              </span>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
