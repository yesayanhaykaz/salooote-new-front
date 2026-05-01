"use client";
import { useState } from "react";
import { Package, Loader, Truck, CheckCircle } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const translations = {
  en: {
    title: "Track Your Order",
    subtitle: "Enter your order details below to see the latest status.",
    orderNumber: "Order Number",
    orderPlaceholder: "e.g. SAL-20240001",
    email: "Email Address",
    emailPlaceholder: "you@example.com",
    trackBtn: "Track Order",
    yourStatus: "Your Order Status",
    sampleStatus: "Sample Order Status",
    current: "Current",
    help: "Need help?",
    contact: "Contact support at",
    steps: [
      { label: "Order Placed", desc: "We received your order" },
      { label: "Processing", desc: "Your order is being prepared" },
      { label: "Out for Delivery", desc: "On the way to you" },
      { label: "Delivered", desc: "Order complete" },
    ],
  },

  hy: {
    title: "Հետևել պատվերին",
    subtitle: "Մուտքագրեք պատվերի տվյալները՝ տեսնելու վերջին կարգավիճակը։",
    orderNumber: "Պատվերի համար",
    orderPlaceholder: "օր. SAL-20240001",
    email: "Էլ․ հասցե",
    emailPlaceholder: "you@example.com",
    trackBtn: "Հետևել պատվերին",
    yourStatus: "Ձեր պատվերի կարգավիճակը",
    sampleStatus: "Օրինակ կարգավիճակ",
    current: "Ընթացիկ",
    help: "Օգնությո՞ւն է պետք",
    contact: "Կապ հաստատեք՝",
    steps: [
      { label: "Պատվերը ընդունվել է", desc: "Մենք ստացել ենք ձեր պատվերը" },
      { label: "Պատրաստվում է", desc: "Պատվերը պատրաստվում է" },
      { label: "Առաքման մեջ", desc: "Ճանապարհին է դեպի ձեզ" },
      { label: "Առաքված է", desc: "Պատվերը ավարտված է" },
    ],
  },

  ru: {
    title: "Отследить заказ",
    subtitle: "Введите данные заказа, чтобы увидеть текущий статус.",
    orderNumber: "Номер заказа",
    orderPlaceholder: "например SAL-20240001",
    email: "Email адрес",
    emailPlaceholder: "you@example.com",
    trackBtn: "Отследить заказ",
    yourStatus: "Статус вашего заказа",
    sampleStatus: "Пример статуса заказа",
    current: "Текущий",
    help: "Нужна помощь?",
    contact: "Свяжитесь с поддержкой:",
    steps: [
      { label: "Заказ оформлен", desc: "Мы получили ваш заказ" },
      { label: "Обработка", desc: "Ваш заказ готовится" },
      { label: "Доставка", desc: "В пути к вам" },
      { label: "Доставлено", desc: "Заказ выполнен" },
    ],
  },
};

const icons = [Package, Loader, Truck, CheckCircle];

export default function TrackOrderPageClient({ lang = "en" }) {
  const t = translations[lang] || translations.en;

  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [tracked, setTracked] = useState(false);
  const activeStep = 1;

  return (
    <main className="min-h-screen bg-white py-16">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="max-w-xl mx-auto">
            <h1 className="text-3xl font-bold text-surface-900 mb-2">{t.title}</h1>
            <p className="text-surface-400 mb-8">{t.subtitle}</p>

            <div className="bg-surface-50 border border-surface-100 rounded-2xl p-6 mb-8">
              <div className="mb-4">
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  {t.orderNumber}
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder={t.orderPlaceholder}
                  className="w-full border border-surface-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  {t.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full border border-surface-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition"
                />
              </div>

              <button
                onClick={() => setTracked(true)}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {t.trackBtn}
              </button>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-surface-900 mb-6">
                {tracked ? t.yourStatus : t.sampleStatus}
              </h2>

              {t.steps.map((step, i) => {
                const Icon = icons[i];
                const isActive = i === activeStep;
                const isDone = i < activeStep;

                return (
                  <div key={i} className="flex items-start gap-4 mb-6 last:mb-0">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isActive
                            ? "bg-brand-600 text-white"
                            : isDone
                            ? "bg-brand-100 text-brand-600"
                            : "bg-surface-100 text-surface-400"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      {i < t.steps.length - 1 && (
                        <div
                          className={`w-0.5 h-8 mt-1 ${
                            isDone ? "bg-brand-300" : "bg-surface-200"
                          }`}
                        />
                      )}
                    </div>

                    <div className="pt-1.5">
                      <p
                        className={`text-sm font-semibold ${
                          isActive
                            ? "text-brand-600"
                            : isDone
                            ? "text-surface-700"
                            : "text-surface-400"
                        }`}
                      >
                        {step.label}
                        {isActive && (
                          <span className="ml-2 text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full">
                            {t.current}
                          </span>
                        )}
                      </p>

                      <p className="text-xs text-surface-400 mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-brand-50 border border-brand-100 rounded-2xl px-5 py-4 text-sm text-surface-700">
              {t.help}{" "}
              <a
                href="mailto:support@salooote.am"
                className="text-brand-600 font-medium hover:underline"
              >
                {t.contact} support@salooote.am
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}