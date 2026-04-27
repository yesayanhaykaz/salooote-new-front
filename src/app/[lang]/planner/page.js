import { redirect } from "next/navigation";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export const metadata = {
  title: "Event Planner — Salooote.am",
  description: "AI-powered event planning. Describe your event, get a personalized checklist, find vendors step by step.",
};

export default async function PlannerPage({ params }) {
  const { lang } = await params;
  redirect(`/${lang}`);
}
