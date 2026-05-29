import { MiseStore } from './types';

const STORAGE_KEY = 'mise_store';

export const defaultStore: MiseStore = {
  meals: [],
  ingredients: [],
  pantry: [],
  plannedMeals: [],
};

export function loadStore(): MiseStore {
  if (typeof window === 'undefined') return defaultStore;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStore;
    return JSON.parse(raw) as MiseStore;
  } catch {
    return defaultStore;
  }
}

export function saveStore(store: MiseStore): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    console.error('Mise: failed to persist store to localStorage');
  }
}
