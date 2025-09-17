import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { CartItem, Product, Organization } from 'packages/core/src/types';

interface CartContextType {
  cartItems: CartItem[];
  cartSupplierInfo: { id: string; name: string } | null;
  addToCart: (product: Product, quantity: number, supplier: Organization) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSupplierInfo, setCartSupplierInfo] = useState<{ id: string; name: string } | null>(null);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    const storedSupplierInfo = localStorage.getItem('cartSupplierInfo');
    if (storedCartItems) setCartItems(JSON.parse(storedCartItems));
    if (storedSupplierInfo) setCartSupplierInfo(JSON.parse(storedSupplierInfo));
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('cartSupplierInfo', JSON.stringify(cartSupplierInfo));
  }, [cartItems, cartSupplierInfo]);

  const addToCart = (product: Product, quantity: number, supplier: Organization) => {
    // Logic can remain largely the same, but simplified for brevity
    if (cartSupplierInfo && cartSupplierInfo.id !== supplier.id) {
        if (window.confirm(`Clear cart with items from ${cartSupplierInfo.name}?`)) {
            clearCart();
        } else {
            return;
        }
    }
    setCartSupplierInfo({id: supplier.id, name: supplier.name});
    setCartItems(prev => [...prev, {productId: product.id, title: product.title, price: product.price || 0, quantity, supplierId: supplier.id, supplierName: supplier.name}]);
  };
  const updateItemQuantity = (productId: string, quantity: number) => {
    setCartItems(prev => prev.map(item => item.productId === productId ? {...item, quantity} : item).filter(item => item.quantity > 0));
  };
  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };
  const clearCart = () => {
    setCartItems([]);
    setCartSupplierInfo(null);
  };
  const getCartTotal = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const getCartItemCount = () => cartItems.reduce((count, item) => count + item.quantity, 0);


  return (
    <CartContext.Provider value={{ 
        cartItems, cartSupplierInfo, addToCart, updateItemQuantity, removeFromCart, clearCart, getCartTotal, getCartItemCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
