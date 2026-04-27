export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Salooote.am",
    url: "https://development.salooote.am",
    logo: "https://development.salooote.am/images/logo.png",
    description: "Armenia's #1 event planning marketplace. 850+ verified vendors for weddings, birthdays, corporate events.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Yerevan",
      addressCountry: "AM",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["Armenian", "English", "Russian"],
    },
    sameAs: [
      "https://www.facebook.com/salooote",
      "https://www.instagram.com/salooote.am",
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteJsonLd({ lang = "en" }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Salooote.am",
    url: "https://development.salooote.am",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `https://development.salooote.am/${lang}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: [
      { "@type": "Language", name: "English", alternateName: "en" },
      { "@type": "Language", name: "Armenian", alternateName: "hy" },
      { "@type": "Language", name: "Russian", alternateName: "ru" },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Salooote.am",
    image: "https://development.salooote.am/images/hero-dj.jpg",
    url: "https://development.salooote.am",
    telephone: "+374-77-123-456",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Abovyan St",
      addressLocality: "Yerevan",
      postalCode: "0010",
      addressCountry: "AM",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.1792,
      longitude: 44.4991,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      opens: "09:00",
      closes: "21:00",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1247",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProductJsonLd({ product }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    image: product.image || "https://development.salooote.am/images/wedding-cake.jpg",
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: product.vendor || "Salooote.am",
      },
    },
    aggregateRating: product.rating ? {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews || 10,
    } : undefined,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `https://development.salooote.am${item.href}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
