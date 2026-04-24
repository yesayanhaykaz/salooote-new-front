import AIAssistantV2Client from "@/components/AIAssistantV2Client";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const title =
    lang === "hy" ? "Sali v2 — AI Գнумнerи Ogнич | Salooote.am"
    : lang === "ru" ? "Sali v2 — AI Помощник по покупкам | Salooote.am"
    : "Sali v2 — Smart AI Shopping Assistant | Salooote.am";
  const description =
    lang === "hy" ? "Asm Sali-in inch eq petq — naum e lavn tarbernakner dzez hamар."
    : lang === "ru" ? "Расскажите Sali что нужно — она найдёт лучшие варианты."
    : "Tell Sali what you need — she finds the best options on Salooote.";
  return { title, description, robots: { index: false } };
}

export default async function NewHomepage2nd({ params }) {
  const { lang } = await params;
  return <AIAssistantV2Client lang={lang} />;
}
