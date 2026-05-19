import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompareStore {
  items: any[];
  addItem: (product: any) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) => set((state) => {
        if (state.items.find(i => i._id === product._id)) return state;
        if (state.items.length >= 4) return state; // Limit to 4 items
        return { items: [...state.items, product], isOpen: true };
      }),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(i => i._id !== productId)
      })),
      clear: () => set({ items: [] }),
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: 'kaleido-compare',
    }
  )
);
