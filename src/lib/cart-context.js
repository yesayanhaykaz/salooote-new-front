"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [hydrated,  setHydrated]  = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("salooote_cart");
      if (stored) setCartItems(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  // Persist on every change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("salooote_cart", JSON.stringify(cartItems)); } catch {}
  }, [cartItems, hydrated]);

  // Add item — merges by product_id + variant
  const addToCart = (item) => {
    // item must have: product_id, vendor_id, name, price (number, AMD), qty (default 1)
    // optional: variant, image, vendor_name
    setCartItems(prev => {
      const key = (i) => `${i.product_id || i.id}_${i.variant || ""}`;
      const existing = prev.find(i => key(i) === key(item));
      if (existing) {
        return prev.map(i => key(i) === key(item) ? { ...i, qty: i.qty + (item.qty || 1) } : i);
      }
      return [...prev, { ...item, id: item.product_id || item.id || Date.now(), qty: item.qty || 1 }];
    });
  };

  const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i.id !== id && i.product_id !== id));

  const updateQuantity = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCartItems(prev => prev.map(i => (i.id === id || i.product_id === id) ? { ...i, qty } : i));
  };

  const clearCart = () => setCartItems([]);

  // Group items by vendor_id for multi-vendor checkout
  const itemsByVendor = cartItems.reduce((acc, item) => {
    const vid = item.vendor_id || "unknown";
    if (!acc[vid]) acc[vid] = { vendor_id: vid, vendor_name: item.vendor_name || item.vendor || "", items: [] };
    acc[vid].items.push(item);
    return acc;
  }, {});

  const cartTotal = cartItems.reduce((s, i) => s + (i.price || 0) * i.qty, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
      cartTotal, cartCount, itemsByVendor, hydrated,
    }}>
      {children}
    </CartContext.Provider>
  );
}

const CART_DEFAULTS = {
  cartItems: [], addToCart: () => {}, removeFromCart: () => {},
  updateQuantity: () => {}, clearCart: () => {},
  cartTotal: 0, cartCount: 0, itemsByVendor: {}, hydrated: false,
};

export function useCart() {
  const ctx = useContext(CartContext);
  return ctx || CART_DEFAULTS;
}
