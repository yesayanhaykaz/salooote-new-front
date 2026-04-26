import PlannerClient from "./PlannerClient";

export const metadata = {
  title: "Event Planner — Salooote.am",
  description: "AI-powered event planning. Describe your event, get a personalized checklist, find vendors step by step.",
  openGraph: {
    title: "Event Planner — Salooote.am",
    description: "AI-powered event planning. Describe your event, get a personalized checklist, find vendors step by step.",
    siteName: "Salooote.am",
    images: [{ url: "/images/hero-dj.jpg", width: 1200, height: 630, alt: "Salooote.am" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Planner — Salooote.am",
    description: "AI-powered event planning. Describe your event, get a personalized checklist, find vendors step by step.",
    images: ["/images/hero-dj.jpg"],
  },
};

export default async function PlannerPage({ params }) {
  const { lang } = await params;
  return <PlannerClient lang={lang} />;
}
