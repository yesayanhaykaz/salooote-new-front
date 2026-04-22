"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Sparkles, Check, ChevronRight, ArrowLeft,
  Calendar, Users, DollarSign, Plus, X, Search,
  CheckCircle2, Building2, Phone, Edit3, ExternalLink,
  Trash2, ChevronDown, ChevronUp, AlertCircle, Clock,
  Star, MapPin, Package,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   EVENT PLANS — full checklists per event type
═══════════════════════════════════════════════════════ */
const EVENT_PLANS = {
  christening: {
    label: "Christening / Baptism",
    emoji: "⛪",
    gradient: "linear-gradient(135deg, #7c3aed, #a855f7)",
    accentColor: "#7c3aed",
    defaultGuests: 50,
    sections: [
      {
        id: "religious", icon: "⛪", title: "Religious Essentials",
        color: "#7c3aed", bg: "#f5f3ff",
        items: [
          { id: "church",    name: "Church booking",                     priority: "high",   tip: "Book 1–2 months in advance" },
          { id: "priest",    name: "Priest coordination",                priority: "high" },
          { id: "candle",    name: "Baptism candle (Կնունքի մոմ)",        priority: "high",   tip: "Very important Armenian tradition" },
          { id: "cross",     name: "Cross necklace for baby",            priority: "high" },
          { id: "holy-oil",  name: "Holy oil & ritual items",            priority: "medium", tip: "Usually provided by church" },
          { id: "cloth",     name: "White baptism cloth / towel",        priority: "medium" },
        ],
      },
      {
        id: "clothing", icon: "👗", title: "Clothing & Attire",
        color: "#db2777", bg: "#fdf2f8",
        items: [
          { id: "baby-dress",     name: "White dress / outfit for baby",       priority: "high" },
          { id: "godfather-suit", name: "Godfather (Kavor) suit / outfit",     priority: "high" },
          { id: "godmother-dress",name: "Godmother dress",                     priority: "medium" },
          { id: "family-coords",  name: "Family coordinated look",             priority: "low" },
        ],
      },
      {
        id: "roles", icon: "👨‍👩‍👧", title: "Key Roles & Guests",
        color: "#0891b2", bg: "#ecfeff",
        items: [
          { id: "godfather",   name: "Godfather (Kavor) — ESSENTIAL",  priority: "high" },
          { id: "godmother",   name: "Godmother (Kavork)",              priority: "high" },
          { id: "invitations", name: "Send invitations to family",     priority: "medium" },
          { id: "guest-list",  name: "Finalize guest list",            priority: "medium" },
        ],
      },
      {
        id: "celebration", icon: "🎉", title: "After-Ceremony Celebration",
        color: "#059669", bg: "#ecfdf5",
        items: [
          { id: "venue",     name: "Restaurant / celebration venue",    priority: "high",   canFindVendor: true, vendorCategory: "catering" },
          { id: "cake",      name: "Christening cake",                  priority: "high",   canFindVendor: true, vendorCategory: "cakes" },
          { id: "catering",  name: "Food & drinks",                     priority: "high",   canFindVendor: true, vendorCategory: "catering" },
          { id: "decor",     name: "Elegant decorations (white/gold)",  priority: "medium", canFindVendor: true, vendorCategory: "decor" },
          { id: "flowers",   name: "Floral arrangements",               priority: "low",    canFindVendor: true, vendorCategory: "flowers" },
          { id: "souvenirs", name: "Cross-themed favors / souvenirs",   priority: "medium" },
        ],
      },
      {
        id: "media", icon: "📸", title: "Photography & Memories",
        color: "#d97706", bg: "#fffbeb",
        items: [
          { id: "photographer", name: "Photographer",  priority: "high",   canFindVendor: true, vendorCategory: "photography" },
          { id: "videographer", name: "Videographer",  priority: "medium", canFindVendor: true, vendorCategory: "photography" },
          { id: "album",        name: "Photo album",   priority: "low" },
        ],
      },
    ],
  },

  wedding: {
    label: "Wedding",
    emoji: "💍",
    gradient: "linear-gradient(135deg, #e11d5c, #f43f5e)",
    accentColor: "#e11d5c",
    defaultGuests: 150,
    sections: [
      {
        id: "ceremony", icon: "💒", title: "Ceremony",
        color: "#e11d5c", bg: "#fff1f5",
        items: [
          { id: "ceremony-venue", name: "Ceremony venue booking",           priority: "high" },
          { id: "officiant",      name: "Officiant / priest / registrar",   priority: "high" },
          { id: "rings",          name: "Wedding rings",                    priority: "high" },
          { id: "vows",           name: "Write personal vows",              priority: "medium" },
          { id: "license",        name: "Marriage license / registration",  priority: "high" },
          { id: "programs",       name: "Ceremony programs",                priority: "low" },
        ],
      },
      {
        id: "reception", icon: "🥂", title: "Reception",
        color: "#7c3aed", bg: "#f5f3ff",
        items: [
          { id: "reception-venue", name: "Reception hall / venue",      priority: "high",   canFindVendor: true, vendorCategory: "catering" },
          { id: "catering",        name: "Catering & menu selection",   priority: "high",   canFindVendor: true, vendorCategory: "catering" },
          { id: "wedding-cake",    name: "Wedding cake",                priority: "high",   canFindVendor: true, vendorCategory: "cakes" },
          { id: "bar",             name: "Bar & beverages",             priority: "medium" },
          { id: "seating",         name: "Seating arrangement plan",    priority: "medium" },
        ],
      },
      {
        id: "attire", icon: "👗", title: "Attire & Beauty",
        color: "#db2777", bg: "#fdf2f8",
        items: [
          { id: "bride-dress",  name: "Bridal gown",              priority: "high" },
          { id: "groom-suit",   name: "Groom's suit / tuxedo",    priority: "high" },
          { id: "bridesmaids",  name: "Bridesmaids dresses",      priority: "medium" },
          { id: "groomsmen",    name: "Groomsmen suits",          priority: "medium" },
          { id: "makeup",       name: "Bridal hair & makeup",     priority: "high",   canFindVendor: true, vendorCategory: "beauty" },
        ],
      },
      {
        id: "florals", icon: "🌸", title: "Florals & Decoration",
        color: "#059669", bg: "#ecfdf5",
        items: [
          { id: "bouquet",       name: "Bridal bouquet",          priority: "high",   canFindVendor: true, vendorCategory: "flowers" },
          { id: "centerpieces",  name: "Table centerpieces",      priority: "high",   canFindVendor: true, vendorCategory: "flowers" },
          { id: "arch",          name: "Wedding arch / backdrop", priority: "medium", canFindVendor: true, vendorCategory: "decor" },
          { id: "aisle-decor",   name: "Aisle decoration",        priority: "medium" },
          { id: "boutonnieres",  name: "Boutonnieres",            priority: "low" },
        ],
      },
      {
        id: "entertainment", icon: "🎵", title: "Entertainment & Music",
        color: "#0891b2", bg: "#ecfeff",
        items: [
          { id: "dj",      name: "DJ / Live band",        priority: "high",   canFindVendor: true, vendorCategory: "music" },
          { id: "mc",      name: "MC / Tamada",           priority: "high" },
          { id: "ceremony-music", name: "Ceremony music", priority: "medium", canFindVendor: true, vendorCategory: "music" },
          { id: "first-dance",    name: "Plan first dance song", priority: "medium" },
        ],
      },
      {
        id: "media", icon: "📸", title: "Photography & Video",
        color: "#d97706", bg: "#fffbeb",
        items: [
          { id: "photographer", name: "Wedding photographer",      priority: "high",   canFindVendor: true, vendorCategory: "photography" },
          { id: "videographer", name: "Videographer",              priority: "high",   canFindVendor: true, vendorCategory: "photography" },
          { id: "photo-booth",  name: "Photo booth",               priority: "low" },
        ],
      },
      {
        id: "logistics", icon: "🚗", title: "Logistics & Admin",
        color: "#64748b", bg: "#f8fafc",
        items: [
          { id: "invitations",     name: "Design & send invitations",       priority: "high" },
          { id: "transport",       name: "Wedding car / transport",         priority: "medium" },
          { id: "accommodation",   name: "Hotel for out-of-town guests",    priority: "medium" },
          { id: "honeymoon",       name: "Honeymoon planning",              priority: "medium" },
        ],
      },
    ],
  },

  birthday: {
    label: "Birthday Party",
    emoji: "🎂",
    gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
    accentColor: "#3b82f6",
    defaultGuests: 30,
    sections: [
      {
        id: "cake-sweets", icon: "🎂", title: "Cake & Sweets",
        color: "#e11d5c", bg: "#fff1f5",
        items: [
          { id: "birthday-cake",  name: "Birthday cake",            priority: "high",   canFindVendor: true, vendorCategory: "cakes" },
          { id: "dessert-table",  name: "Dessert table / sweet bar",priority: "medium", canFindVendor: true, vendorCategory: "cakes" },
          { id: "cupcakes",       name: "Cupcakes / mini desserts", priority: "low" },
        ],
      },
      {
        id: "venue-decor", icon: "🎈", title: "Venue & Decorations",
        color: "#7c3aed", bg: "#f5f3ff",
        items: [
          { id: "venue",       name: "Venue / location",               priority: "high" },
          { id: "balloons",    name: "Balloon decorations",            priority: "high",   canFindVendor: true, vendorCategory: "balloons" },
          { id: "theme-decor", name: "Theme decorations & backdrop",   priority: "medium", canFindVendor: true, vendorCategory: "decor" },
          { id: "tableware",   name: "Themed tableware",               priority: "low" },
          { id: "banner",      name: "Happy Birthday banner",          priority: "low" },
        ],
      },
      {
        id: "catering", icon: "🍽️", title: "Food & Drinks",
        color: "#059669", bg: "#ecfdf5",
        items: [
          { id: "food",   name: "Food / catering",     priority: "high",   canFindVendor: true, vendorCategory: "catering" },
          { id: "drinks", name: "Drinks & bar setup",  priority: "medium" },
        ],
      },
      {
        id: "entertainment", icon: "🎵", title: "Entertainment",
        color: "#0891b2", bg: "#ecfeff",
        items: [
          { id: "music",      name: "DJ / playlist / music", priority: "high",   canFindVendor: true, vendorCategory: "music" },
          { id: "host",       name: "Event host / MC",       priority: "medium" },
          { id: "activities", name: "Activities / games",   priority: "medium" },
        ],
      },
      {
        id: "media", icon: "📸", title: "Photography",
        color: "#d97706", bg: "#fffbeb",
        items: [
          { id: "photographer", name: "Photographer",          priority: "medium", canFindVendor: true, vendorCategory: "photography" },
          { id: "photo-corner", name: "Photo corner / props", priority: "low" },
        ],
      },
      {
        id: "extras", icon: "💌", title: "Invitations & Extras",
        color: "#64748b", bg: "#f8fafc",
        items: [
          { id: "invitations", name: "Send invitations",        priority: "high" },
          { id: "favors",      name: "Party favors / gift bags",priority: "medium" },
        ],
      },
    ],
  },

  "kids-party": {
    label: "Kids' Party",
    emoji: "🎠",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    accentColor: "#10b981",
    defaultGuests: 20,
    sections: [
      {
        id: "cake", icon: "🎂", title: "Cake & Sweets",
        color: "#e11d5c", bg: "#fff1f5",
        items: [
          { id: "themed-cake", name: "Themed birthday cake",    priority: "high",   canFindVendor: true, vendorCategory: "cakes" },
          { id: "candy-bar",   name: "Candy / sweet bar",       priority: "medium" },
          { id: "cupcakes",    name: "Mini cupcakes for kids",  priority: "low" },
        ],
      },
      {
        id: "decor", icon: "🎈", title: "Decorations & Theme",
        color: "#7c3aed", bg: "#f5f3ff",
        items: [
          { id: "theme",    name: "Choose a theme (Frozen, Spiderman, Dinosaurs…)", priority: "high" },
          { id: "balloons", name: "Balloon decorations",                             priority: "high",   canFindVendor: true, vendorCategory: "balloons" },
          { id: "backdrop", name: "Themed backdrop / setup",                         priority: "medium", canFindVendor: true, vendorCategory: "decor" },
          { id: "tableware",name: "Themed plates & cups",                            priority: "medium" },
        ],
      },
      {
        id: "entertainment", icon: "🎪", title: "Entertainment for Kids",
        color: "#059669", bg: "#ecfdf5",
        items: [
          { id: "animator",      name: "Animator / entertainer",      priority: "high",   canFindVendor: true, vendorCategory: "entertainment" },
          { id: "games",         name: "Kids games & activities",     priority: "high" },
          { id: "mascot",        name: "Mascot costume / character",  priority: "medium" },
          { id: "bouncy-castle", name: "Bouncy castle / play zone",  priority: "medium" },
          { id: "face-paint",    name: "Face painting",              priority: "low" },
        ],
      },
      {
        id: "food", icon: "🍕", title: "Food & Drinks",
        color: "#d97706", bg: "#fffbeb",
        items: [
          { id: "kids-food",     name: "Kids-friendly food",   priority: "high",   canFindVendor: true, vendorCategory: "catering" },
          { id: "juice-station", name: "Juice / drink station",priority: "medium" },
          { id: "snacks",        name: "Snack bags for kids",  priority: "low" },
        ],
      },
      {
        id: "favors", icon: "🎁", title: "Goodie Bags & Invitations",
        color: "#0891b2", bg: "#ecfeff",
        items: [
          { id: "goodie-bags", name: "Goodie bags for kids",         priority: "high" },
          { id: "invitations", name: "Send invitations to parents",  priority: "high" },
          { id: "toys",        name: "Small prizes / toys",          priority: "medium" },
        ],
      },
      {
        id: "media", icon: "📸", title: "Photography",
        color: "#64748b", bg: "#f8fafc",
        items: [
          { id: "photographer", name: "Photographer", priority: "medium", canFindVendor: true, vendorCategory: "photography" },
        ],
      },
    ],
  },

  corporate: {
    label: "Corporate Event",
    emoji: "🏢",
    gradient: "linear-gradient(135deg, #475569, #334155)",
    accentColor: "#475569",
    defaultGuests: 100,
    sections: [
      {
        id: "venue", icon: "🏛️", title: "Venue & Setup",
        color: "#334155", bg: "#f8fafc",
        items: [
          { id: "venue",        name: "Venue / conference hall",  priority: "high" },
          { id: "setup",        name: "Room layout & setup",      priority: "high" },
          { id: "registration", name: "Registration / check-in", priority: "medium" },
          { id: "signage",      name: "Event signage & branding", priority: "medium" },
        ],
      },
      {
        id: "av-tech", icon: "🎤", title: "AV & Technology",
        color: "#0891b2", bg: "#ecfeff",
        items: [
          { id: "microphones", name: "Microphones & PA system",  priority: "high" },
          { id: "projector",   name: "Projector / LED screens",  priority: "high" },
          { id: "wifi",        name: "Wi-Fi / internet setup",   priority: "medium" },
          { id: "live-stream", name: "Live streaming setup",     priority: "low" },
        ],
      },
      {
        id: "catering", icon: "☕", title: "Catering",
        color: "#d97706", bg: "#fffbeb",
        items: [
          { id: "coffee-break",   name: "Coffee & tea break station", priority: "high",   canFindVendor: true, vendorCategory: "catering" },
          { id: "lunch",          name: "Lunch / dinner catering",    priority: "high",   canFindVendor: true, vendorCategory: "catering" },
          { id: "welcome-drinks", name: "Welcome drinks / reception", priority: "medium" },
        ],
      },
      {
        id: "content", icon: "📊", title: "Content & Materials",
        color: "#7c3aed", bg: "#f5f3ff",
        items: [
          { id: "presentations", name: "Presentations / slides",       priority: "high" },
          { id: "printing",      name: "Print materials & handouts",   priority: "medium" },
          { id: "name-tags",     name: "Name badges / lanyards",       priority: "medium" },
          { id: "gifts",         name: "Corporate gifts / branded items", priority: "low" },
        ],
      },
      {
        id: "entertainment", icon: "🎭", title: "Entertainment",
        color: "#059669", bg: "#ecfdf5",
        items: [
          { id: "speaker",       name: "Keynote speaker / host",      priority: "high" },
          { id: "entertainment", name: "Evening entertainment",        priority: "medium", canFindVendor: true, vendorCategory: "music" },
          { id: "team-building", name: "Team building activities",    priority: "low" },
        ],
      },
      {
        id: "media", icon: "📸", title: "Documentation",
        color: "#e11d5c", bg: "#fff1f5",
        items: [
          { id: "photographer", name: "Event photographer", priority: "high",   canFindVendor: true, vendorCategory: "photography" },
          { id: "videographer", name: "Videographer",       priority: "medium", canFindVendor: true, vendorCategory: "photography" },
        ],
      },
    ],
  },

  engagement: {
    label: "Engagement Party",
    emoji: "💍",
    gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    accentColor: "#7c3aed",
    defaultGuests: 40,
    sections: [
      {
        id: "the-moment", icon: "💍", title: "The Proposal Moment",
        color: "#7c3aed", bg: "#f5f3ff",
        items: [
          { id: "ring",         name: "Engagement ring",          priority: "high" },
          { id: "location",     name: "Special proposal location",priority: "high" },
          { id: "flowers",      name: "Flowers for the moment",   priority: "high",   canFindVendor: true, vendorCategory: "flowers" },
          { id: "photographer", name: "Secret photographer",      priority: "medium", canFindVendor: true, vendorCategory: "photography" },
          { id: "champagne",    name: "Champagne / sparkling",    priority: "medium" },
        ],
      },
      {
        id: "party", icon: "🥂", title: "Engagement Celebration",
        color: "#e11d5c", bg: "#fff1f5",
        items: [
          { id: "venue",    name: "Party venue",           priority: "high",   canFindVendor: true, vendorCategory: "catering" },
          { id: "cake",     name: "Engagement cake",       priority: "high",   canFindVendor: true, vendorCategory: "cakes" },
          { id: "catering", name: "Food & catering",       priority: "high",   canFindVendor: true, vendorCategory: "catering" },
          { id: "decor",    name: "Romantic decorations",  priority: "medium", canFindVendor: true, vendorCategory: "decor" },
          { id: "music",    name: "Music / DJ",            priority: "medium", canFindVendor: true, vendorCategory: "music" },
        ],
      },
      {
        id: "media", icon: "📸", title: "Photography",
        color: "#d97706", bg: "#fffbeb",
        items: [
          { id: "photo-session", name: "Engagement photo session", priority: "high",   canFindVendor: true, vendorCategory: "photography" },
          { id: "video",         name: "Video highlights",         priority: "medium" },
        ],
      },
      {
        id: "invitations", icon: "💌", title: "Invitations",
        color: "#059669", bg: "#ecfdf5",
        items: [
          { id: "invitations",  name: "Send party invitations",    priority: "high" },
          { id: "announcement", name: "Social media announcement", priority: "low" },
        ],
      },
    ],
  },

  anniversary: {
    label: "Anniversary",
    emoji: "⭐",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    accentColor: "#d97706",
    defaultGuests: 30,
    sections: [
      {
        id: "special", icon: "❤️", title: "Special Touches",
        color: "#e11d5c", bg: "#fff1f5",
        items: [
          { id: "flowers", name: "Flower arrangement",        priority: "high",   canFindVendor: true, vendorCategory: "flowers" },
          { id: "gift",    name: "Special anniversary gift",  priority: "high" },
          { id: "letter",  name: "Handwritten letter / vow renewal", priority: "medium" },
        ],
      },
      {
        id: "celebration", icon: "🥂", title: "Celebration",
        color: "#d97706", bg: "#fffbeb",
        items: [
          { id: "venue",    name: "Restaurant / venue",          priority: "high" },
          { id: "cake",     name: "Anniversary cake",            priority: "high",   canFindVendor: true, vendorCategory: "cakes" },
          { id: "catering", name: "Dinner / catering",           priority: "high",   canFindVendor: true, vendorCategory: "catering" },
          { id: "decor",    name: "Romantic table decorations",  priority: "medium", canFindVendor: true, vendorCategory: "decor" },
          { id: "music",    name: "Live music / musicians",      priority: "medium", canFindVendor: true, vendorCategory: "music" },
        ],
      },
      {
        id: "media", icon: "📸", title: "Memories",
        color: "#7c3aed", bg: "#f5f3ff",
        items: [
          { id: "photographer",  name: "Photographer",           priority: "medium", canFindVendor: true, vendorCategory: "photography" },
          { id: "video-montage", name: "Memory video / slideshow",priority: "low" },
        ],
      },
    ],
  },

  "baby-shower": {
    label: "Baby Shower",
    emoji: "🍼",
    gradient: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
    accentColor: "#0ea5e9",
    defaultGuests: 25,
    sections: [
      {
        id: "decor", icon: "🎀", title: "Decorations & Theme",
        color: "#0891b2", bg: "#ecfeff",
        items: [
          { id: "theme",     name: "Choose theme (gender-neutral / pink / blue)", priority: "high" },
          { id: "balloons",  name: "Balloon arch / decorations",                  priority: "high",   canFindVendor: true, vendorCategory: "balloons" },
          { id: "backdrop",  name: "Photo backdrop setup",                         priority: "medium", canFindVendor: true, vendorCategory: "decor" },
          { id: "table-dec", name: "Table centerpieces",                           priority: "medium" },
          { id: "banner",    name: '"Baby Shower" banner',                          priority: "low" },
        ],
      },
      {
        id: "cake", icon: "🍰", title: "Cake & Sweets",
        color: "#e11d5c", bg: "#fff1f5",
        items: [
          { id: "cake",          name: "Baby shower cake",      priority: "high",   canFindVendor: true, vendorCategory: "cakes" },
          { id: "gender-reveal", name: "Gender reveal cake (if applicable)", priority: "medium", canFindVendor: true, vendorCategory: "cakes" },
          { id: "sweet-table",   name: "Dessert table",         priority: "medium" },
        ],
      },
      {
        id: "food", icon: "🍽️", title: "Food & Drinks",
        color: "#059669", bg: "#ecfdf5",
        items: [
          { id: "catering",  name: "Finger food / catering",         priority: "high",   canFindVendor: true, vendorCategory: "catering" },
          { id: "mocktails", name: "Mocktails & drinks (alcohol-free)", priority: "medium" },
        ],
      },
      {
        id: "activities", icon: "🎮", title: "Activities & Games",
        color: "#7c3aed", bg: "#f5f3ff",
        items: [
          { id: "games",        name: "Baby shower games",       priority: "high" },
          { id: "gift-opening", name: "Gift opening session",    priority: "high" },
          { id: "advice-cards", name: "Parenting advice cards",  priority: "low" },
        ],
      },
      {
        id: "favors", icon: "🎁", title: "Favors & Registry",
        color: "#d97706", bg: "#fffbeb",
        items: [
          { id: "registry",    name: "Baby registry setup",       priority: "high" },
          { id: "invitations", name: "Send invitations",          priority: "high" },
          { id: "favors",      name: "Personalized party favors", priority: "medium" },
        ],
      },
      {
        id: "media", icon: "📸", title: "Photography",
        color: "#64748b", bg: "#f8fafc",
        items: [
          { id: "photographer", name: "Photographer", priority: "medium", canFindVendor: true, vendorCategory: "photography" },
        ],
      },
    ],
  },

  graduation: {
    label: "Graduation Party",
    emoji: "🎓",
    gradient: "linear-gradient(135deg, #f59e0b, #ea580c)",
    accentColor: "#ea580c",
    defaultGuests: 50,
    sections: [
      {
        id: "celebration", icon: "🎓", title: "Celebration Setup",
        color: "#d97706", bg: "#fffbeb",
        items: [
          { id: "venue",    name: "Venue / location",        priority: "high" },
          { id: "theme",    name: "Theme & colors",          priority: "medium" },
          { id: "backdrop", name: "Photo backdrop with year",priority: "medium", canFindVendor: true, vendorCategory: "decor" },
          { id: "balloons", name: "Graduation balloons",     priority: "medium", canFindVendor: true, vendorCategory: "balloons" },
        ],
      },
      {
        id: "food", icon: "🎂", title: "Cake & Catering",
        color: "#e11d5c", bg: "#fff1f5",
        items: [
          { id: "cake",     name: "Graduation cake",  priority: "high",   canFindVendor: true, vendorCategory: "cakes" },
          { id: "catering", name: "Food & catering",  priority: "high",   canFindVendor: true, vendorCategory: "catering" },
          { id: "drinks",   name: "Drinks",           priority: "medium" },
        ],
      },
      {
        id: "entertainment", icon: "🎵", title: "Entertainment",
        color: "#7c3aed", bg: "#f5f3ff",
        items: [
          { id: "music",     name: "Music / DJ",             priority: "medium", canFindVendor: true, vendorCategory: "music" },
          { id: "slideshow", name: "Memory slideshow / video",priority: "medium" },
        ],
      },
      {
        id: "media", icon: "📸", title: "Photography",
        color: "#0891b2", bg: "#ecfeff",
        items: [
          { id: "photographer", name: "Photographer",     priority: "medium", canFindVendor: true, vendorCategory: "photography" },
          { id: "photo-booth",  name: "Photo booth props",priority: "low" },
        ],
      },
      {
        id: "gifts", icon: "🎁", title: "Gifts & Invitations",
        color: "#059669", bg: "#ecfdf5",
        items: [
          { id: "invitations", name: "Send invitations",        priority: "high" },
          { id: "favors",      name: "Party favors / keepsakes",priority: "low" },
        ],
      },
    ],
  },

  "new-year": {
    label: "New Year / Holiday Party",
    emoji: "🎆",
    gradient: "linear-gradient(135deg, #1e1b4b, #4c1d95)",
    accentColor: "#6d28d9",
    defaultGuests: 60,
    sections: [
      {
        id: "venue-decor", icon: "✨", title: "Venue & Decorations",
        color: "#7c3aed", bg: "#f5f3ff",
        items: [
          { id: "venue",      name: "Venue / hall booking",             priority: "high" },
          { id: "decor",      name: "Festive decorations (gold/silver)",priority: "high",   canFindVendor: true, vendorCategory: "decor" },
          { id: "balloons",   name: "Balloon drop / arch",              priority: "medium", canFindVendor: true, vendorCategory: "balloons" },
          { id: "countdown",  name: "Countdown clock / display",        priority: "medium" },
          { id: "party-hats", name: "Party hats & horns",               priority: "low" },
        ],
      },
      {
        id: "food", icon: "🍾", title: "Food & Drinks",
        color: "#e11d5c", bg: "#fff1f5",
        items: [
          { id: "catering",   name: "Catering / buffet",         priority: "high",   canFindVendor: true, vendorCategory: "catering" },
          { id: "champagne",  name: "Champagne / toasting drinks",priority: "high" },
          { id: "cake",       name: "New Year cake",              priority: "medium", canFindVendor: true, vendorCategory: "cakes" },
          { id: "snacks",     name: "Midnight snacks",            priority: "medium" },
        ],
      },
      {
        id: "entertainment", icon: "🎵", title: "Entertainment",
        color: "#059669", bg: "#ecfdf5",
        items: [
          { id: "dj",        name: "DJ / live music",     priority: "high",   canFindVendor: true, vendorCategory: "music" },
          { id: "mc",        name: "MC / host",           priority: "medium" },
          { id: "fireworks", name: "Fireworks (if outdoor)", priority: "low" },
        ],
      },
      {
        id: "media", icon: "📸", title: "Photography & Memories",
        color: "#d97706", bg: "#fffbeb",
        items: [
          { id: "photographer", name: "Photographer",     priority: "medium", canFindVendor: true, vendorCategory: "photography" },
          { id: "photo-booth",  name: "Photo booth / props", priority: "low" },
        ],
      },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   EVENT TYPE DETECTION
═══════════════════════════════════════════════════════ */
function detectEventType(text) {
  const t = text.toLowerCase();
  const checks = [
    { type: "christening",  words: ["christen", "baptis", "kavor", "kavork", "կնունք", "крещен", "godfather", "godmother", "holy water", "church bapti"] },
    { type: "wedding",       words: ["wedding", "marry", "marri", "bride", "groom", "հarsan", "harsan", "свадьб", "wed ", "getting married"] },
    { type: "kids-party",    words: ["kids party", "children party", "child party", "kids birthday", "birthday party for kid", "my kids ", "my son", "my daughter", "my kid ", "for kids", "children birthday"] },
    { type: "birthday",      words: ["birthday", "birth day", "bday", "ծննdyan", "день рожден", "turning ", "years old", "born day"] },
    { type: "corporate",     words: ["corporate", "business event", "company event", "office party", "conference", "team event", "work event", "corporate party"] },
    { type: "engagement",    words: ["engag", "proposal", "propose", "will you marry", "get engaged", "fiancé", "fiancee"] },
    { type: "anniversary",   words: ["anniversary", "ամyak", "amyak", "юбилей", "годовщин", "years together", "years married", "years anniversary"] },
    { type: "baby-shower",   words: ["baby shower", "baby party", "gender reveal", "baby celebration", "expecting", "pregnant", "maternity"] },
    { type: "graduation",    words: ["graduation", "graduate", "avart", "выпускн", "school finish", "uni finish", "university finish", "graduate party", "grad party"] },
    { type: "new-year",      words: ["new year", "christmas party", "holiday party", "новый год", "nye ", "new years", "xmas party"] },
  ];
  for (const { type, words } of checks) {
    if (words.some(w => t.includes(w))) return type;
  }
  return null;
}

/* ═══════════════════════════════════════════════════════
   SMALL UI COMPONENTS
═══════════════════════════════════════════════════════ */
function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, padding: "4px 0" }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg, #7c3aed, #e11d5c)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Sparkles size={14} style={{ color: "#fff" }} />
      </div>
      <div style={{
        background: "#fff", borderRadius: "16px 16px 16px 4px",
        padding: "12px 16px", border: "1px solid #f1f5f9",
        display: "flex", alignItems: "center", gap: 5,
      }}>
        {[0, 0.18, 0.36].map((delay, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: "#c4b5fd", display: "block" }}
          />
        ))}
      </div>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const map = {
    high:   { label: "High",   bg: "#fee2e2", color: "#dc2626" },
    medium: { label: "Medium", bg: "#fef9c3", color: "#ca8a04" },
    low:    { label: "Low",    bg: "#f0fdf4", color: "#16a34a" },
  };
  const s = map[priority] || map.low;
  return (
    <span style={{
      fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.04em",
      background: s.bg, color: s.color,
      borderRadius: 100, padding: "2px 7px",
    }}>
      {s.label}
    </span>
  );
}

function MessageBubble({ msg, onQuickReply }) {
  const isBot = msg.role === "bot";
  // simple markdown: **bold**, newlines
  const renderText = (text) => {
    return text.split("\n").map((line, li) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={li}>
          {parts.map((part, pi) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={pi}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
          {li < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{ display: "flex", flexDirection: "column", alignItems: isBot ? "flex-start" : "flex-end", gap: 6 }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, maxWidth: "88%" }}>
        {isBot && (
          <div style={{
            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #7c3aed, #e11d5c)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={14} style={{ color: "#fff" }} />
          </div>
        )}
        <div style={{
          background: isBot ? "#fff" : "#e11d5c",
          color: isBot ? "#1e293b" : "#fff",
          borderRadius: isBot ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
          padding: "12px 16px",
          fontSize: "0.875rem",
          lineHeight: 1.65,
          border: isBot ? "1px solid #f1f5f9" : "none",
          boxShadow: isBot ? "0 1px 3px rgba(0,0,0,0.04)" : "0 4px 12px rgba(225,29,92,0.25)",
        }}>
          {renderText(msg.text)}
        </div>
      </div>
      {/* Quick replies */}
      {isBot && msg.quickReplies?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingLeft: 40 }}>
          {msg.quickReplies.map((qr, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.04, background: "#e11d5c", color: "#fff" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onQuickReply(qr)}
              style={{
                background: "#fff", border: "1px solid rgba(225,29,92,0.3)",
                color: "#e11d5c", borderRadius: 100, padding: "6px 14px",
                fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {qr}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   VENDOR MODAL
═══════════════════════════════════════════════════════ */
function VendorSearchModal({ item, section, lang, onAssign, onManual, onClose }) {
  const [tab, setTab] = useState("platform"); // "platform" | "manual"
  const [manualForm, setManualForm] = useState({ name: "", phone: "", notes: "", status: "contacted" });

  const categoryParam = item.vendorCategory ? `?category=${item.vendorCategory}` : "";
  const vendorsUrl = `/${lang}/products${categoryParam}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 24,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        style={{
          background: "#fff", borderRadius: 20, padding: 28,
          width: "100%", maxWidth: 460,
          boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              {section.icon} {section.title}
            </p>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>{item.name}</h3>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#f1f5f9", borderRadius: 8, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={14} style={{ color: "#64748b" }} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "#f8fafc", borderRadius: 12, padding: 4, marginBottom: 20 }}>
          {[
            { key: "platform", label: "🔍 Browse Salooote vendors" },
            { key: "manual",   label: "✏️ Add my own vendor" },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1, border: "none", borderRadius: 10, padding: "9px 0",
                fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                background: tab === t.key ? "#fff" : "transparent",
                color: tab === t.key ? "#0f172a" : "#64748b",
                boxShadow: tab === t.key ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.18s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "platform" && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              background: "linear-gradient(135deg, #f5f3ff, #fdf2f8)",
              borderRadius: 16, padding: "28px 24px", marginBottom: 16,
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{section.icon}</div>
              <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.6, marginBottom: 16 }}>
                Browse verified vendors for <strong>{item.name}</strong> on Salooote. Compare portfolios, read reviews, and contact directly.
              </p>
              <Link href={vendorsUrl} target="_blank" style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "#e11d5c", color: "#fff", border: "none",
                    borderRadius: 10, padding: "11px 22px",
                    fontSize: "0.875rem", fontWeight: 700, cursor: "pointer",
                  }}
                >
                  <Search size={15} /> Browse Vendors <ExternalLink size={13} />
                </motion.button>
              </Link>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
              Found a vendor? Come back and click "Add my own vendor" to log their details.
            </p>
          </div>
        )}

        {tab === "manual" && (
          <div>
            <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: 16 }}>
              Enter your vendor's details to save them to this checklist item.
            </p>
            {[
              { key: "name",  label: "Vendor / Business Name *", placeholder: "e.g. Royal Bakes Yerevan", required: true },
              { key: "phone", label: "Phone / Contact",           placeholder: "+374 XX XXX XXX" },
              { key: "notes", label: "Notes",                     placeholder: "Price agreed, Instagram: @..." },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>{f.label}</label>
                {f.key === "notes" ? (
                  <textarea
                    value={manualForm[f.key]}
                    onChange={e => setManualForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    rows={2}
                    style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 10, padding: "9px 12px", fontSize: "0.875rem", outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                  />
                ) : (
                  <input
                    value={manualForm[f.key]}
                    onChange={e => setManualForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 10, padding: "9px 12px", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }}
                  />
                )}
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Status</label>
              <select
                value={manualForm.status}
                onChange={e => setManualForm(prev => ({ ...prev, status: e.target.value }))}
                style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 10, padding: "9px 12px", fontSize: "0.875rem", outline: "none", background: "#fff" }}
              >
                <option value="found">Found / Considering</option>
                <option value="contacted">Contacted</option>
                <option value="quoted">Quote received</option>
                <option value="booked">Booked ✅</option>
              </select>
            </div>
            <motion.button
              whileHover={manualForm.name.trim() ? { scale: 1.02 } : {}}
              whileTap={manualForm.name.trim() ? { scale: 0.97 } : {}}
              disabled={!manualForm.name.trim()}
              onClick={() => {
                if (!manualForm.name.trim()) return;
                onAssign({ type: "manual", ...manualForm });
              }}
              style={{
                width: "100%", padding: "11px 0",
                background: manualForm.name.trim() ? "#e11d5c" : "#f1f5f9",
                color: manualForm.name.trim() ? "#fff" : "#94a3b8",
                border: "none", borderRadius: 10,
                fontSize: "0.875rem", fontWeight: 700, cursor: manualForm.name.trim() ? "pointer" : "default",
              }}
            >
              Save Vendor
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   CHECKLIST SECTION
═══════════════════════════════════════════════════════ */
function ChecklistSection({ section, checkedItems, vendors, onToggle, onFindVendor, onRemoveVendor }) {
  const [open, setOpen] = useState(true);

  const done  = section.items.filter(it => checkedItems[`${section.id}.${it.id}`]?.checked).length;
  const total = section.items.length;
  const pct   = Math.round((done / total) * 100);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      border: "1px solid #f1f5f9",
      overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      {/* Section header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          padding: "14px 16px", display: "flex", alignItems: "center", gap: 10,
          borderBottom: open ? `1px solid ${section.bg}` : "none",
        }}
      >
        <span style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: section.bg, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "1.1rem",
        }}>
          {section.icon}
        </span>
        <div style={{ flex: 1, textAlign: "left" }}>
          <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#0f172a" }}>{section.title}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
            <div style={{ flex: 1, height: 3, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: section.color, borderRadius: 10, transition: "width 0.4s ease" }} />
            </div>
            <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600, flexShrink: 0 }}>
              {done}/{total}
            </span>
          </div>
        </div>
        {open ? <ChevronUp size={14} style={{ color: "#94a3b8", flexShrink: 0 }} /> : <ChevronDown size={14} style={{ color: "#94a3b8", flexShrink: 0 }} />}
      </button>

      {/* Items */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "8px 12px 12px" }}>
              {section.items.map((item, idx) => {
                const key      = `${section.id}.${item.id}`;
                const isChecked = !!checkedItems[key]?.checked;
                const vendor    = vendors[key];

                return (
                  <div key={item.id}>
                    {idx > 0 && <div style={{ height: 1, background: "#f8fafc", margin: "0 4px" }} />}
                    <div style={{ padding: "9px 4px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                      {/* Checkbox */}
                      <motion.button
                        onClick={() => onToggle(section.id, item.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                          border: `2px solid ${isChecked ? section.color : "#d1d5db"}`,
                          background: isChecked ? section.color : "transparent",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.15s",
                        }}
                      >
                        {isChecked && <Check size={11} style={{ color: "#fff" }} strokeWidth={3} />}
                      </motion.button>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          <span style={{
                            fontSize: "0.82rem", fontWeight: 500,
                            color: isChecked ? "#94a3b8" : "#1e293b",
                            textDecoration: isChecked ? "line-through" : "none",
                            transition: "color 0.15s",
                          }}>
                            {item.name}
                          </span>
                          <PriorityBadge priority={item.priority} />
                        </div>

                        {item.tip && !vendor && (
                          <p style={{ margin: "3px 0 0", fontSize: "0.72rem", color: "#94a3b8", fontStyle: "italic" }}>
                            💡 {item.tip}
                          </p>
                        )}

                        {/* Vendor chip */}
                        {vendor && (
                          <div style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            background: "#f0fdf4", border: "1px solid #bbf7d0",
                            borderRadius: 100, padding: "3px 10px 3px 8px", marginTop: 5,
                          }}>
                            <Building2 size={11} style={{ color: "#16a34a", flexShrink: 0 }} />
                            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#15803d" }}>{vendor.name}</span>
                            {vendor.status && (
                              <span style={{
                                fontSize: "0.65rem", background: "#dcfce7", color: "#15803d",
                                borderRadius: 100, padding: "1px 6px", fontWeight: 700,
                              }}>
                                {vendor.status}
                              </span>
                            )}
                            <button
                              onClick={() => onRemoveVendor(section.id, item.id)}
                              style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", lineHeight: 1 }}
                            >
                              <X size={10} style={{ color: "#86efac" }} />
                            </button>
                          </div>
                        )}

                        {/* Find vendor button */}
                        {item.canFindVendor && !vendor && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onFindVendor(section, item)}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 5,
                              background: "rgba(225,29,92,0.06)", border: "1px solid rgba(225,29,92,0.18)",
                              color: "#e11d5c", borderRadius: 100, padding: "4px 10px",
                              fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", marginTop: 5,
                            }}
                          >
                            <Search size={10} /> Find vendor
                          </motion.button>
                        )}

                        {/* Add manually (items that can't find vendor on platform) */}
                        {!item.canFindVendor && !vendor && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onFindVendor(section, item)}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 5,
                              background: "#f8fafc", border: "1px solid #e2e8f0",
                              color: "#64748b", borderRadius: 100, padding: "4px 10px",
                              fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", marginTop: 5,
                            }}
                          >
                            <Plus size={10} /> Add vendor
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   EVENT PLAN PANEL (right side)
═══════════════════════════════════════════════════════ */
function EventPlanPanel({ plan, type, meta, checkedItems, vendors, onToggle, onFindVendor, onRemoveVendor }) {
  const totalItems = plan.sections.reduce((s, sec) => s + sec.items.length, 0);
  const doneItems  = Object.values(checkedItems).filter(v => v.checked).length;
  const pct        = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  return (
    <div>
      {/* Plan header card */}
      <div style={{
        background: plan.gradient,
        borderRadius: 20, padding: "20px 22px", marginBottom: 16,
        color: "#fff", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: "2rem" }}>{plan.emoji}</span>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>{plan.label}</h2>
              <div style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
                {meta.date && (
                  <span style={{ fontSize: "0.72rem", opacity: 0.85, display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={11} /> {meta.date}
                  </span>
                )}
                {meta.guests && (
                  <span style={{ fontSize: "0.72rem", opacity: 0.85, display: "flex", alignItems: "center", gap: 4 }}>
                    <Users size={11} /> {meta.guests} guests
                  </span>
                )}
                {meta.budget && (
                  <span style={{ fontSize: "0.72rem", opacity: 0.85, display: "flex", alignItems: "center", gap: 4 }}>
                    <DollarSign size={11} /> {meta.budget}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.25)", borderRadius: 10, overflow: "hidden" }}>
              <motion.div
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ height: "100%", background: "#fff", borderRadius: 10 }}
              />
            </div>
            <span style={{ fontSize: "0.8rem", fontWeight: 800 }}>{pct}%</span>
          </div>
          <p style={{ margin: "6px 0 0", fontSize: "0.72rem", opacity: 0.7 }}>
            {doneItems} of {totalItems} tasks complete
          </p>
        </div>
      </div>

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {plan.sections.map(section => (
          <ChecklistSection
            key={section.id}
            section={section}
            checkedItems={checkedItems}
            vendors={vendors}
            onToggle={onToggle}
            onFindVendor={onFindVendor}
            onRemoveVendor={onRemoveVendor}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PLANNER CLIENT
═══════════════════════════════════════════════════════ */
export default function PlannerClient({ lang }) {
  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState("");
  const [isTyping,    setIsTyping]    = useState(false);
  const [eventType,   setEventType]   = useState(null);
  const [chatStage,   setChatStage]   = useState("idle");
  const [meta,        setMeta]        = useState({ date: null, guests: null, budget: null });
  const [checkedItems,setCheckedItems]= useState({});
  const [vendors,     setVendors]     = useState({});
  const [vendorModal, setVendorModal] = useState(null); // { section, item }
  const [mobileTab,   setMobileTab]   = useState("chat"); // "chat" | "plan"

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const planData       = eventType ? EVENT_PLANS[eventType] : null;

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Greeting on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      pushBot(
        "Hi! I'm your Salooote event planner 🎉\n\nTell me about the event you're planning — just describe it in your own words and I'll build a personalized checklist for you!",
        ["Wedding 💍", "Birthday 🎂", "Christening ⛪", "Kids Party 🎈", "Corporate 🏢", "Baby Shower 🍼"]
      );
      setChatStage("waiting_event");
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  // Save plan to localStorage whenever it changes
  useEffect(() => {
    if (!eventType) return;
    const save = { eventType, meta, checkedItems, vendors, savedAt: new Date().toISOString() };
    localStorage.setItem("salooote_planner_current", JSON.stringify(save));
  }, [eventType, meta, checkedItems, vendors]);

  const pushBot = useCallback((text, quickReplies = []) => {
    setIsTyping(true);
    const delay = 550 + Math.min(text.length * 7, 1200);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + Math.random(), role: "bot", text, quickReplies }]);
    }, delay);
  }, []);

  const pushUser = (text) => {
    setMessages(prev => [...prev, { id: Date.now(), role: "user", text }]);
  };

  const processInput = useCallback((text) => {
    const t = text.trim();
    if (!t) return;

    if (chatStage === "waiting_event") {
      const detected = detectEventType(t);
      if (detected) {
        const plan = EVENT_PLANS[detected];
        setEventType(detected);
        setChatStage("ask_date");
        if (window.innerWidth < 900) setMobileTab("plan");
        pushBot(
          `${plan.emoji} Perfect! I've created your **${plan.label}** checklist — check it out on the right! ✨\n\n📅 Do you have a date in mind? (or say "not sure" to skip)`
        );
      } else {
        pushBot(
          "I'd love to help! What type of event are you planning? Choose one below or describe it:",
          ["Wedding 💍", "Birthday 🎂", "Christening ⛪", "Kids Party 🎈", "Corporate 🏢", "Engagement 💍", "Anniversary ⭐", "Baby Shower 🍼", "Graduation 🎓"]
        );
      }
      return;
    }

    if (chatStage === "ask_date") {
      const skip = /skip|not sure|later|don.t know|no date|tbd|maybe/i.test(t);
      const date = skip ? null : t;
      setMeta(prev => ({ ...prev, date }));
      setChatStage("ask_guests");
      pushBot(
        date
          ? `📅 **${date}** — noted! How many guests are you expecting?`
          : "No worries, you can set the date later! 👥 How many guests are you expecting? (approximate is fine)"
      );
      return;
    }

    if (chatStage === "ask_guests") {
      const numMatch = t.match(/\d+/);
      const guests   = numMatch ? `~${numMatch[0]}` : t;
      setMeta(prev => ({ ...prev, guests }));
      setChatStage("ask_budget");
      pushBot(`👥 **${guests} guests** — great! Do you have a rough budget in mind? (e.g. "$500–1,000", "under $2,000", or say "skip")`);
      return;
    }

    if (chatStage === "ask_budget") {
      const skip   = /skip|no budget|not sure|flexible|don.t know/i.test(t);
      const budget = skip ? null : t;
      setMeta(prev => ({ ...prev, budget }));
      setChatStage("planning");
      pushBot(
        `🎉 Your event plan is all set!\n\nHere's how to use it:\n✅ **Check off items** as you complete them\n🔍 **Find Vendor** — browse verified vendors on Salooote\n✏️ **Add vendor** — log your own vendor with contact info\n\nWhat would you like to tackle first?`
      );
      return;
    }

    if (chatStage === "planning") {
      const low = t.toLowerCase();
      if (low.includes("vendor") || low.includes("find") || low.includes("book") || low.includes("who")) {
        pushBot("Click the 🔍 **Find vendor** button next to any checklist item to browse verified vendors. Already have someone in mind? Click **Add vendor** to save their details!");
      } else if (low.includes("date") || low.includes("when") || low.includes("day")) {
        const d = t.match(/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/) || t.match(/\w+ \d{1,2},? \d{4}/) || t.match(/\d{4}/);
        if (d) {
          setMeta(prev => ({ ...prev, date: t }));
          pushBot(`📅 Date updated to **${t}**! I've saved it to your plan.`);
        } else {
          pushBot("What date are you thinking? Just type it (e.g. 'June 15, 2025' or '15/06/2025').");
        }
      } else if (low.includes("guest") || low.includes("people") || low.includes("how many")) {
        pushBot("How many guests are you now expecting? I'll update your plan!");
        setChatStage("update_guests");
      } else if (low.includes("budget") || low.includes("cost") || low.includes("price") || low.includes("spend")) {
        pushBot("What's your budget range? (e.g. '$500–1,000' or 'around $3,000')");
        setChatStage("update_budget");
      } else if (low.includes("help") || low.includes("what can")) {
        pushBot("Here's what I can help with:\n📅 Set or update your event **date**\n👥 Update **guest count**\n💰 Log your **budget**\n🔍 Find **vendors** for any item\n✅ Track your **checklist progress**\n\nJust ask or use the checklist panel!");
      } else if (low.includes("done") || low.includes("finish") || low.includes("complete") || low.includes("great")) {
        const planD = planData ? planData.sections.reduce((s, sec) => s + sec.items.length, 0) : 0;
        const doneD = Object.values(checkedItems).filter(v => v.checked).length;
        pushBot(`You're making great progress! 🌟 **${doneD}/${planD}** tasks done. Keep going — you've got this! 💪`);
      } else {
        pushBot("I'm here to help with your event planning! Ask me about vendors, dates, budget, or anything on your checklist. What do you need? 😊");
      }
      return;
    }

    if (chatStage === "update_guests") {
      const numMatch = t.match(/\d+/);
      const guests   = numMatch ? `~${numMatch[0]}` : t;
      setMeta(prev => ({ ...prev, guests }));
      setChatStage("planning");
      pushBot(`👥 Updated to **${guests} guests**! Your plan is saved.`);
      return;
    }

    if (chatStage === "update_budget") {
      setMeta(prev => ({ ...prev, budget: t }));
      setChatStage("planning");
      pushBot(`💰 Budget set to **${t}**! Your plan is saved.`);
      return;
    }
  }, [chatStage, planData, checkedItems]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    pushUser(text);
    processInput(text);
    inputRef.current?.focus();
  };

  const handleQuickReply = (text) => {
    pushUser(text);
    processInput(text);
  };

  const toggleItem = useCallback((sectionId, itemId) => {
    const key = `${sectionId}.${itemId}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: { ...prev[key], checked: !prev[key]?.checked },
    }));
  }, []);

  const assignVendor = useCallback((vendor) => {
    if (!vendorModal) return;
    const { section, item } = vendorModal;
    const key = `${section.id}.${item.id}`;
    setVendors(prev => ({ ...prev, [key]: vendor }));
    setVendorModal(null);
    pushBot(`✅ **${vendor.name}** saved as your vendor for **${item.name}**! Marked in your checklist.`);
  }, [vendorModal, pushBot]);

  const removeVendor = useCallback((sectionId, itemId) => {
    const key = `${sectionId}.${itemId}`;
    setVendors(prev => { const n = { ...prev }; delete n[key]; return n; });
  }, []);

  const totalItems = planData?.sections.reduce((s, sec) => s + sec.items.length, 0) || 0;
  const doneItems  = Object.values(checkedItems).filter(v => v.checked).length;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7fc", display: "flex", flexDirection: "column" }}>

      {/* ── Top bar ── */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #f1f5f9",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href={`/${lang}`} style={{ textDecoration: "none" }}>
              <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                style={{ width: 34, height: 34, borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <ArrowLeft size={15} style={{ color: "#475569" }} />
              </motion.button>
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #7c3aed, #e11d5c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={14} style={{ color: "#fff" }} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>Event Planner</p>
                <p style={{ margin: 0, fontSize: "0.68rem", color: "#94a3b8", lineHeight: 1, marginTop: 2 }}>AI-powered by Salooote</p>
              </div>
            </div>
          </div>

          {/* Progress & event info */}
          {planData && (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: "1.2rem" }}>{planData.emoji}</span>
              <div>
                <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 700, color: "#0f172a" }}>{planData.label}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                  <div style={{ width: 80, height: 4, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
                    <motion.div
                      animate={{ width: `${totalItems > 0 ? (doneItems / totalItems) * 100 : 0}%` }}
                      style={{ height: "100%", background: "#e11d5c", borderRadius: 10 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600 }}>{doneItems}/{totalItems}</span>
                </div>
              </div>
            </div>
          )}

          {/* Mobile tab toggle */}
          {planData && (
            <div style={{ display: "flex", background: "#f8fafc", borderRadius: 10, padding: 3 }} className="md-hidden">
              {["chat", "plan"].map(t => (
                <button
                  key={t}
                  onClick={() => setMobileTab(t)}
                  style={{
                    border: "none", borderRadius: 8, padding: "6px 14px",
                    fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
                    background: mobileTab === t ? "#fff" : "transparent",
                    color: mobileTab === t ? "#0f172a" : "#64748b",
                    boxShadow: mobileTab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    transition: "all 0.15s",
                  }}
                >
                  {t === "chat" ? "💬 Chat" : "📋 Plan"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Main layout ── */}
      <div style={{ flex: 1, maxWidth: 1360, margin: "0 auto", width: "100%", padding: "0 24px", display: "flex", gap: 24, alignItems: "stretch" }}>

        {/* ─── LEFT: Chat panel ─── */}
        <div style={{
          width: 420, flexShrink: 0,
          display: "flex", flexDirection: "column",
          paddingTop: 24, paddingBottom: 24,
          position: "sticky", top: 60, height: "calc(100vh - 60px)",
        }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", paddingRight: 4, paddingBottom: 16, scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {messages.map(msg => (
                <MessageBubble key={msg.id} msg={msg} onQuickReply={handleQuickReply} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input box */}
          <div style={{ paddingTop: 12 }}>
            <form onSubmit={e => { e.preventDefault(); handleSend(); }}>
              <div style={{
                display: "flex", gap: 8, background: "#fff",
                borderRadius: 16, padding: 6,
                border: "1.5px solid rgba(124,58,237,0.15)",
                boxShadow: "0 2px 16px rgba(124,58,237,0.07)",
              }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={
                    chatStage === "waiting_event" ? "Describe your event..." :
                    chatStage === "ask_date"      ? "Enter event date or 'skip'..." :
                    chatStage === "ask_guests"    ? "How many guests?" :
                    chatStage === "ask_budget"    ? "Budget range or 'skip'..." :
                    "Ask me anything about your event..."
                  }
                  style={{
                    flex: 1, border: "none", outline: "none",
                    padding: "10px 12px", fontSize: "0.875rem",
                    background: "transparent", color: "#0f172a",
                    fontFamily: "inherit",
                  }}
                />
                <motion.button
                  type="submit"
                  whileHover={input.trim() ? { scale: 1.06 } : {}}
                  whileTap={input.trim() ? { scale: 0.94 } : {}}
                  disabled={!input.trim()}
                  style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: input.trim() ? "#e11d5c" : "#f1f5f9",
                    border: "none", cursor: input.trim() ? "pointer" : "default",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.2s",
                  }}
                >
                  <Send size={16} style={{ color: input.trim() ? "#fff" : "#94a3b8" }} />
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        {/* ─── RIGHT: Event plan panel ─── */}
        <div style={{ flex: 1, minWidth: 0, paddingTop: 24, paddingBottom: 40 }}>
          <AnimatePresence>
            {!planData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  height: "60vh", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", textAlign: "center",
                  color: "#94a3b8",
                }}
              >
                <div style={{ fontSize: "5rem", marginBottom: 16, lineHeight: 1 }}>🎉</div>
                <h2 style={{ margin: "0 0 8px", fontSize: "1.25rem", fontWeight: 800, color: "#cbd5e1" }}>
                  Your event plan will appear here
                </h2>
                <p style={{ margin: 0, fontSize: "0.9rem", maxWidth: 320, lineHeight: 1.6 }}>
                  Tell me what you're planning in the chat → I'll build a personalized checklist for you instantly.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 20 }}>
                  {["Wedding 💍", "Birthday 🎂", "Christening ⛪", "Baby Shower 🍼", "Corporate 🏢", "Kids Party 🎈"].map(e => (
                    <motion.button
                      key={e} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                      onClick={() => { pushUser(e); processInput(e); }}
                      style={{
                        background: "#fff", border: "1px solid #e2e8f0",
                        borderRadius: 100, padding: "8px 16px",
                        fontSize: "0.82rem", fontWeight: 600, color: "#475569",
                        cursor: "pointer",
                      }}
                    >
                      {e}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {planData && (
              <motion.div
                key="plan"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <EventPlanPanel
                  plan={planData}
                  type={eventType}
                  meta={meta}
                  checkedItems={checkedItems}
                  vendors={vendors}
                  onToggle={toggleItem}
                  onFindVendor={(section, item) => setVendorModal({ section, item })}
                  onRemoveVendor={removeVendor}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Vendor modal ── */}
      <AnimatePresence>
        {vendorModal && (
          <VendorSearchModal
            item={vendorModal.item}
            section={vendorModal.section}
            lang={lang}
            onAssign={assignVendor}
            onClose={() => setVendorModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
