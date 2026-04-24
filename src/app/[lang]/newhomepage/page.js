import { getDictionary } from "@/lib/getDictionary";
import AIAssistantClient from "@/components/AIAssistantClient";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const title =
    lang === "hy"
      ? "Sali — Ձեր AI Օգնականը | Salooote.am"
      : lang === "ru"
      ? "Sali — Ваш AI Помощник | Salooote.am"
      : "Sali — Your AI Shopping Assistant | Salooote.am";
  const description =
    lang === "hy"
      ? "Պատմեք ինձ, թե ինչ եք փնտրում՝ տորթ, ծաղիկ, ծննդյան նվեր... Ես ձեզ կգտնեմ լավագույնը Salooote-ում:"
      : lang === "ru"
      ? "Расскажите мне, что ищете — торт, цветы, подарок... Я найду лучшее на Salooote."
      : "Tell me what you're looking for — cake, flowers, a birthday gift... I'll find the best on Salooote.";
  return {
    title,
    description,
    robots: { index: false },
  };
}

export default async function NewHomepage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <AIAssistantClient lang={lang} dict={dict} />;
}
