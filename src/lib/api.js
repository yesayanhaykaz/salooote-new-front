const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
}

// Prevent multiple simultaneous refresh calls
let refreshPromise = null;

async function tryRefreshToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    // Response shape: {success, data: {access_token, refresh_token}} OR {success, data: {access_token}} at top level
    const access = data?.data?.access_token ?? data?.access_token;
    const refresh = data?.data?.refresh_token ?? data?.refresh_token;
    if (!access) return false;
    localStorage.setItem("access_token", access);
    if (refresh) localStorage.setItem("refresh_token", refresh);
    return true;
  } catch {
    return false;
  }
}

async function request(path, options = {}, _retry = false) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    next: options.next,
  });

  // Auto-refresh on 401 (expired token), then retry once
  if (res.status === 401 && !_retry) {
    if (!refreshPromise) {
      refreshPromise = tryRefreshToken().finally(() => { refreshPromise = null; });
    }
    const refreshed = await refreshPromise;
    if (refreshed) {
      return request(path, options, true); // retry with new token
    }
    // Refresh failed — clear auth so UI shows logged out
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }

  if (res.status === 204) return null;
  return res.json();
}

// ── Auth helpers ─────────────────────────────────────────────────────────────
export function saveTokens(access, refresh) {
  if (typeof window === "undefined") return;
  localStorage.setItem("access_token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
}

export function saveUser(user) {
  if (typeof window === "undefined") return;
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUser() {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
}

export function isLoggedIn() {
  return !!getToken();
}

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (data) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  me: () => request("/auth/me"),
  logout: () => request("/auth/logout", { method: "POST" }).catch(() => null),
  forgotPassword: (email) =>
    request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (token, password) =>
    request("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) }),
};

// ── User API ──────────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => request("/user/profile"),
  updateProfile: (data) => request("/user/profile", { method: "PUT", body: JSON.stringify(data) }),
  changePassword: (data) => request("/user/password", { method: "PUT", body: JSON.stringify(data) }),
  orders: (params = {}) => { const q = new URLSearchParams(params).toString(); return request(`/user/orders${q ? "?" + q : ""}`); },
  createOrder: (data) => request("/user/orders", { method: "POST", body: JSON.stringify(data) }),
  inquiries: (params = {}) => { const q = new URLSearchParams(params).toString(); return request(`/user/inquiries${q ? "?" + q : ""}`); },
  createInquiry: (data) => request("/user/inquiries", { method: "POST", body: JSON.stringify(data) }),
  reviews: (params = {}) => { const q = new URLSearchParams(params).toString(); return request(`/user/reviews${q ? "?" + q : ""}`); },
  createReview: (data) => request("/user/reviews", { method: "POST", body: JSON.stringify(data) }),
  saved: (params = {}) => { const q = new URLSearchParams(params).toString(); return request(`/user/saved${q ? "?" + q : ""}`); },
  saveItem: (target_type, target_id) => request("/user/saved", { method: "POST", body: JSON.stringify({ target_type, target_id }) }),
  unsaveItem: (id) => request(`/user/saved/${id}`, { method: "DELETE" }),
  notifications: (params = {}) => { const q = new URLSearchParams(params).toString(); return request(`/user/notifications${q ? "?" + q : ""}`); },
  markNotifRead: (id) => request(`/user/notifications/${id}/read`, { method: "PATCH" }),
  markAllNotifsRead: () => request("/user/notifications/read-all", { method: "POST" }),
};

// Public - Categories
export const categoriesAPI = {
  list: (locale = "en") =>
    request(`/categories?locale=${locale}`),
  getBySlug: (slug, locale = "en") =>
    request(`/categories/${slug}?locale=${locale}`),
  getFilters: (slug, locale = "en") =>
    request(`/categories/${slug}/filters?locale=${locale}`),
};

// Public - Products
export const productsAPI = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/products${q ? "?" + q : ""}`);
  },
  getById: (id, locale = "en") =>
    request(`/products/${id}?locale=${locale}`),
  getBySlug: (vendorId, slug) =>
    request(`/products/by-slug?vendor_id=${vendorId}&slug=${slug}`),
};

// Public - Vendors
export const vendorsAPI = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/vendors${q ? "?" + q : ""}`);
  },
  getBySlug: (slug) => request(`/vendors/slug/${slug}`),
  getById: (id) => request(`/vendors/${id}`),
};

// User — Planner sessions
export const plannerAPI = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/user/planner/sessions${q ? "?" + q : ""}`);
  },
  getById: (id) => request(`/user/planner/sessions/${id}`),
  create: (data) =>
    request("/user/planner/sessions", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/user/planner/sessions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) =>
    request(`/user/planner/sessions/${id}`, { method: "DELETE" }),
  getInquiries: (sessionId) =>
    request(`/user/planner/sessions/${sessionId}/inquiries`),
};

// User — Inquiries + messaging
export const inquiriesAPI = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/user/inquiries${q ? "?" + q : ""}`);
  },
  create: (data) =>
    request("/user/inquiries", { method: "POST", body: JSON.stringify(data) }),
  getMessages: (inquiryId) =>
    request(`/user/inquiries/${inquiryId}/messages`),
  sendMessage: (inquiryId, body) =>
    request(`/user/inquiries/${inquiryId}/messages`, { method: "POST", body: JSON.stringify({ body }) }),
};
