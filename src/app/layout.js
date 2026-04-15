import "@/styles/globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

export const metadata = {
  title: "Salooote.am — Plan Your Dream Events, Easily",
  description: "Multi-vendor e-commerce platform for event planning. Explore vendors, book services, and plan your event — all in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body bg-surface-50">
        <CartProvider>
          <ScrollProgress />
          <Header />
          <main className="min-h-screen pb-16 md:pb-0">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
