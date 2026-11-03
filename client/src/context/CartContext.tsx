import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string;
    priceCents: number;
    currency: string;
    imageUrls: string[];
    stock?: number;
  };
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (product: any, quantity?: number) => Promise<void>;
  updateQuantity: (itemIdOrProductId: string, quantity: number) => Promise<void>;
  removeItem: (itemIdOrProductId: string) => Promise<void>;
  clearCart: () => void;
  subtotalCents: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  isCartOpen: false,
  setIsCartOpen: () => {},
  addItem: async () => {},
  updateQuantity: async () => {},
  removeItem: async () => {},
  clearCart: () => {},
  subtotalCents: 0,
  itemCount: 0,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('glownest_guest_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync or fetch cart when auth state changes
  useEffect(() => {
    const fetchServerCart = async () => {
      if (user) {
        try {
          const guestItems = JSON.parse(localStorage.getItem('glownest_guest_cart') || '[]');
          if (guestItems.length > 0) {
            // Merge guest cart to server
            await api.post('/cart/merge', {
              items: guestItems.map((i: any) => ({
                productId: i.productId,
                quantity: i.quantity,
              })),
            });
            localStorage.removeItem('glownest_guest_cart');
          }
          const res = await api.get('/cart');
          if (res.data.success) {
            setItems(res.data.data.items);
          }
        } catch (err) {
          console.error('Failed to sync cart:', err);
        }
      } else {
        const saved = localStorage.getItem('glownest_guest_cart');
        setItems(saved ? JSON.parse(saved) : []);
      }
    };

    fetchServerCart();
  }, [user]);

  // Persist guest cart to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('glownest_guest_cart', JSON.stringify(items));
    }
  }, [items, user]);

  const addItem = async (product: any, quantity = 1) => {
    let images: string[] = [];
    if (Array.isArray(product.imageUrls)) {
      images = product.imageUrls;
    } else if (typeof product.imageUrls === 'string') {
      try {
        images = JSON.parse(product.imageUrls);
      } catch {
        images = [product.imageUrls];
      }
    }

    if (user) {
      try {
        const res = await api.post('/cart/items', { productId: product.id, quantity });
        if (res.data.success) {
          setItems(res.data.data.items);
          setIsCartOpen(true);
        }
      } catch (err) {
        console.error('Error adding item to cart:', err);
      }
    } else {
      setItems((prev) => {
        const existingIdx = prev.findIndex((i) => i.productId === product.id);
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx].quantity += quantity;
          return updated;
        } else {
          return [
            ...prev,
            {
              id: `guest_${product.id}`,
              productId: product.id,
              quantity,
              product: {
                id: product.id,
                name: product.name,
                slug: product.slug,
                brand: product.brand || 'GlowNest Lab',
                priceCents: product.priceCents,
                currency: product.currency || 'INR',
                imageUrls: images,
                stock: product.stock,
              },
            },
          ];
        }
      });
      setIsCartOpen(true);
    }
  };

  const updateQuantity = async (identifier: string, quantity: number) => {
    if (user) {
      try {
        const item = items.find((i) => i.id === identifier || i.productId === identifier);
        if (item) {
          const res = await api.patch(`/cart/items/${item.id}`, { quantity });
          if (res.data.success) {
            setItems(res.data.data.items);
          }
        }
      } catch (err) {
        console.error('Failed to update cart quantity:', err);
      }
    } else {
      setItems((prev) => {
        if (quantity <= 0) {
          return prev.filter((i) => i.id !== identifier && i.productId !== identifier);
        }
        return prev.map((i) =>
          i.id === identifier || i.productId === identifier ? { ...i, quantity } : i
        );
      });
    }
  };

  const removeItem = async (identifier: string) => {
    return updateQuantity(identifier, 0);
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('glownest_guest_cart');
  };

  const subtotalCents = items.reduce(
    (acc, curr) => acc + curr.product.priceCents * curr.quantity,
    0
  );

  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        subtotalCents,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

