import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => ({
    items,
    add(dish) {
      setItems(prev => {
        const idx = prev.findIndex(x => x.dish.id === dish.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
          return copy;
        }
        return [...prev, { dish, qty: 1 }];
      });
    },
    dec(dishId) {
      setItems(prev => {
        const idx = prev.findIndex(x => x.dish.id === dishId);
        if (idx < 0) return prev;
        const copy = [...prev];
        const nextQty = copy[idx].qty - 1;
        if (nextQty <= 0) copy.splice(idx, 1);
        else copy[idx] = { ...copy[idx], qty: nextQty };
        return copy;
      });
    },
    remove(dishId) {
      setItems(prev => prev.filter(x => x.dish.id !== dishId));
    },
    clear() { setItems([]); },
    total() {
      return items.reduce((sum, x) => sum + Number(x.dish.price_rub) * Number(x.qty), 0);
    },
    count() {
      return items.reduce((sum, x) => sum + Number(x.qty), 0);
    }
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
