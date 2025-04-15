import { create } from "zustand";

interface FilterState {
  brandId?: string;
  flavorId?: string;
  puffsId?: string;
  nicotineId?: string;
  setFilters: (newFilters: Partial<FilterState>) => void;
  clearFilters: () => void;
}

export const useFilter = create<FilterState>((set) => ({
  brandId: undefined,
  flavorId: undefined,
  puffsId: undefined,
  nicotineId: undefined,

  setFilters: (newFilters) => set((state) => ({ ...state, ...newFilters })),

  clearFilters: () =>
    set({
      brandId: undefined,
      flavorId: undefined,
      puffsId: undefined,
      nicotineId: undefined,
    }),
}));
