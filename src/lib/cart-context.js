"use client";
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Party Accessories — Fun Cake", variant: "Medium", price: 45.0, qty: 1, icon: "Cake" },
    { id: 2, name: "Beautiful Hanging Flower Set", variant: "Large", price: 65.0, qty: 2, icon: "Flower2" },
    { id: 3, name: "Cupcakes with Lovely Whipping", variant: "Small", price: 35.0, qty: 1, icon: "Cake" },
  ]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.variant === item.variant);
      if (existing) return prev.map((i) => i.id === item.id && i.variant === item.variant ? { ...i, qty: i.qty + (item.qty || 1) } : i);
      return [...prev, { ...item, id: Date.now(), qty: item.qty || 1 }];
    });
  };

  const removeFromCart = (id) => setCartItems((prev) => prev.filter((item) => item.id !== id));
  const updateQuantity = (id, qty) => { if (qty >= 1) setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item))); };
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
