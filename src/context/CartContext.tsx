import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Order } from '@/types/ramen';
import { useAuth } from '@/context/AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  orders: Order[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  addOrder: (order: Order) => void;
  getUserOrders: () => Order[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  const removeFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const toppingsPrice = item.selectedToppings.reduce((sum, t) => sum + t.price, 0);
      return total + (item.ramen.price + toppingsPrice) * item.quantity;
    }, 0);
  };

  const addOrder = (order: Order) => {
    // Save order to localStorage for persistence
    const userOrdersKey = `ramen-orders-${order.userId}`;
    const existingOrders = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
    const updatedOrders = [order, ...existingOrders];
    localStorage.setItem(userOrdersKey, JSON.stringify(updatedOrders));
    
    setOrders((prev) => [order, ...prev]);
  };

  const getUserOrders = (): Order[] => {
    // This will be called with userId from component
    return orders;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        orders,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalPrice,
        addOrder,
        getUserOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
