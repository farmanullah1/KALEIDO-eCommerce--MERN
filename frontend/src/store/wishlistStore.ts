import { create } from 'zustand';
import { getWishlist, toggleWishlist } from '../api/wishlist.api.js';

interface WishlistState {
  wishlist: any[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const response = await getWishlist();
      set({ wishlist: response.data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
      set({ isLoading: false });
    }
  },

  toggleItem: async (productId: string) => {
    try {
      const response = await toggleWishlist(productId);
      set({ wishlist: response.data });
    } catch (error) {
      console.error('Failed to toggle wishlist', error);
    }
  },

  isInWishlist: (productId: string) => {
    return get().wishlist.some((item: any) => 
      (typeof item === 'string' ? item : item._id) === productId
    );
  }
}));
