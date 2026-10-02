import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from "../types/product";

export type CartItem = Product & {
  quantity: number;
};

type CartStore = {
  items: CartItem[];

  addItem: (product: Product, quantity?: number) => void;

  removeItem: (id: number) => void;

  increaseItem: (id: number) => void;

  decreaseItem: (id: number) => void;

  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, quantity = 1) =>
        set((state) => {
          const safeQuantity = Math.max(1, quantity);

          const existingItem = state.items.find(
            (item) => item.id === product.id,
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + safeQuantity,
                    }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...product,
                quantity: safeQuantity,
              },
            ],
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      increaseItem: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item,
          ),
        })),

      decreaseItem: (id) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                  }
                : item,
            )
            .filter((item) => item.quantity > 0),
        })),

      clearCart: () =>
        set({
          items: [],
        }),
    }),
    {
      name: "peptide-shop-cart",
    },
  ),
);
