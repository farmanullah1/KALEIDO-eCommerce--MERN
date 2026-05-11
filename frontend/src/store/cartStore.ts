import { create } from 'zustand';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

interface CartItem {
  _id: string;
  product: any;
  quantity: number;
  price: number;
}

interface CartState {
  cart: any | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyPromo: (code: string) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/cart');
      set({ cart: data.data });
    } catch (error) {
      console.error('Failed to fetch cart');
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const { data } = await api.post('/cart', { productId, quantity });
      set({ cart: data.data });
      toast.success('Artifact added to collection');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add item');
    }
  },

  updateQuantity: async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      const { data } = await api.put(`/cart/${itemId}`, { quantity });
      set({ cart: data.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    }
  },

  removeItem: async (itemId) => {
    try {
      const { data } = await api.delete(`/cart/${itemId}`);
      set({ cart: data.data });
      toast.success('Artifact removed from collection');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    }
  },

  applyPromo: async (code) => {
    try {
      const { data } = await api.post('/cart/promo', { code });
      set({ cart: data.data });
      toast.success('Promo ritual successful');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid promo code');
    }
  },

  clearCart: () => set({ cart: null }),
}));
