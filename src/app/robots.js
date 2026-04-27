export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/"],
      },
    ],
    sitemap: "https://development.salooote.am/sitemap.xml",
    host: "https://development.salooote.am",
  };
}
