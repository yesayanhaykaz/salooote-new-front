// ═══════════════════════════════════════════
// SALOOOTE.AM — Shared Data & Constants
// Premium redesign — no emojis, icon-based
// ═══════════════════════════════════════════

export const NAV_ITEMS = ["Home", "Products", "Events", "Vendors", "Plan Help"];

export const CATEGORIES = [
  { name: "Cakes", slug: "cakes", gradient: "cat-cakes", icon: "Cake" },
  { name: "Catering", slug: "catering", gradient: "cat-catering", icon: "UtensilsCrossed" },
  { name: "Flowers", slug: "flowers", gradient: "cat-flowers", icon: "Flower2" },
  { name: "Balloons", slug: "balloons", gradient: "cat-balloons", icon: "PartyPopper" },
  { name: "Party Props", slug: "party-props", gradient: "cat-party", icon: "Gift" },
  { name: "DJ & Music", slug: "dj", gradient: "cat-dj", icon: "Music" },
];

export const SAMPLE_PRODUCTS = [
  { id: 1, name: "Chocolate Cake — Magical Swirly", vendor: "Sweet Co.", price: 120, rating: 4.5, tag: "NEW", icon: "Cake", gradient: "from-rose-100 to-pink-100" },
  { id: 2, name: "Party Accessories — Fun Bundle", vendor: "Party Hub", price: 45, rating: 4.2, tag: null, icon: "Gift", gradient: "from-violet-100 to-purple-100" },
  { id: 3, name: "Beautiful Hanging Flower Ornaments", vendor: "Bloom Studio", price: 65, rating: 4.8, tag: "SALE", icon: "Flower2", gradient: "from-emerald-50 to-green-100" },
  { id: 4, name: "Cupcakes with Lovely Balloon Set", vendor: "Balloon World", price: 35, rating: 4.0, tag: null, icon: "Cake", gradient: "from-amber-50 to-orange-100" },
  { id: 5, name: "Star Chicken BBQ with Fries & Bread", vendor: "Food Corner", price: 80, rating: 4.6, tag: "POPULAR", icon: "UtensilsCrossed", gradient: "from-orange-50 to-amber-100" },
  { id: 6, name: "Premium Wedding Cake Set", vendor: "Royal Bakes", price: 250, rating: 4.9, tag: "NEW", icon: "Cake", gradient: "from-pink-50 to-rose-100" },
  { id: 7, name: "Bridal Flower Bouquet — Elegant", vendor: "Bloom Studio", price: 120, rating: 4.7, tag: null, icon: "Flower2", gradient: "from-lime-50 to-emerald-100" },
  { id: 8, name: "LED Neon Signs — Custom Made", vendor: "Glow Co.", price: 85, rating: 4.4, tag: "SALE", icon: "Sparkles", gradient: "from-sky-50 to-blue-100" },
];

export const TESTIMONIALS = [
  { text: "The best event planning and shopping company in the world! Easy, secure and thousands of products to choose from. Quick delivery!", name: "Stephanie Lablanca", role: "Wedding Client" },
  { text: "Absolutely fantastic experience! The vendors were professional, responsive, and delivered exactly what we needed for our wedding.", name: "Maria Gonzalez", role: "Birthday Client" },
  { text: "Salooote made our party planning effortless. Found everything in one place — cakes, decorations, and catering. Highly recommend!", name: "Jennifer Walsh", role: "Corporate Event" },
];

export const REVIEWS = [
  { name: "David Chen", initial: "D", color: "bg-brand-600", text: "Absolutely love this product! Quality is amazing and the delivery was super fast. Will definitely order again.", rating: 5, date: "2 days ago", hasPhotos: true, tags: ["Punctuality", "Quality"], helpful: 12 },
  { name: "Rachel Adams", initial: "R", color: "bg-accent-500", text: "Amazing quality! Exceeded my expectations. The presentation was beautiful and tasted incredible.", rating: 4.5, date: "5 days ago", hasPhotos: true, tags: ["Communication", "Affordable"], helpful: 8 },
  { name: "Michael Torres", initial: "M", color: "bg-sage-500", text: "Great service overall. The flower arrangements were stunning and exactly what I wanted for my event.", rating: 5, date: "1 week ago", hasPhotos: false, tags: ["Quality", "Fast Delivery"], helpful: 23 },
  { name: "Sarah Kim", initial: "S", color: "bg-warm-500", text: "Good products but delivery was a bit late. The cupcakes were delicious though and the presentation was lovely.", rating: 3.5, date: "2 weeks ago", hasPhotos: false, tags: ["Quality"], helpful: 5 },
];

export const VENDORS = Array(9).fill(null).map((_, i) => ({
  id: i + 1,
  name: ["Salooote Bakery", "Bloom & Co.", "Party Palace", "Sweet Dreams", "Floral Fantasy", "Cake Kingdom", "Decor Plus", "Event Stars", "Gift Gallery"][i],
  rating: ["4.8", "4.6", "4.9", "4.5", "4.7", "4.8", "4.3", "4.6", "4.9"][i],
  category: ["Cakes", "Flowers", "Party", "Cakes", "Flowers", "Cakes", "Decor", "Events", "Gifts"][i],
  gradient: ["from-rose-100 to-pink-50", "from-emerald-50 to-green-100", "from-violet-100 to-purple-50", "from-amber-50 to-orange-100", "from-lime-50 to-emerald-50", "from-pink-50 to-rose-100", "from-sky-50 to-blue-100", "from-indigo-50 to-violet-100", "from-amber-100 to-yellow-50"][i],
}));

export const STORE_HOURS = [
  { day: "Monday", hours: "8:00 AM – 8:00 PM", isToday: false },
  { day: "Tuesday", hours: "8:00 AM – 8:00 PM", isToday: false },
  { day: "Wednesday", hours: "8:00 AM – 8:00 PM", isToday: false },
  { day: "Thursday", hours: "8:00 AM – 8:00 PM", isToday: true },
  { day: "Friday", hours: "8:00 AM – 10:00 PM", isToday: false },
  { day: "Saturday", hours: "9:00 AM – 10:00 PM", isToday: false },
  { day: "Sunday", hours: "10:00 AM – 6:00 PM", isToday: false },
];

export const EVENT_TYPES = [
  { title: "Birthdays", icon: "Cake", gradient: "from-brand-100 to-brand-50", tags: ["Cakes", "Chocolates", "Kids", "Catering", "Balloons"] },
  { title: "Weddings", icon: "Heart", gradient: "from-accent-100 to-accent-50", tags: ["Decor", "Cakes", "Flowers", "Paintings"] },
  { title: "Flowers & Gifts", icon: "Flower2", gradient: "from-sage-100 to-sage-50", tags: ["Flowers", "Gift Baskets", "Gift Cards"] },
  { title: "Parties", icon: "PartyPopper", gradient: "from-warm-100 to-warm-50", tags: ["Accessories", "Chocolates", "Decorations"] },
];

export const PRODUCT_SECTIONS = [
  { title: "Cakes", icon: "Cake", desc: "Handcrafted with love. From dreamy wedding tiers to playful birthday designs — every bite tells a story." },
  { title: "Catering", icon: "UtensilsCrossed", desc: "Complete event catering from our trusted partners. Menus for every taste, every occasion." },
  { title: "Flowers", icon: "Flower2", desc: "Elegant arrangements for every moment. Fresh, fragrant, and beautifully styled bouquets." },
];
