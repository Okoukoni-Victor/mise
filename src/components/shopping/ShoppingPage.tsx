"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { ClipboardCopy, Check } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { Ingredient } from "@/lib/types";
import { getWeekDates } from "@/lib/utils";
import EmptyShoppingList from "./EmptyShoppingList";
import AllStockedState from "./AllStockedState";
import ShoppingRow from "./ShoppingRow";

interface ShoppingItem {
  ingredient: Ingredient;
  usedInMeals: string[];
}

export default function ShoppingPage() {
  const { store } = useStore();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  // Derive shopping list from current week's plan minus pantry
  const { shoppingItems, plannedMealCount } = useMemo(() => {
    const weekDates = getWeekDates();
    const plannedThisWeek = store.plannedMeals.filter((pm) =>
      weekDates.includes(pm.date),
    );
    const mealIds = [...new Set(plannedThisWeek.map((pm) => pm.mealId))];
    const meals = mealIds
      .map((id) => store.meals.find((m) => m.id === id))
      .filter(Boolean);
    const allIngredientIds = [
      ...new Set(meals.flatMap((m) => m!.ingredientIds)),
    ];

    const neededIds = allIngredientIds.filter((id) => {
      const p = store.pantry.find((p) => p.ingredientId === id);
      return !p?.available;
    });

    const items: ShoppingItem[] = neededIds
      .map((id) => {
        const ingredient = store.ingredients.find((i) => i.id === id);
        if (!ingredient) return null;
        const usedInMeals = meals
          .filter((m) => m!.ingredientIds.includes(id))
          .map((m) => m!.name);
        return { ingredient, usedInMeals };
      })
      .filter((x): x is ShoppingItem => x !== null)
      .sort((a, b) => a.ingredient.name.localeCompare(b.ingredient.name));

    return { shoppingItems: items, plannedMealCount: mealIds.length };
  }, [store.plannedMeals, store.meals, store.ingredients, store.pantry]);

  const toggleCheck = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const markAll = () =>
    setChecked(new Set(shoppingItems.map((i) => i.ingredient.id)));
  const clearAll = () => setChecked(new Set());

  const copyToClipboard = async () => {
    const lines = shoppingItems.map(
      (i) => `${checked.has(i.ingredient.id) ? "✓" : "•"} ${i.ingredient.name}`,
    );
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const checkedCount = shoppingItems.filter((i) =>
    checked.has(i.ingredient.id),
  ).length;
  const allChecked =
    shoppingItems.length > 0 && checkedCount === shoppingItems.length;

  return (
    <main className="px-[20px] md:px-[48px] py-[28px] md:py-[40px]">
      <div className="mb-[28px]">
        <p
          className="mb-[6px] tracking-[0.08em] text-[12px] uppercase font-semibold
              text-salmon-600"
        >
          Shopping
        </p>

        <h1
          className="leading-[1.15] text-[28px] md:text-[32px] lg:text-[36px] font-bold
            text-[var(--color-foreground)]"
        >
          Shopping list
        </h1>

        {plannedMealCount !== 0 && shoppingItems.length !== 0 && (
          <>
            <p className="mt-[6px] text-[14px] text-[var(--color-muted)]">
              {shoppingItems.length - checkedCount} item
              {shoppingItems.length - checkedCount !== 1 ? "s" : ""} left
              {checkedCount > 0 && ` · ${checkedCount} picked up`}
            </p>

            <div className="flex items-center gap-[8px] mt-[16px]">
              <button
                type="button"
                onClick={copyToClipboard}
                className={`select-none cursor-pointer inline-flex items-center
                  gap-[6px] border-[1.5px] rounded-[8px] px-[16px] py-[9px]
                  bg-[var(--color-surface)] whitespace-nowrap text-[13px] font-semibold
                  transition-colors duration-150
                  ${
                    copied
                      ? `border-green-200 text-green-600`
                      : `border-[var(--color-border)] text-[var(--color-muted)]
                         hover:bg-[var(--color-border)]
                         hover:text-[var(--color-foreground)]`
                  }
                `}
              >
                {copied ? (
                  <>
                    <Check size={14} strokeWidth={2} /> Copied!
                  </>
                ) : (
                  <>
                    <ClipboardCopy size={14} strokeWidth={2} /> Copy list
                  </>
                )}
              </button>

              {checkedCount > 0 ? (
                <button
                  type="button"
                  onClick={clearAll}
                  className="select-none cursor-pointer border-[1.5px]
                    border-salmon-200 rounded-[8px] px-[16px] py-[9px]
                    bg-[var(--color-surface)] whitespace-nowrap text-[13px] font-semibold
                    text-salmon-800 transition-colors duration-150 hover:bg-salmon-50"
                >
                  Clear checks
                </button>
              ) : (
                <button
                  type="button"
                  onClick={markAll}
                  className="select-none cursor-pointer border-[1.5px]
                    border-green-200 rounded-[8px] px-[16px] py-[9px]
                    bg-[var(--color-surface)] whitespace-nowrap text-[13px] font-semibold
                    text-green-600 transition-colors duration-150 hover:bg-green-50"
                >
                  Mark all
                </button>
              )}
            </div>

            {/* Progress bar */}
            {checkedCount > 0 && (
              <div className="mt-[40px]">
                <div className="overflow-hidden h-[7px] rounded-[6px] bg-[var(--color-border)]">
                  <div
                    className={`h-full rounded-[6px] transition-[width,background-color]
                      duration-[350ms] ease-in-out
                      ${allChecked ? `bg-green-600` : `bg-salmon-600`}`}
                    style={{
                      width: `${(checkedCount / shoppingItems.length) * 100}%`,
                    }}
                  />
                </div>

                {allChecked && (
                  <p
                    className="flex items-center gap-[3px] mt-[7px] text-[12px]
                      font-semibold text-salmon-600"
                  >
                    All picked up — you&apos;re good to cook{" "}
                    <Check size={14} strokeWidth={2} />
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {plannedMealCount === 0 ? (
        <EmptyShoppingList />
      ) : shoppingItems.length === 0 ? (
        <AllStockedState mealCount={plannedMealCount} />
      ) : (
        <>
          <ul className="flex flex-col gap-[6px] max-w-[580px]">
            {shoppingItems.map(({ ingredient, usedInMeals }) => (
              <ShoppingRow
                key={ingredient.id}
                name={ingredient.name}
                meals={usedInMeals}
                isChecked={checked.has(ingredient.id)}
                onToggle={() => toggleCheck(ingredient.id)}
              />
            ))}
          </ul>

          <p
            className="mt-[28px] leading-[1.6] text-center md:text-left text-[13px]
              text-[var(--color-muted)]"
          >
            Based on your plan for this week.{" "}
            <Link
              href="/pantry"
              className="select-none font-semibold text-salmon-800"
            >
              Update your pantry
            </Link>{" "}
            to keep this list accurate.
          </p>
        </>
      )}
    </main>
  );
}
