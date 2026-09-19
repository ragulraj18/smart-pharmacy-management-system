import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isLoggedIn) {
      setCart({ items: [] });
      return;
    }
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data.cart);
    } catch (err) {
      // Cart API isn't built yet (Phase 6) — fail quietly so the rest of the site still works
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (medicineId, quantity = 1) => {
    const data = await cartService.addToCart(medicineId, quantity);
    setCart(data.cart);
  };

  const updateItem = async (medicineId, quantity) => {
    const data = await cartService.updateCartItem(medicineId, quantity);
    setCart(data.cart);
  };

  const removeItem = async (medicineId) => {
    const data = await cartService.removeFromCart(medicineId);
    setCart(data.cart);
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, itemCount, addItem, updateItem, removeItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);