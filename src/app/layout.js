import "@/styles/globals.css";

// Update SITE_URL when domain switches from development to production
const SITE_URL = "https://development.salooote.am";
const OG_IMAGE = `${SITE_URL}/images/hero-dj.jpg`;

export const metadata = {
  title: "Salooote.am — Plan Your Dream Events, Easily",
  description: "Armenia's #1 event planning marketplace.",
  metadataBase: new URL(SITE_URL),
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
