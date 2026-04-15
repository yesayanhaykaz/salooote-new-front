"use client";
import { createContext, useContext } from "react";

const DictionaryContext = createContext({});

export function DictionaryProvider({ dict, lang, children }) {
  return (
    <DictionaryContext.Provider value={{ dict, lang }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  return useContext(DictionaryContext);
}
