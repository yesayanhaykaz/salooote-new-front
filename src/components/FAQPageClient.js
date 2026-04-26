"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronDown, Sparkles, MessageCircle, ChevronRight, HelpCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const T = {
  en: {
    home: "Home",
    crumb: "FAQ",
    eyebrow: "Help & Support",
    title: "Questions? We've got answers.",
    subtitle: "Everything you need to know about Salooote — orders, payments, vendors, and more.",
    searchPh: "Search questions… (e.g. delivery, refund, vendor)",
    tabs: { General: "General", Orders: "Orders", Vendors: "Vendors", Payments: "Payments" },
    noResults: "No results — try a different search.",
    showAll: "Show all questions",
    stillNeedHelp: "Still need help?",
    stillSubtitle: "Our support team replies within a few hours, in English, Armenian, and Russian.",
    contactCta: "Contact support",
    aiCta: "Ask Sali AI",
    aiBadge: "AI Assistant",
  },
  hy: {
    home: "Գլխավոր",
    crumb: "Հաճախակի տրվող հարցեր",
    eyebrow: "Աջակցություն",
    title: "Հարցե՞ր կան։ Մենք ունենք պատասխանները։",
    subtitle: "Ամեն ինչ, ինչ պետք է իմանաք Salooote-ի մասին՝ պատվերներ, վճարումներ, մատակարարներ։",
    searchPh: "Փնտրեք հարցեր… (օր.՝ առաքում, գումարի վերադարձ)",
    tabs: { General: "Ընդհանուր", Orders: "Պատվերներ", Vendors: "Մատակարարներ", Payments: "Վճարումներ" },
    noResults: "Արդյունքներ չկան — փորձեք այլ որոնում։",
    showAll: "Տեսնել բոլոր հարցերը",
    stillNeedHelp: "Դեռ օգնության կարիք ունե՞ք",
    stillSubtitle: "Մեր թիմը պատասխանում է մի քանի ժամում՝ հայերեն, ռուսերեն կամ անգլերեն։",
    contactCta: "Կապ աջակցության հետ",
    aiCta: "Հարցրու Sali AI-ին",
    aiBadge: "AI Օգնական",
  },
  ru: {
    home: "Главная",
    crumb: "Частые вопросы",
    eyebrow: "Поддержка",
    title: "Вопросы? У нас есть ответы.",
    subtitle: "Всё, что нужно знать о Salooote — заказы, оплата, поставщики и многое другое.",
    searchPh: "Поиск вопросов… (например, доставка, возврат)",
    tabs: { General: "Общее", Orders: "Заказы", Vendors: "Поставщики", Payments: "Оплата" },
    noResults: "Ничего не найдено — попробуйте другой запрос.",
    showAll: "Показать все вопросы",
    stillNeedHelp: "Нужна помощь?",
    stillSubtitle: "Наша команда отвечает в течение нескольких часов на армянском, русском и английском.",
    contactCta: "Связаться с поддержкой",
    aiCta: "Спросить Sali AI",
    aiBadge: "AI-Помощник",
  },
};

const FAQ_DATA = {
  General: [
    {
      en: { q: "What is Salooote?", a: "Salooote is Armenia's premier event planning marketplace, connecting customers with top-rated vendors for cakes, catering, flowers, music, venues and more." },
      hy: { q: "Ի՞նչ է Salooote-ը", a: "Salooote-ը Հայաստանի առաջատար միջոցառումների պլանավորման հարթակն է, որը կապում է հաճախորդներին լավագույն մատակարարների հետ՝ տորթեր, քեյթրինգ, ծաղիկներ, երաժշտություն, վայրեր և ավելին։" },
      ru: { q: "Что такое Salooote?", a: "Salooote — ведущая в Армении платформа планирования мероприятий, объединяющая клиентов с лучшими поставщиками: торты, кейтеринг, цветы, музыка, площадки и многое другое." },
    },
    {
      en: { q: "Is Salooote available outside Yerevan?", a: "Yes! We have vendors across 50+ cities in Armenia. Availability varies by location — enter your city when browsing to see local vendors." },
      hy: { q: "Salooote-ն հասանելի՞ է Երևանից դուրս", a: "Այո՛։ Մենք ունենք մատակարարներ Հայաստանի 50+ քաղաքներում։ Մատչելիությունը կախված է վայրից — մուտքագրեք Ձեր քաղաքը՝ տեղական մատակարարներին տեսնելու համար։" },
      ru: { q: "Доступен ли Salooote за пределами Еревана?", a: "Да! У нас есть поставщики в 50+ городах Армении. Доступность зависит от региона — укажите свой город при поиске, чтобы увидеть местных." },
    },
    {
      en: { q: "Do I need an account to order?", a: "You can browse without an account, but you'll need to sign up to place orders and track your purchases." },
      hy: { q: "Հաշիվ ստեղծել պարտադի՞ր է պատվեր կատարելու համար", a: "Կարող եք դիտել առանց հաշվի, բայց պատվիրելու և հետևելու համար անհրաժեշտ է գրանցվել։" },
      ru: { q: "Нужен ли аккаунт для заказа?", a: "Просматривать можно без аккаунта, но для оформления заказа и отслеживания нужно зарегистрироваться." },
    },
    {
      en: { q: "Is my data safe with Salooote?", a: "Absolutely. We use industry-standard encryption and never sell your personal data. See our Privacy Policy for full details." },
      hy: { q: "Իմ տվյալները անվտա՞նգ են Salooote-ում", a: "Միանշանակ։ Մենք օգտագործում ենք ստանդարտ գաղտնագրում և երբեք չենք վաճառում Ձեր անձնական տվյալները։" },
      ru: { q: "Безопасны ли мои данные?", a: "Абсолютно. Мы используем стандартное шифрование и никогда не продаём ваши данные." },
    },
    {
      en: { q: "How do I leave a review?", a: "After your order is marked delivered, you'll receive an email prompt to rate and review the vendor. You can also review from your order history." },
      hy: { q: "Ինչպե՞ս թողնել կարծիք", a: "Երբ պատվերը ստանաք, Ձեզ կուղարկվի էլ. նամակ՝ գնահատման հղումով։ Կարող եք նաև գրել պատվերների պատմությունից։" },
      ru: { q: "Как оставить отзыв?", a: "После доставки вы получите письмо с предложением оценить поставщика. Также отзыв можно оставить из истории заказов." },
    },
    {
      en: { q: "Can I use Salooote for corporate events?", a: "Yes! Many of our vendors cater to corporate clients. Contact us at support@salooote.am for volume pricing and dedicated support." },
      hy: { q: "Կարո՞ղ եմ օգտագործել Salooote-ը կորպորատիվ միջոցառումների համար", a: "Այո՛։ Շատ մատակարարներ սպասարկում են կորպորատիվ հաճախորդների։ Գրեք support@salooote.am-ին՝ ծավալային գների համար։" },
      ru: { q: "Подходит ли Salooote для корпоративов?", a: "Да! Многие поставщики работают с корпоративными клиентами. Пишите на support@salooote.am за специальными условиями." },
    },
  ],
  Orders: [
    {
      en: { q: "How do I place an order?", a: "Browse vendors, choose a product or service, add to cart, and complete checkout. You'll receive a confirmation email immediately." },
      hy: { q: "Ինչպե՞ս պատվեր կատարել", a: "Դիտեք մատակարարներին, ընտրեք ապրանք կամ ծառայություն, ավելացրեք զամբյուղ և ավարտեք պատվերը։ Կստանաք հաստատման էլ. նամակ։" },
      ru: { q: "Как сделать заказ?", a: "Просмотрите поставщиков, выберите товар, добавьте в корзину и оформите заказ. Вы сразу получите письмо-подтверждение." },
    },
    {
      en: { q: "Can I modify my order after placing it?", a: "Modifications are possible within 1 hour of placing your order. Contact the vendor directly or reach out to our support team." },
      hy: { q: "Կարո՞ղ եմ փոփոխել պատվերը հետո", a: "Փոփոխությունները հնարավոր են պատվերից 1 ժամ հետո։ Կապ հաստատեք մատակարարի կամ աջակցության հետ։" },
      ru: { q: "Можно ли изменить заказ?", a: "Изменения возможны в течение 1 часа после оформления. Свяжитесь с поставщиком или поддержкой." },
    },
    {
      en: { q: "How do I track my order?", a: "Visit the Track Order page and enter your order number and email. You'll see real-time status updates." },
      hy: { q: "Ինչպե՞ս հետևել պատվերին", a: "Այցելեք «Հետևել պատվերին» էջը և մուտքագրեք պատվերի համարը և էլ. փոստը։ Դուք կտեսնեք իրական ժամանակում թարմացումներ։" },
      ru: { q: "Как отследить заказ?", a: "Перейдите на страницу «Отслеживание» и введите номер заказа и email. Статус обновляется в реальном времени." },
    },
    {
      en: { q: "What if my order arrives damaged?", a: "Contact us within 48 hours of delivery with photos. We'll arrange a replacement or full refund." },
      hy: { q: "Իսկ եթե պատվերը վնասված է հասել", a: "Կապվեք մեզ հետ առաքումից 48 ժամվա ընթացքում՝ լուսանկարներով։ Մենք կկազմակերպենք փոխարինում կամ ամբողջական վերադարձ։" },
      ru: { q: "Что делать с повреждённым заказом?", a: "Свяжитесь с нами в течение 48 часов после доставки и приложите фото. Мы заменим товар или вернём деньги полностью." },
    },
    {
      en: { q: "Can I schedule delivery for a specific date?", a: "Yes — most vendors allow scheduling. Available dates are shown during checkout. Cakes and flowers usually need 24–72 hours notice." },
      hy: { q: "Կարո՞ղ եմ պլանավորել առաքումը կոնկրետ ամսաթվի", a: "Այո՛, շատ մատակարարներ թույլատրում են։ Հասանելի ամսաթվերը երևում են վճարման ժամանակ։ Տորթերի և ծաղիկների համար անհրաժեշտ է 24–72 ժամ նախապես։" },
      ru: { q: "Можно ли выбрать дату доставки?", a: "Да — большинство поставщиков это поддерживают. Доступные даты видны при оформлении. Торты и цветы — за 24–72 часа." },
    },
  ],
  Vendors: [
    {
      en: { q: "How are vendors vetted?", a: "All vendors go through identity verification, quality checks, and must maintain a minimum 4.0 star rating. We also conduct periodic audits." },
      hy: { q: "Ինչպե՞ս են մատակարարները ստուգվում", a: "Բոլոր մատակարարներն անցնում են ինքնության ստուգում, որակի ստուգում և պետք է պահպանեն նվազագույն 4.0 աստղ վարկանիշ։ Մենք նաև պարբերաբար աուդիտ ենք անցկացնում։" },
      ru: { q: "Как проверяются поставщики?", a: "Все поставщики проходят верификацию, проверку качества и обязаны держать минимум 4.0 звезды. Также мы делаем периодические аудиты." },
    },
    {
      en: { q: "Can I contact a vendor before ordering?", a: "Yes! Each vendor profile has a 'Message' button. You can ask questions about customization, pricing, or availability." },
      hy: { q: "Կարո՞ղ եմ կապ հաստատել մատակարարի հետ նախքան պատվերը", a: "Այո՛։ Յուրաքանչյուր մատակարարի էջում կա «Հաղորդագրություն» կոճակը։" },
      ru: { q: "Можно ли связаться с поставщиком до заказа?", a: "Да! На странице каждого поставщика есть кнопка «Написать»." },
    },
    {
      en: { q: "What if a vendor cancels my order?", a: "In the rare event a vendor cancels, you'll be notified immediately and receive a full refund within 3–5 business days." },
      hy: { q: "Իսկ եթե մատակարարը չեղյալ է հայտարարում պատվերը", a: "Դուք անմիջապես ծանուցում կստանաք և ամբողջական վերադարձ՝ 3–5 աշխատանքային օրվա ընթացքում։" },
      ru: { q: "Если поставщик отменит заказ?", a: "Вы сразу получите уведомление и полный возврат средств в течение 3–5 рабочих дней." },
    },
    {
      en: { q: "How do vendor ratings work?", a: "Ratings are calculated from verified customer reviews only. Each review is submitted after a completed order and cannot be edited after 30 days." },
      hy: { q: "Ինչպե՞ս են աշխատում մատակարարի վարկանիշները", a: "Վարկանիշները հաշվարկվում են միայն ստուգված կարծիքների հիման վրա։ Կարծիքները չեն խմբագրվում 30 օրից հետո։" },
      ru: { q: "Как работают рейтинги?", a: "Рейтинги формируются только из проверенных отзывов после выполненных заказов. Через 30 дней их нельзя изменить." },
    },
    {
      en: { q: "Can I become a vendor?", a: "Absolutely! Visit our Apply page to submit your application. We review all applications within 3–5 business days." },
      hy: { q: "Կարո՞ղ եմ դառնալ մատակարար", a: "Միանշանակ։ Այցելեք «Դիմել» էջը։ Մենք քննարկում ենք բոլոր դիմումները 3–5 աշխատանքային օրվա ընթացքում։" },
      ru: { q: "Можно ли стать поставщиком?", a: "Конечно! Перейдите на страницу «Подать заявку». Мы рассматриваем все заявки за 3–5 рабочих дней." },
    },
  ],
  Payments: [
    {
      en: { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, PayPal, and local Armenian bank transfers (Arca, Visa Armenia)." },
      hy: { q: "Ի՞նչ վճարման եղանակներ եք ընդունում", a: "Visa, Mastercard, American Express, PayPal, և տեղական հայկական բանկային փոխանցումներ (Arca, Visa Armenia)։" },
      ru: { q: "Какие способы оплаты принимаются?", a: "Visa, Mastercard, American Express, PayPal и переводы с армянских банков (Arca, Visa Armenia)." },
    },
    {
      en: { q: "When is my card charged?", a: "Your card is charged immediately upon placing an order. For custom orders, we may charge a deposit upfront." },
      hy: { q: "Ե՞րբ է գանձվում քարտից", a: "Քարտից գումարը գանձվում է անմիջապես պատվերը կատարելուց հետո։ Անհատական պատվերների դեպքում կարող ենք գանձել կանխավճար։" },
      ru: { q: "Когда списываются деньги?", a: "Сразу после оформления заказа. Для индивидуальных заказов может потребоваться предоплата." },
    },
    {
      en: { q: "How do refunds work?", a: "Approved refunds are processed within 7–10 business days back to your original payment method." },
      hy: { q: "Ինչպե՞ս են աշխատում վերադարձները", a: "Հաստատված վերադարձները մշակվում են 7–10 աշխատանքային օրվա ընթացքում՝ վերադառնալով սկզբնական վճարման մեթոդին։" },
      ru: { q: "Как работают возвраты?", a: "Подтверждённые возвраты обрабатываются за 7–10 рабочих дней на исходный способ оплаты." },
    },
    {
      en: { q: "Is checkout secure?", a: "Yes. All transactions are processed via PCI-DSS compliant payment gateways. We never store your full card details." },
      hy: { q: "Ապահո՞վ է վճարումը", a: "Այո՛։ Բոլոր գործարքներն իրականացվում են PCI-DSS համատեղելի վճարային համակարգով։ Մենք երբեք չենք պահում Ձեր քարտի լրիվ տվյալները։" },
      ru: { q: "Безопасна ли оплата?", a: "Да. Все транзакции проходят через PCI-DSS совместимые платёжные шлюзы. Полные данные карт не хранятся." },
    },
    {
      en: { q: "Do you offer installment payments?", a: "Installment options are available for orders over AMD 50,000 through our partner banks. Select 'Pay in installments' at checkout." },
      hy: { q: "Տրամադրու՞մ եք ապառիկ", a: "Ապառիկը հասանելի է 50,000+ AMD պատվերների համար մեր գործընկեր բանկերի միջոցով։" },
      ru: { q: "Есть ли рассрочка?", a: "Рассрочка доступна для заказов от 50,000 AMD через банков-партнёров. Выберите «В рассрочку» при оплате." },
    },
    {
      en: { q: "Can I get an invoice for my order?", a: "Yes. Go to your order history and click 'Download Invoice'. Corporate invoices with VAT details are available on request." },
      hy: { q: "Կարո՞ղ եմ ստանալ հաշիվ ապրանքագիր", a: "Այո՛։ Գնացեք պատվերների պատմություն և սեղմեք «Բեռնել ապրանքագիրը»։ Կորպորատիվ ապրանքագրեր ԱԱՀ-ով հասանելի են պահանջով։" },
      ru: { q: "Можно ли получить счёт?", a: "Да. В истории заказов нажмите «Скачать счёт». Корпоративные счета с НДС — по запросу." },
    },
  ],
};

export default function FAQPageClient({ lang = "en" }) {
  const t = T[lang] || T.en;
  const [activeTab, setActiveTab] = useState("General");
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const tabs = ["General", "Orders", "Vendors", "Payments"];

  const currentFaqs = useMemo(() => {
    const list = FAQ_DATA[activeTab].map(item => item[lang] || item.en);
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [activeTab, search, lang]);

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
                onChange={(e) => { setSearch(e.target.value); setOpenIndex(null); }}
                placeholder={t.searchPh}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-surface-200 rounded-2xl text-[15px] text-surface-900 placeholder:text-surface-400 shadow-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs + content */}
      <section className="max-w-container mx-auto px-6 md:px-8 py-10 md:py-14">
        {/* Sticky tabs */}
        <div className="sticky top-16 md:top-20 z-10 bg-white/85 backdrop-blur-md -mx-6 md:-mx-8 px-6 md:px-8 py-3 mb-8 border-b border-surface-100">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setOpenIndex(null); }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all flex-shrink-0 ${
                  activeTab === tab
                    ? "bg-surface-900 text-white shadow-md"
                    : "bg-white border border-surface-200 text-surface-700 hover:border-rose-300 hover:text-rose-600"
                }`}
              >
                {t.tabs[tab]}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {currentFaqs.length === 0 ? (
            <div className="py-16 text-center bg-surface-50 rounded-3xl border border-surface-100">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white border border-surface-200 flex items-center justify-center">
                <Search size={22} className="text-surface-400" />
              </div>
              <p className="text-surface-500 text-sm mb-3">{t.noResults}</p>
              <button
                onClick={() => { setSearch(""); setActiveTab("General"); }}
                className="inline-flex items-center gap-1 text-rose-600 text-sm font-semibold hover:gap-2 transition-all"
              >
                {t.showAll} <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {currentFaqs.map((faq, i) => (
                <motion.div
                  key={`${activeTab}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`rounded-2xl overflow-hidden border transition-all ${
                    openIndex === i ? "border-rose-200 bg-white shadow-md" : "border-surface-200 bg-white hover:border-rose-200"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 md:py-5 text-left transition-colors group"
                  >
                    <span className="font-semibold text-surface-900 text-[15px] pr-4 leading-snug group-hover:text-rose-600 transition-colors">
                      {faq.q}
                    </span>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      openIndex === i ? "bg-rose-600 text-white rotate-180" : "bg-surface-100 text-surface-500 group-hover:bg-rose-50 group-hover:text-rose-600"
                    }`}>
                      <ChevronDown size={14} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openIndex === i && (
                      <motion.div
                        key="body"
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
          )}
        </div>
      </section>

      {/* Help CTA */}
      <section className="max-w-container mx-auto px-6 md:px-8 pb-20">
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <Link
            href={`/${lang}/contact`}
            className="group no-underline bg-white border border-surface-200 hover:border-rose-300 hover:shadow-lg transition-all rounded-3xl p-6"
          >
            <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
              <MessageCircle size={20} className="text-rose-600" />
            </div>
            <h3 className="font-bold text-surface-900 text-lg mb-1.5">{t.stillNeedHelp}</h3>
            <p className="text-sm text-surface-500 leading-relaxed mb-4">{t.stillSubtitle}</p>
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
              <h3 className="font-bold text-lg mb-1.5">{t.aiCta}</h3>
              <span className="inline-flex items-center gap-1 text-white text-sm font-semibold group-hover:gap-2 transition-all mt-3">
                {t.aiCta} <ChevronRight size={14} />
              </span>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
