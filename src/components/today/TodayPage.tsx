"use client";

import { useState, useMemo, useCallback } from "react";
import { Lightbulb } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { Meal, MealSlot } from "@/lib/types";
import { getTodayString, getWeekDates } from "@/lib/utils";
import MealPickerModal from "@/components/planner/MealPickerModal";
import MealModal, { type MealPrefill } from "@/components/meals/MealModal";
import TodayMealCard from "./TodayMealCard";
import StatCard from "./StatCard";
import SuggestMealModal from "./SuggestMealModal";

const SLOTS: MealSlot[] = ["breakfast", "lunch", "dinner"];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning.";
  if (h < 17) return "Good afternoon.";
  return "Good evening.";
}

export default function TodayPage() {
  const { store, dispatch } = useStore();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSlot, setPickerSlot] = useState<MealSlot | null>(null);

  // AI suggestion + "add to library" modals
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [mealModalOpen, setMealModalOpen] = useState(false);
  const [mealPrefill, setMealPrefill] = useState<MealPrefill | undefined>(
    undefined,
  );

  const today = getTodayString();
  const weekDates = getWeekDates();

  const getMeal = useCallback(
    (slot: MealSlot): Meal | null => {
      const planned = store.plannedMeals.find(
        (pm) => pm.date === today && pm.slot === slot,
      );
      if (!planned) return null;
      return store.meals.find((m) => m.id === planned.mealId) ?? null;
    },
    [store.plannedMeals, store.meals, today],
  );

  const getMissingIngredients = useCallback(
    (meal: Meal): string[] =>
      meal.ingredientIds
        .filter(
          (id) => !store.pantry.find((p) => p.ingredientId === id)?.available,
        )
        .map((id) => store.ingredients.find((i) => i.id === id)?.name ?? "")
        .filter(Boolean),
    [store.pantry, store.ingredients],
  );

  const openPicker = (slot: MealSlot) => {
    setPickerSlot(slot);
    setPickerOpen(true);
  };

  const handleRemove = (slot: MealSlot) =>
    dispatch({ type: "UNPLAN_MEAL", payload: { date: today, slot } });

  const handleSelect = (mealId: string) => {
    if (!pickerSlot) return;
    dispatch({
      type: "PLAN_MEAL",
      payload: { date: today, slot: pickerSlot, mealId },
    });
  };

  // Suggestion → "add new meal to library" hands off to the existing MealModal.
  const handleAddNewFromSuggestion = (prefill: MealPrefill) => {
    setSuggestOpen(false);
    setMealPrefill(prefill);
    setMealModalOpen(true);
  };

  const closeMealModal = () => {
    setMealModalOpen(false);
    setMealPrefill(undefined);
  };

  // Suggest the first slot that isn't planned yet (fall back to breakfast).
  const defaultSuggestSlot: MealSlot =
    SLOTS.find((s) => getMeal(s) === null) ?? "breakfast";

  // Derived stats

  const plannedToday = SLOTS.filter((s) => getMeal(s) !== null).length;

  const weeklyPlanned = weekDates.reduce(
    (acc, date) =>
      acc +
      SLOTS.filter((slot) =>
        store.plannedMeals.some((pm) => pm.date === date && pm.slot === slot),
      ).length,
    0,
  );

  const pantryAvailable = store.ingredients.filter(
    (ing) => store.pantry.find((p) => p.ingredientId === ing.id)?.available,
  ).length;

  const shoppingCount = useMemo(() => {
    const mealIds = [
      ...new Set(
        store.plannedMeals
          .filter((pm) => weekDates.includes(pm.date))
          .map((pm) => pm.mealId),
      ),
    ];
    const meals = mealIds
      .map((id) => store.meals.find((m) => m.id === id))
      .filter(Boolean);
    const allIds = [...new Set(meals.flatMap((m) => m!.ingredientIds))];
    return allIds.filter(
      (id) => !store.pantry.find((p) => p.ingredientId === id)?.available,
    ).length;
  }, [store.plannedMeals, store.meals, store.pantry]);

  // Display values

  const dateDisplay = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const subtitle =
    plannedToday === 0
      ? "Plan before hunger decides for you."
      : plannedToday === 3
        ? "All three meals planned. You're set."
        : `${plannedToday} of 3 meals planned for today.`;

  const pantryDisplay =
    store.ingredients.length === 0
      ? "—"
      : `${pantryAvailable}/${store.ingredients.length}`;

  const currentMealId = pickerSlot ? getMeal(pickerSlot)?.id : undefined;

  return (
    <main
      className="flex-1 min-w-0 min-h-dvh px-[20px] md:px-[48px] py-[92px]
        lg:py-[40px] bg-green-600"
    >
      <div className="mb-[40px]">
        <p
          className="mb-[6px] tracking-[0.08em] text-[12px] uppercase font-semibold
            text-salmon-600"
        >
          Today
        </p>

        <h1
          className="leading-[1.15] text-[32px] md:text-[40px] lg:text-[44px] font-bold
            text-white"
        >
          {getGreeting()}
        </h1>

        <p className="mt-[6px] text-[16px] text-[var(--color-background)]">
          {dateDisplay}
        </p>

        <p
          className={`mt-[24px] text-[14px] text-[var(--color-background)]
            ${plannedToday === 3 ? "font-medium" : "font-normal"}
          `}
        >
          {subtitle}
        </p>

        {/* AI suggestion CTA — hidden once the day is fully planned */}
        {plannedToday < 3 && (
          <button
            type="button"
            onClick={() => setSuggestOpen(true)}
            className="select-none cursor-pointer inline-flex items-center gap-[7px]
              mt-[18px] rounded-[10px] px-[20px] py-[11px] bg-[var(--color-surface)]
              whitespace-nowrap text-[14px] font-semibold text-green-600
              transition-colors duration-150 hover:bg-[var(--color-border)]"
          >
            <Lightbulb size={15} strokeWidth={2.2} />
            Suggest a meal
          </button>
        )}
      </div>

      {/* Meal cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] mb-[40px]">
        {SLOTS.map((slot) => {
          const meal = getMeal(slot);
          return (
            <TodayMealCard
              key={slot}
              slot={slot}
              meal={meal}
              missingIngredients={meal ? getMissingIngredients(meal) : []}
              onOpen={() => openPicker(slot)}
              onRemove={() => handleRemove(slot)}
            />
          );
        })}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
        <StatCard
          value={`${weeklyPlanned}/21`}
          label="Meals planned this week"
          href="/planner"
        />

        <StatCard
          value={pantryDisplay}
          label="Ingredients stocked"
          href="/pantry"
        />

        <StatCard
          value={shoppingCount}
          label={shoppingCount === 1 ? "Item to buy" : "Items to buy"}
          href="/shopping"
        />
      </div>

      {/* Picker modal */}
      <MealPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        date={today}
        slot={pickerSlot}
        currentMealId={currentMealId}
        onSelect={handleSelect}
      />

      {/* AI suggestion modal */}
      <SuggestMealModal
        isOpen={suggestOpen}
        onClose={() => setSuggestOpen(false)}
        defaultSlot={defaultSuggestSlot}
        onAddNew={handleAddNewFromSuggestion}
      />

      {/* Add-to-library modal (reused for AI-suggested new meals) */}
      <MealModal
        isOpen={mealModalOpen}
        onClose={closeMealModal}
        prefill={mealPrefill}
      />
    </main>
  );
}
