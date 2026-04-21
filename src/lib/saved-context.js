"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { userAPI, isLoggedIn } from "@/lib/api";

const SavedContext = createContext();

export function SavedProvider({ children }) {
  // Map of target_id → saved record { id, target_type, target_id }
  const [savedMap, setSavedMap] = useState({});
  const [hydrated, setHydrated] = useState(false);

  // Load saved items on mount (only if logged in)
  useEffect(() => {
    if (!isLoggedIn()) { setHydrated(true); return; }
    userAPI.saved({ limit: 200 })
      .then(res => {
        const items = res?.data || [];
        const map = {};
        items.forEach(item => { if (item.target_id) map[item.target_id] = item; });
        setSavedMap(map);
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, []);

  const isSaved = useCallback((targetId) => !!savedMap[targetId], [savedMap]);

  const saveItem = useCallback(async (targetType, targetId) => {
    if (!isLoggedIn()) return false;
    try {
      const res = await userAPI.saveItem(targetType, targetId);
      const item = res?.data || res;
      if (item?.id) {
        setSavedMap(prev => ({ ...prev, [targetId]: item }));
        return true;
      }
    } catch {}
    return false;
  }, []);

  const unsaveItem = useCallback(async (targetId) => {
    const record = savedMap[targetId];
    if (!record) return false;
    try {
      await userAPI.unsaveItem(record.id);
      setSavedMap(prev => {
        const next = { ...prev };
        delete next[targetId];
        return next;
      });
      return true;
    } catch {}
    return false;
  }, [savedMap]);

  const toggleSave = useCallback(async (targetType, targetId) => {
    if (isSaved(targetId)) return unsaveItem(targetId);
    return saveItem(targetType, targetId);
  }, [isSaved, saveItem, unsaveItem]);

  return (
    <SavedContext.Provider value={{ isSaved, saveItem, unsaveItem, toggleSave, savedMap, hydrated }}>
      {children}
    </SavedContext.Provider>
  );
}

const SAVED_DEFAULTS = {
  isSaved: () => false, saveItem: async () => false,
  unsaveItem: async () => false, toggleSave: async () => false,
  savedMap: {}, hydrated: false,
};

export function useSaved() {
  const ctx = useContext(SavedContext);
  return ctx || SAVED_DEFAULTS;
}
