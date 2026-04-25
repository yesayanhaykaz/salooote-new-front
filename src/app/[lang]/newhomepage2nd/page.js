export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const title =
    lang === "hy" ? "Sali — AI Օգնական | Salooote.am"
    : lang === "ru" ? "Sali — AI Помощник по покупкам | Salooote.am"
    : "Sali — Smart AI Shopping Assistant | Salooote.am";
  const description =
    lang === "hy" ? "Ասեք Sali-ին ինչ է պետք — նա կգտնի լավագույն տարբերակները ձեզ համար։"
    : lang === "ru" ? "Расскажите Sali что нужно — она найдёт лучшие варианты."
    : "Tell Sali what you need — she finds the best options on Salooote.";
  return { title, description, robots: { index: false } };
}

// Renders nothing — the global AI assistant in the layout shows its landing
// view when the path matches this route (see AIAssistantV2Client).
export default function NewHomepage2nd() {
  return null;
}
