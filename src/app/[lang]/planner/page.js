import PlannerClient from "./PlannerClient";

export const metadata = {
  title: "Event Planner — Salooote.am",
  description: "AI-powered event planning. Describe your event, get a personalized checklist, find vendors step by step.",
};

export default async function PlannerPage({ params }) {
  const { lang } = await params;
  return <PlannerClient lang={lang} />;
}
