import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; }
  });

  const addToCart = useCallback((product, qty = 1) => {
    setCart((prev) => {
      const exists = prev.find((i) => i._id === product._id);
      const updated = exists
        ? prev.map((i) => i._id === product._id ? { ...i, qty: i.qty + qty } : i)
        : [...prev, { ...product, qty }];
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i._id !== id);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) return;
    setCart((prev) => {
      const updated = prev.map((i) => i._id === id ? { ...i, qty } : i);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem('cart');
  }, []);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
