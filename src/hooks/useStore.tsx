"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import {
  MiseStore,
  Meal,
  Ingredient,
  PantryItem,
  PlannedMeal,
} from "@/lib/types";
import { loadStore, saveStore, defaultStore } from "@/lib/storage";
import { generateId, getTodayString } from "@/lib/utils";

// Action Types

type Action =
  // Meals
  | { type: "ADD_MEAL"; payload: Omit<Meal, "id" | "createdAt"> }
  | { type: "UPDATE_MEAL"; payload: Meal }
  | { type: "DELETE_MEAL"; payload: string }
  // Ingredients
  | { type: "ADD_INGREDIENT"; payload: Ingredient }
  | { type: "DELETE_INGREDIENT"; payload: string }
  // Pantry
  | {
      type: "SET_PANTRY_ITEM";
      payload: { ingredientId: string; available: boolean };
    }
  // Planner
  | { type: "PLAN_MEAL"; payload: Omit<PlannedMeal, "id"> }
  | {
      type: "UNPLAN_MEAL";
      payload: { date: string; slot: PlannedMeal["slot"] };
    }
  // Hydrate from localStorage
  | { type: "HYDRATE"; payload: MiseStore };

// Reducer

function reducer(state: MiseStore, action: Action): MiseStore {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;

    // Meals
    case "ADD_MEAL":
      return {
        ...state,
        meals: [
          ...state.meals,
          { ...action.payload, id: generateId(), createdAt: getTodayString() },
        ],
      };
    case "UPDATE_MEAL":
      return {
        ...state,
        meals: state.meals.map((m) =>
          m.id === action.payload.id ? action.payload : m,
        ),
      };
    case "DELETE_MEAL":
      return {
        ...state,
        meals: state.meals.filter((m) => m.id !== action.payload),
        plannedMeals: state.plannedMeals.filter(
          (pm) => pm.mealId !== action.payload,
        ),
      };

    // Ingredients
    case "ADD_INGREDIENT": {
      const exists = state.ingredients.some(
        (i) => i.name.toLowerCase() === action.payload.name.toLowerCase(),
      );
      if (exists) return state;
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload],
      };
    }
    case "DELETE_INGREDIENT":
      return {
        ...state,
        ingredients: state.ingredients.filter((i) => i.id !== action.payload),
        pantry: state.pantry.filter((p) => p.ingredientId !== action.payload),
        meals: state.meals.map((m) => ({
          ...m,
          ingredientIds: m.ingredientIds.filter((id) => id !== action.payload),
        })),
      };

    // Pantry
    case "SET_PANTRY_ITEM": {
      const exists = state.pantry.some(
        (p) => p.ingredientId === action.payload.ingredientId,
      );
      if (exists) {
        return {
          ...state,
          pantry: state.pantry.map((p) =>
            p.ingredientId === action.payload.ingredientId
              ? { ...p, available: action.payload.available }
              : p,
          ),
        };
      }
      return {
        ...state,
        pantry: [...state.pantry, action.payload],
      };
    }

    // Planner
    case "PLAN_MEAL": {
      // Replace any existing meal in that slot on that date
      const filtered = state.plannedMeals.filter(
        (pm) =>
          !(pm.date === action.payload.date && pm.slot === action.payload.slot),
      );
      return {
        ...state,
        plannedMeals: [...filtered, { ...action.payload, id: generateId() }],
      };
    }
    case "UNPLAN_MEAL":
      return {
        ...state,
        plannedMeals: state.plannedMeals.filter(
          (pm) =>
            !(
              pm.date === action.payload.date && pm.slot === action.payload.slot
            ),
        ),
      };

    default:
      return state;
  }
}

// Context

interface StoreContextValue {
  store: MiseStore;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

// Provider

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, dispatch] = useReducer(reducer, defaultStore);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const persisted = loadStore();
    dispatch({ type: "HYDRATE", payload: persisted });
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    saveStore(store);
  }, [store]);

  return (
    <StoreContext.Provider value={{ store, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

// Hook

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}
