import AIAssistantClient from "@/components/AIAssistantClient";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const title =
    lang === "hy" ? "Sali — AI Գնումների Օգնական | Salooote.am"
    : lang === "ru" ? "Sali — AI Помощник по покупкам | Salooote.am"
    : "Sali — AI Shopping Assistant | Salooote.am";
  const description =
    lang === "hy" ? "Պատմեք Sali-ին, թե ինչ եք փնտրում — տորթ, ծաղիկ, նվեր... Ձեր AI օգնականը Salooote-ում:"
    : lang === "ru" ? "Расскажите Sali, что ищете — торт, цветы, подарок... Ваш AI помощник на Salooote."
    : "Tell Sali what you need — cake, flowers, a birthday gift... Your AI shopping assistant on Salooote.";
  return { title, description, robots: { index: false } };
}

export default async function NewHomepage({ params }) {
  const { lang } = await params;
  return <AIAssistantClient lang={lang} />;
}
