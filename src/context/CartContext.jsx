// src/context/CartContext.jsx
import { createContext, useState } from 'react';

// Correct name and capitalization
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};
// src/pages/CartContext.jsx