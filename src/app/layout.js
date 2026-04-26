import "@/styles/globals.css";

export const metadata = {
  title: "Salooote.am — Plan Your Dream Events, Easily",
  description: "Armenia's #1 event planning marketplace.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://salooote.am"),
  openGraph: {
    title: "Salooote.am — Plan Your Dream Events, Easily",
    description: "Armenia's #1 event planning marketplace.",
    siteName: "Salooote.am",
    images: [{ url: "/images/hero-dj.jpg", width: 1200, height: 630, alt: "Salooote.am" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salooote.am — Plan Your Dream Events, Easily",
    description: "Armenia's #1 event planning marketplace.",
    images: ["/images/hero-dj.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
