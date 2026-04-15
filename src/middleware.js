import { NextResponse } from "next/server";

const LOCALES = ["en", "hy", "ru"];
const DEFAULT_LOCALE = "en";

function getLocale(request) {
  // 1. Check cookie
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && LOCALES.includes(cookieLocale)) return cookieLocale;

  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get("accept-language") || "";
  const preferred = acceptLanguage
    .split(",")
    .map((s) => s.split(";")[0].trim().split("-")[0])
    .find((lang) => LOCALES.includes(lang));

  return preferred || DEFAULT_LOCALE;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Check if path already has a locale
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect to locale path
  const locale = getLocale(request);

  // When behind a reverse proxy (nginx etc.), request.url contains the
  // internal address (localhost:3001). Use forwarded headers to get the
  // real public-facing origin instead.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const host = forwardedHost || request.headers.get("host") || request.nextUrl.host;
  const proto = forwardedProto || (request.nextUrl.protocol.replace(":", "")) || "https";

  const redirectUrl = new URL(`/${locale}${pathname}`, `${proto}://${host}`);
  redirectUrl.search = request.nextUrl.search;

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|favicon|images|.*\\..*).*)"],
};
