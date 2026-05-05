/**
 * Centralized API client for all Sali AI assistant endpoints.
 * Used by useAssistantSession, usePlannerState, and direct calls.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status}: ${text}`);
  }
  const json = await res.json();
  return json?.data ?? json;
}

/**
 * Classify user intent before routing.
 * POST /intent
 * @returns {Promise<{language, is_latin_armenian, primary_intent, secondary_intents, confidence, suggested_event_type, reason}>}
 */
export async function classifyIntent({ message, lang = "en" }) {
  return post("/intent", { message, lang });
}

/**
 * Sali shopping assistant — searches products/vendors/venues.
 * POST /smart-assistant/chat
 * @returns {Promise<{reply, message, blocks, state, intent, action, redirect?, suggested_event_type?, gift_delivery?}>}
 */
export async function sendShoppingMessage({ messages, state = {}, lang = "en" }) {
  return post("/smart-assistant/chat", { messages, state, lang });
}

/**
 * Event planner chat — structured checklist actions + natural reply.
 * POST /smart-assistant/plan-chat
 * @returns {Promise<{reply, message, actions, blocks, updated_state, next_service}>}
 */
export async function sendPlanMessage({ message, messages = [], eventState = {}, lang = "en" }) {
  return post("/smart-assistant/plan-chat", {
    message,
    messages,
    event_state: eventState,
    lang,
  });
}

/**
 * Legacy planner chat (v1 format).
 * POST /planner/chat
 */
export async function sendLegacyPlanMessage({ messages, eventState = {}, lang = "en" }) {
  return post("/planner/chat", { messages, event_state: eventState, lang });
}
