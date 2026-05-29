// Ingredients

export interface Ingredient {
  id: string;
  name: string;
}

// Meals

export type MealSlot = "breakfast" | "lunch" | "dinner";

export interface Meal {
  id: string;
  name: string;
  ingredientIds: string[]; // references Ingredient.id
  prepTime: number; // minutes
  slots: MealSlot[]; // which slots this meal is suitable for
  createdAt: string; // ISO date string
}

// Pantry

export interface PantryItem {
  ingredientId: string; // references Ingredient.id
  available: boolean;
}

// Planner

export interface PlannedMeal {
  id: string;
  date: string; // YYYY-MM-DD
  slot: MealSlot;
  mealId: string; // references Meal.id
}

// Root Store

export interface MiseStore {
  meals: Meal[];
  ingredients: Ingredient[];
  pantry: PantryItem[];
  plannedMeals: PlannedMeal[];
}
