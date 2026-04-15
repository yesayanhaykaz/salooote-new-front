import "@/styles/globals.css";

export const metadata = {
  title: "Salooote.am — Plan Your Dream Events, Easily",
  description: "Armenia's #1 event planning marketplace.",
  metadataBase: new URL("https://salooote.am"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
