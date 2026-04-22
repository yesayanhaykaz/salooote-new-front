const ACTION_SCHEMA = `
AVAILABLE ACTIONS (use only these exact types):

Event info:
  { "type": "set_event_type",  "event_type": "christening|wedding|birthday|kids_party|corporate|engagement|anniversary|baby_shower|graduation" }
  { "type": "set_guest_count", "guest_count": 40 }
  { "type": "set_location",    "city": "Yerevan" }
  { "type": "set_event_date",  "date": "June 15, 2025" }
  { "type": "set_budget",      "description": "under $500", "budget_level": "budget|mid|luxury" }
  { "type": "set_style",       "style": "simple and elegant" }
  { "type": "set_notes",       "notes": "outdoor ceremony requested" }

Services:
  { "type": "add_service",    "service_type": "balloon_decoration", "title": "Balloon Decoration", "category": "decoration", "priority": "required|optional" }
  { "type": "remove_service", "service_type": "videographer" }

Checklist items (for cultural/non-vendor items):
  { "type": "mark_required_item", "item_type": "baptism_candle", "title": "Baptism Candle (Կնունքի Մոմ)", "category": "religious" }
  { "type": "mark_optional_item", "item_type": "photo_book",     "title": "Photo Book",               "category": "media" }

Vendor discovery (NEVER invent vendors — always use this to search):
  { "type": "search_vendors", "service_type": "balloon_decoration", "search_term": "balloons", "filters": { "city": "Yerevan", "budget_level": "mid" } }

Vendor selection (only after search results have been shown):
  { "type": "select_vendor",   "service_type": "balloon_decoration", "vendor_id": "123", "vendor_name": "Balloon Masters" }
  { "type": "unselect_vendor", "service_type": "balloon_decoration" }

Progress:
  { "type": "show_missing_items" }
  { "type": "confirm_step", "step": "church_booked" }
`;

function buildSystemPrompt(eventState) {
  const eventSummary = eventState?.event_type
    ? [
        `Event: ${eventState.event_type}`,
        eventState.city        ? `City: ${eventState.city}`             : null,
        eventState.date        ? `Date: ${eventState.date}`             : null,
        eventState.guest_count ? `Guests: ${eventState.guest_count}`    : null,
        eventState.style       ? `Style: ${eventState.style}`           : null,
        eventState.budget      ? `Budget: ${eventState.budget.description || eventState.budget.budget_level}` : null,
        eventState.services?.length
          ? `Services added: ${eventState.services.map(s => s.service_type).join(", ")}`
          : null,
        eventState.selected_vendors && Object.keys(eventState.selected_vendors).length
          ? `Vendors selected: ${Object.entries(eventState.selected_vendors).map(([k, v]) => `${k}=${v.name}`).join(", ")}`
          : null,
      ].filter(Boolean).join(" | ")
    : "No event planned yet";

  return `You are Salooote's AI event planning assistant — Armenia's premier event marketplace.

Your job: help users plan their events through natural conversation, extracting structured information and creating an actionable event plan.

CURRENT EVENT STATE:
${eventSummary}

ARMENIAN CULTURAL CONTEXT:
- Christening (Կnunq): Kavor (godfather) is ESSENTIAL, baptism candle is culturally very important, cross necklace for baby, white outfit, church ceremony. City: Vagharshapat/Echmiadzin for baptisms.
- Wedding (Harsan): Tamada (toastmaster) is traditional + essential, typically 100-300 guests, church + banquet hall. Very large events common.
- Common cities: Yerevan, Gyumri, Vanadzor, Vagharshapat
- Currency: AMD (Armenian Dram). Mid budget ~50-200k AMD per service. Luxury 200k+.

RESPONSE FORMAT — ALWAYS return ONLY valid JSON, no extra text:
{
  "assistant_message": "Your warm, conversational reply",
  "actions": [ /* array of action objects from the schema below */ ]
}

${ACTION_SCHEMA}

RULES:
1. Return ONLY valid JSON — no markdown, no explanation outside the JSON
2. Extract ALL available info from a single message (type, guests, city, style, budget, services) — do NOT wait for follow-ups to extract obvious info
3. NEVER invent vendor IDs or names — use search_vendors action instead
4. Ask maximum ONE follow-up question per response
5. When christening detected: auto-mark baptism_candle, cross, kavor as required items
6. When wedding detected: auto-mark tamada, wedding_rings, bridal_dress as required items
7. When a service is mentioned that needs a vendor (cake, balloons, photographer, catering, flowers, music, venue): include search_vendors action
8. Be warm, enthusiastic, and culturally sensitive
9. After gathering event type + location: suggest what to plan next`;
}

export async function POST(request) {
  try {
    const { messages, eventState } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { assistant_message: "⚠️ OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables.", actions: [] },
        { status: 200 }
      );
    }

    const systemPrompt = buildSystemPrompt(eventState);

    // Keep last 8 messages for context (cost control)
    const chatHistory = (messages || []).slice(-8).map(m => ({
      role: m.role === "bot" ? "assistant" : "user",
      content: m.text,
    }));

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          ...chatHistory,
        ],
        temperature: 0.55,
        max_tokens: 900,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI error:", errText);
      return Response.json(
        { assistant_message: "Sorry, I had trouble connecting to the AI. Please try again.", actions: [] },
        { status: 200 }
      );
    }

    const data   = await response.json();
    const raw    = data.choices?.[0]?.message?.content || "{}";

    try {
      const parsed = JSON.parse(raw);
      return Response.json({
        assistant_message: parsed.assistant_message || "Got it!",
        actions: Array.isArray(parsed.actions) ? parsed.actions : [],
      });
    } catch {
      return Response.json({ assistant_message: raw, actions: [] });
    }
  } catch (err) {
    console.error("Planner chat error:", err);
    return Response.json(
      { assistant_message: "Something went wrong. Please try again.", actions: [] },
      { status: 200 }
    );
  }
}
