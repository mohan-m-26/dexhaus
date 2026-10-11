import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string | number;
  title: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistStore {
  items: WishlistItem[];
  isOpen: boolean;
  toggleItem: (item: WishlistItem) => void;
  removeItem: (id: string | number) => void;
  isInWishlist: (id: string | number) => boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      toggleItem: (item) => {
        set((state) => {
          const exists = state.items.some((i) => i.id === item.id);
          if (exists) {
            return { items: state.items.filter((i) => i.id !== item.id) };
          }
          return { items: [...state.items, item] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },
      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id);
      },
      openWishlist: () => set({ isOpen: true }),
      closeWishlist: () => set({ isOpen: false }),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'dexhaus-wishlist',
    }
  )
);
