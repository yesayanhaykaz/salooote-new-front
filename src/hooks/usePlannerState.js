"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { plannerAPI } from "@/lib/api";
import { applyActions, INITIAL_EVENT_STATE, EVENT_TEMPLATES } from "@/components/PlanPanel";
import { sendPlanMessage } from "@/services/assistantApi";

const STORAGE_KEY = "salooote_planner";
const AUTOSAVE_DELAY = 1500; // ms

function loadFromStorage() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * usePlannerState — manages full event planner state.
 *
 * Returns:
 *  eventState               — current PlanEventState
 *  setEventState(state)     — direct setter
 *  applyPlanActions(actions) — apply AI action array to state
 *  setEventType(type)       — load template for event type
 *  sessionId                — current saved session ID (null if not saved)
 *  isSaving                 — save in flight
 *  saveSession()            — manual save
 *  loadSession(id)          — load from backend
 *  messages                 — planner conversation history
 *  isLoading                — API call in flight
 *  vendorResults            — { [service_type]: vendors[] }
 *  sendPlannerMessage(text) — send message to /smart-assistant/plan-chat
 *  resetPlanner()           — clear everything
 */
export function usePlannerState({ lang = "en", userId = null } = {}) {
  const saved = loadFromStorage();

  const [eventState, setEventStateRaw] = useState(
    saved?.eventState ?? { ...INITIAL_EVENT_STATE }
  );
  const [sessionId, setSessionId] = useState(saved?.sessionId ?? null);
  const [messages, setMessages] = useState(saved?.messages ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [vendorResults, setVendorResults] = useState(saved?.vendorResults ?? {});

  const saveTimerRef = useRef(null);
  const langRef = useRef(lang);
  langRef.current = lang;

  // Persist to localStorage on every state change
  const persistLocal = useCallback((es, msgs, vr, sid) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        eventState: es,
        messages: msgs,
        vendorResults: vr,
        sessionId: sid,
      }));
    } catch {}
  }, []);

  const setEventState = useCallback((es) => {
    setEventStateRaw((prev) => {
      const next = typeof es === "function" ? es(prev) : es;
      persistLocal(next, messages, vendorResults, sessionId);
      return next;
    });
  }, [messages, vendorResults, sessionId, persistLocal]);

  // Debounced auto-save to backend (only when authenticated)
  useEffect(() => {
    if (!userId || !sessionId) return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveSession();
    }, AUTOSAVE_DELAY);
    return () => clearTimeout(saveTimerRef.current);
  }, [eventState]); // eslint-disable-line

  const applyPlanActions = useCallback((actions) => {
    setEventStateRaw((prev) => {
      const next = applyActions(prev, actions);
      persistLocal(next, messages, vendorResults, sessionId);
      return next;
    });
  }, [messages, vendorResults, sessionId, persistLocal]);

  const setEventType = useCallback((type) => {
    const template = EVENT_TEMPLATES[type];
    if (!template) return;
    applyPlanActions([{ type: "set_event_type", event_type: type }]);
  }, [applyPlanActions]);

  const saveSession = useCallback(async () => {
    if (!userId) return;
    setIsSaving(true);
    try {
      const payload = {
        event_type: eventState.event_type,
        event_date: eventState.date || null,
        guest_count: eventState.guest_count ? parseInt(eventState.guest_count) : null,
        currency: "AMD",
        location: eventState.city || "",
        event_data: eventState,
      };
      if (sessionId) {
        await plannerAPI.update(sessionId, payload);
      } else {
        const res = await plannerAPI.create({
          ...payload,
          title: eventState.event_type_label || eventState.event_type || "My Event",
          status: "active",
        });
        if (res?.id) {
          setSessionId(res.id);
          persistLocal(eventState, messages, vendorResults, res.id);
        }
      }
    } catch (err) {
      console.warn("[planner] save failed:", err);
    } finally {
      setIsSaving(false);
    }
  }, [userId, sessionId, eventState, messages, vendorResults, persistLocal]);

  const loadSession = useCallback(async (id) => {
    try {
      const session = await plannerAPI.getById(id);
      if (session?.event_data) {
        setEventStateRaw(session.event_data);
        setSessionId(id);
        persistLocal(session.event_data, messages, vendorResults, id);
      }
      return session;
    } catch (err) {
      console.warn("[planner] load failed:", err);
      return null;
    }
  }, [messages, vendorResults, persistLocal]);

  const sendPlannerMessage = useCallback(async (text) => {
    if (!text?.trim()) return;
    setIsLoading(true);

    const userMsg = { id: Date.now(), role: "user", content: text, text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    persistLocal(eventState, newMessages, vendorResults, sessionId);

    try {
      const history = messages.map((m) => ({
        role: m.role === "bot" ? "bot" : "user",
        content: m.content || m.text || "",
      }));

      const data = await sendPlanMessage({
        message: text,
        messages: history,
        eventState,
        lang: langRef.current,
      });

      const reply = data.reply || data.message || "";
      const newBlocks = data.blocks || [];
      const updatedState = data.updated_state;
      const newActions = data.actions || [];

      // Apply any state updates from the planner
      if (updatedState) {
        setEventStateRaw((prev) => {
          const merged = { ...prev, ...updatedState };
          persistLocal(merged, newMessages, vendorResults, sessionId);
          return merged;
        });
      } else if (newActions.length > 0) {
        applyPlanActions(newActions);
      }

      // Update vendor results from blocks
      if (newBlocks.length > 0) {
        setVendorResults((prev) => {
          const next = { ...prev };
          for (const b of newBlocks) {
            if (b.service_type && b.data) {
              next[b.service_type] = b.data;
            }
          }
          return next;
        });
      }

      const botMsg = {
        id: Date.now() + 1,
        role: "bot",
        content: reply,
        text: reply,
        blocks: newBlocks,
        actions: newActions,
        next_service: data.next_service,
      };

      setMessages((prev) => {
        const next = [...prev, botMsg];
        persistLocal(eventState, next, vendorResults, sessionId);
        return next;
      });

      return data;
    } catch (err) {
      console.warn("[planner] sendMessage failed:", err);
      const errMsg = {
        id: Date.now() + 1,
        role: "bot",
        content: "Something went wrong. Please try again.",
        text: "Something went wrong. Please try again.",
        isError: true,
      };
      setMessages((prev) => [...prev, errMsg]);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [messages, eventState, vendorResults, sessionId, applyPlanActions, persistLocal]);

  const resetPlanner = useCallback(() => {
    setEventStateRaw({ ...INITIAL_EVENT_STATE });
    setMessages([]);
    setVendorResults({});
    setSessionId(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    eventState,
    setEventState,
    applyPlanActions,
    setEventType,
    sessionId,
    isSaving,
    isLoading,
    messages,
    vendorResults,
    setVendorResults,
    sendPlannerMessage,
    saveSession,
    loadSession,
    resetPlanner,
  };
}
