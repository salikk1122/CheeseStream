'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WatchlistItem } from '@/types';

interface WatchlistState {
  items: WatchlistItem[];
  addItem: (item: Omit<WatchlistItem, 'addedAt'>) => void;
  removeItem: (id: number, type: 'movie' | 'tv') => void;
  toggleItem: (item: Omit<WatchlistItem, 'addedAt'>) => void;
  isInList: (id: number, type: 'movie' | 'tv') => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const exists = get().items.some(
          (i) => i.id === item.id && i.type === item.type
        );
        if (exists) return;
        set((state) => ({
          items: [{ ...item, addedAt: Date.now() }, ...state.items],
        }));
      },

      removeItem: (id, type) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && i.type === type)
          ),
        }));
      },

      toggleItem: (item) => {
        const exists = get().isInList(item.id, item.type);
        if (exists) {
          get().removeItem(item.id, item.type);
        } else {
          get().addItem(item);
        }
      },

      isInList: (id, type) =>
        get().items.some((i) => i.id === id && i.type === type),
    }),
    {
      name: 'cheesestream-watchlist',
    }
  )
);
