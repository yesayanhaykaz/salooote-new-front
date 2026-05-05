"use client";

import { useState, useCallback, useRef } from "react";
import { sendShoppingMessage } from "@/services/assistantApi";

const STORAGE_KEY = "salooote_assistant_session";

const INITIAL_STATE = {
  event_type: "",
  recipient: "",
  age: null,
  deadline: "",
  city: "",
  style: "",
  budget: "",
  selected_items: [],
  workflow: "",
  rejected_items: [],
  selected_products: [],
  selected_vendors: [],
  selected_venues: [],
  last_search_query: "",
  last_search_type: "",
  gift_delivery: null,
};

function loadFromStorage() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(messages, state) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, state }));
  } catch {}
}

/**
 * useAssistantSession — manages the shopping assistant (Sali) conversation.
 *
 * Returns:
 *  messages[]        — chat message array { id, role, text, blocks? }
 *  assistantState    — current SmartChatState (persisted)
 *  isLoading         — API call in flight
 *  error             — last error string
 *  blocks            — last search result blocks from backend
 *  lastResponse      — full last response from backend
 *  sendMessage(text) — sends a user message, updates state
 *  addMessage(msg)   — manually append a message (e.g. bot welcome)
 *  rejectItem(id)    — adds id to rejected_items in state
 *  selectProduct(id) — adds id to selected_products
 *  resetSession()    — clears everything
 */
export function useAssistantSession({ lang = "en", initialState = null } = {}) {
  const saved = loadFromStorage();

  const [messages, setMessages] = useState(
    saved?.messages ?? []
  );
  const [assistantState, setAssistantState] = useState(
    initialState ?? saved?.state ?? INITIAL_STATE
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [lastResponse, setLastResponse] = useState(null);

  // Track current lang (may drift over conversation)
  const langRef = useRef(lang);
  langRef.current = lang;

  const addMessage = useCallback((msg) => {
    setMessages((prev) => {
      const next = [...prev, msg];
      saveToStorage(next, assistantState);
      return next;
    });
  }, [assistantState]);

  const sendMessage = useCallback(async (text) => {
    if (!text?.trim()) return;
    setError(null);
    setIsLoading(true);

    const userMsg = {
      id: Date.now(),
      role: "user",
      content: text,
      text,
    };

    setMessages((prev) => {
      const next = [...prev, userMsg];
      saveToStorage(next, assistantState);
      return next;
    });

    try {
      // Build conversation history for backend (role: user/bot)
      const history = messages.map((m) => ({
        role: m.role === "bot" || m.role === "assistant" ? "bot" : "user",
        content: m.content || m.text || "",
      }));
      history.push({ role: "user", content: text });

      const data = await sendShoppingMessage({
        messages: history,
        state: assistantState,
        lang: langRef.current,
      });

      setLastResponse(data);

      const reply = data.reply || data.message || "";
      const newBlocks = data.blocks || [];
      const newState = data.state || assistantState;

      setBlocks(newBlocks);
      setAssistantState(newState);

      const botMsg = {
        id: Date.now() + 1,
        role: "bot",
        content: reply,
        text: reply,
        blocks: newBlocks,
        intent: data.intent,
        action: data.action,
        redirect: data.redirect,
        suggested_event_type: data.suggested_event_type,
        page_link: data.page_link,
        gift_delivery: data.gift_delivery,
      };

      setMessages((prev) => {
        const next = [...prev, botMsg];
        saveToStorage(next, newState);
        return next;
      });

      return data;
    } catch (err) {
      setError(err.message || "Something went wrong");
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
  }, [messages, assistantState]);

  const rejectItem = useCallback((itemId) => {
    setAssistantState((prev) => {
      const rejected = prev.rejected_items || [];
      if (rejected.includes(itemId)) return prev;
      const next = { ...prev, rejected_items: [...rejected, itemId] };
      saveToStorage(messages, next);
      return next;
    });
  }, [messages]);

  const selectProduct = useCallback((productId) => {
    setAssistantState((prev) => {
      const selected = prev.selected_products || [];
      if (selected.includes(productId)) return prev;
      const next = { ...prev, selected_products: [...selected, productId] };
      saveToStorage(messages, next);
      return next;
    });
  }, [messages]);

  const resetSession = useCallback(() => {
    setMessages([]);
    setAssistantState(INITIAL_STATE);
    setBlocks([]);
    setLastResponse(null);
    setError(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    messages,
    assistantState,
    isLoading,
    error,
    blocks,
    lastResponse,
    sendMessage,
    addMessage,
    rejectItem,
    selectProduct,
    resetSession,
  };
}
