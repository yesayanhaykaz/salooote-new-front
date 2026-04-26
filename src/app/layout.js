import "@/styles/globals.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://salooote.am";
const OG_IMAGE = `${SITE}/images/hero-dj.jpg`;

export const metadata = {
  title: "Salooote.am — Plan Your Dream Events, Easily",
  description: "Armenia's #1 event planning marketplace.",
  metadataBase: new URL(SITE),
  openGraph: {
    title: "Salooote.am — Plan Your Dream Events, Easily",
    description: "Armenia's #1 event planning marketplace.",
    siteName: "Salooote.am",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Salooote.am" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salooote.am — Plan Your Dream Events, Easily",
    description: "Armenia's #1 event planning marketplace.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
