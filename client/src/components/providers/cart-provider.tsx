"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Cart, CartLineItem } from "@/lib/types";

import { useAuth } from "./auth-provider";

const STORAGE_KEY = "trilokini-cart";

type CartContextValue = {
  cart: Cart;
  itemCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartLineItem, "id" | "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setCoupon: (code: string) => void;
  setIsGift: (value: boolean) => void;
  clearCart: () => void;
};

const emptyCart: Cart = {
  items: [],
  summary: { subtotal: 0, discount: 0, shipping: null, total: 0 },
};

function computeSummary(items: CartLineItem[], discount = 0): Cart["summary"] {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 200 : null;
  const total = subtotal - discount + (shipping ?? 0);
  return { subtotal, discount, shipping, total };
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const anonCartStr = localStorage.getItem(STORAGE_KEY);
      let anonCart = anonCartStr ? JSON.parse(anonCartStr) : null;
      
      const userKey = user ? `${STORAGE_KEY}-${user.id}` : STORAGE_KEY;
      const stored = localStorage.getItem(userKey);
      let parsed = stored ? JSON.parse(stored) : null;

      if (user && anonCart && anonCart.items && anonCart.items.length > 0) {
        if (parsed) {
          const newItems = [...parsed.items];
          for (const item of anonCart.items) {
             const existing = newItems.find((i: CartLineItem) => i.productId === item.productId && i.size === item.size);
             if (existing) {
               existing.quantity += item.quantity;
             } else {
               newItems.push(item);
             }
          }
          parsed.items = newItems;
          parsed.summary = computeSummary(newItems, parsed.summary.discount);
        } else {
          parsed = anonCart;
        }
        localStorage.setItem(userKey, JSON.stringify(parsed));
        localStorage.removeItem(STORAGE_KEY);
      }
      
      if (parsed) setCart(parsed);
      else setCart(emptyCart);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, [user?.id]);

  useEffect(() => {
    if (hydrated) {
      const userKey = user ? `${STORAGE_KEY}-${user.id}` : STORAGE_KEY;
      localStorage.setItem(userKey, JSON.stringify(cart));
    }
  }, [cart, hydrated, user?.id]);

  const addItem = useCallback((item: Omit<CartLineItem, "id" | "quantity"> & { quantity?: number }) => {
    setCart((prev) => {
      const existing = prev.items.find((i) => i.productId === item.productId && i.size === item.size);
      let items: CartLineItem[];
      if (existing) {
        items = prev.items.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i
        );
      } else {
        items = [...prev.items, { ...item, id: `cart-${Date.now()}`, quantity: item.quantity ?? 1 }];
      }
      return { ...prev, items, summary: computeSummary(items, prev.summary.discount) };
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((prev) => {
      const items = prev.items.filter((i) => i.id !== id);
      return { ...prev, items, summary: computeSummary(items, prev.summary.discount) };
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCart((prev) => {
      const items = prev.items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i));
      return { ...prev, items, summary: computeSummary(items, prev.summary.discount) };
    });
  }, []);

  const setCoupon = useCallback((code: string) => {
    setCart((prev) => {
      const discount = code.toUpperCase() === "TRILOKINI10" ? Math.round(prev.summary.subtotal * 0.1) : 0;
      return { ...prev, couponCode: code, summary: computeSummary(prev.items, discount) };
    });
  }, []);

  const setIsGift = useCallback((value: boolean) => {
    setCart((prev) => ({ ...prev, isGift: value }));
  }, []);

  const clearCart = useCallback(() => setCart(emptyCart), []);

  const value = useMemo(
    () => ({
      cart,
      itemCount: cart.items.reduce((s, i) => s + i.quantity, 0),
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      updateQuantity,
      setCoupon,
      setIsGift,
      clearCart,
    }),
    [cart, isOpen, addItem, removeItem, updateQuantity, setCoupon, setIsGift, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
