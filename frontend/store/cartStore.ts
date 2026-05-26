import { create } from 'zustand';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
}

const loadCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('ac_cart') || '[]');
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ac_cart', JSON.stringify(items));
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCart(),

  addItem: (item) => {
    const items = get().items;
    const existing = items.find((i) => i._id === item._id);
    let updated: CartItem[];
    if (existing) {
      updated = items.map((i) =>
        i._id === item._id
          ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
          : i
      );
    } else {
      updated = [...items, { ...item, quantity: 1 }];
    }
    saveCart(updated);
    set({ items: updated });
  },

  removeItem: (id) => {
    const updated = get().items.filter((i) => i._id !== id);
    saveCart(updated);
    set({ items: updated });
  },

  updateQty: (id, qty) => {
    const updated = get().items.map((i) =>
      i._id === id ? { ...i, quantity: Math.min(Math.max(1, qty), i.stock) } : i
    );
    saveCart(updated);
    set({ items: updated });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
