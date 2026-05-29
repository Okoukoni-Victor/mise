"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { ClipboardCopy, Check } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { Ingredient } from "@/lib/types";
import { getWeekDates } from "@/lib/utils";
import EmptyShoppingList from "./EmptyShoppingList";

interface ShoppingItem {
  ingredient: Ingredient;
  usedInMeals: string[];
}

function AllStockedState({ mealCount }: { mealCount: number }) {
  return (
    <div className="flex flex-col items-center px-[40px]">
      <svg
        width="108"
        height="108"
        viewBox="0 0 108 108"
        fill="none"
        className="mb-[28px]"
        aria-hidden="true"
        focusable="false"
      >
        {/* Bag body — filled */}
        <rect
          x="18"
          y="38"
          width="72"
          height="56"
          rx="8"
          fill="var(--color-green-50)"
          stroke="var(--color-green-200)"
          strokeWidth="1.5"
        />
        {/* Bag handle */}
        <path
          d="M38 38 Q38 20 54 20 Q70 20 70 38"
          stroke="var(--color-green-400)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Big checkmark inside bag */}
        <path
          d="M36 64 L48 76 L72 52"
          stroke="var(--color-green-600)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Salmon accent */}
        <circle cx="83" cy="24" r="7" fill="var(--color-salmon-600)" />
        <circle cx="93" cy="36" r="4.5" fill="var(--color-salmon-200)" />
      </svg>

      <h3
        className="mb-[10px] leading-[1.2] text-center text-[26px] font-bold
          text-[var(--color-foreground)]"
      >
        You&apos;re all stocked up
      </h3>

      <p
        className="max-w-[360px] mb-[32px] leading-[1.65] text-center text-[15px]
        text-[var(--color-muted)]"
      >
        Every ingredient needed for your {mealCount} planned meal
        {mealCount !== 1 ? "s" : ""} this week is already in your pantry.
      </p>

      <div className="flex gap-[10px]">
        <Link
          href="/planner"
          className="select-none border-[1.5px] border-transparent rounded-[10px] px-[24px]
            py-[12px] bg-green-600 text-[14px] font-semibold text-white"
        >
          View planner
        </Link>

        <Link
          href="/pantry"
          className="select-none border-[1.5px] border-[var(--color-border)] rounded-[10px]
            px-[24px] py-[12px] bg-[var(--color-surface)] text-[14px] font-semibold
            text-[var(--color-muted)]"
        >
          Update pantry
        </Link>
      </div>
    </div>
  );
}

// Shopping row
function ShoppingRow({
  name,
  meals,
  isChecked,
  onToggle,
}: {
  name: string;
  meals: string[];
  isChecked: boolean;
  onToggle: () => void;
}) {
  return (
    <li
      onClick={onToggle}
      className={`group cursor-pointer flex gap-[12px] border rounded-[10px] px-[16px]
        py-[13px] transition-all duration-150
        ${
          isChecked
            ? `opacity-72 border-green-200 bg-green-50`
            : `opacity-100
           border-[var(--color-border)] bg-[var(--color-surface)]
           hover:bg-[var(--color-background)]`
        }
       `}
    >
      {/* Circle checkbox */}
      <span
        className={`flex shrink-0 justify-center items-center w-[22px] h-[22px] mt-[1px]
        border-2 rounded-full transition-all duration-150
        ${
          isChecked
            ? `border-green-600 bg-green-600`
            : `border-[var(--color-border)]
           group-hover:border-green-400 bg-transparent`
        }`}
      >
        {isChecked && (
          <Check size={14} strokeWidth={2.5} className="text-white" />
        )}
      </span>

      <div className="flex-1">
        {/* Name */}
        <span
          className={`block text-[15px] font-medium transition-colors duration-150
            ${
              isChecked
                ? `line-through text-[var(--color-muted)]`
                : `text-[var(--color-foreground)]`
            }
            ${meals.length > 0 && !isChecked ? "mb-[6px]" : ""}`}
        >
          {name}
        </span>

        {/* Meal tags — hidden when checked */}
        {meals.length > 0 && !isChecked && (
          <div className="flex flex-wrap gap-[4px]">
            {meals.map((meal) => (
              <span
                key={meal}
                className="overflow-hidden max-w-[180px] border border-[var(--color-border)]
                  rounded-[20px] px-[8px] py-[2px] bg-[var(--color-background)]
                  whitespace-nowrap text-ellipsis text-[11px] font-medium
                  text-[var(--color-muted)]"
              >
                {meal}
              </span>
            ))}
          </div>
        )}
      </div>
    </li>
  );
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

  // Empty states
  if (plannedMealCount === 0) {
    return (
      <div className="px-[20px] md:px-[48px] py-[28px] md:py-[40px]">
        <p
          className="mb-[6px] tracking-[0.08em] uppercase text-[12px] font-semibold
              text-salmon-600"
        >
          Shopping
        </p>

        <h1
          className="mb-[40px] leading-[1.15] text-[36px] font-bold
              text-[var(--color-foreground)]"
        >
          Shopping list
        </h1>

        <EmptyShoppingList />
      </div>
    );
  }

  if (shoppingItems.length === 0) {
    return (
      <div className="px-[20px] md:px-[48px] py-[28px] md:py-[40px]">
        <p
          className="mb-[6px] tracking-[0.08em] uppercase text-[12px] font-semibold
              text-salmon-600"
        >
          Shopping
        </p>

        <h1
          className="mb-[40px] leading-[1.15] text-[36px] font-bold
              text-[var(--color-foreground)]"
        >
          Shopping list
        </h1>

        <AllStockedState mealCount={plannedMealCount} />
      </div>
    );
  }

  // Main list
  return (
    <main className="px-[20px] md:px-[48px] py-[28px] md:py-[40px]">
      {/* Header */}
      <div className="mb-[40px]">
        <div className="mb-[18px]">
          <p
            className="mb-[6px] tracking-[0.08em] uppercase text-[12px] font-semibold
              text-salmon-600"
          >
            Shopping
          </p>

          <h1
            className="leading-[1.15] text-[36px] font-bold
              text-[var(--color-foreground)]"
          >
            Shopping list
          </h1>

          <p className="mt-[12px] text-[14px] text-[var(--color-muted)]">
            {shoppingItems.length - checkedCount} item
            {shoppingItems.length - checkedCount !== 1 ? "s" : ""} left
            {checkedCount > 0 && ` · ${checkedCount} picked up`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap shrink-0 gap-[8px]">
          <button
            type="button"
            onClick={copyToClipboard}
            className={`select-none cursor-pointer flex items-center gap-[6px] border-[1.5px]
              rounded-[8px] px-[16px] py-[9px] bg-[var(--color-surface)] whitespace-nowrap
              text-[13px] font-medium transition-colors duration-150
              ${
                copied
                  ? `border-green-200 text-green-600`
                  : `border-[var(--color-border)] text-[var(--color-muted)]`
              }
             `}
          >
            {copied ? (
              <Check size={14} strokeWidth={2.5} />
            ) : (
              <ClipboardCopy size={14} strokeWidth={2} />
            )}
            {copied ? "Copied!" : "Copy list"}
          </button>

          {checkedCount > 0 ? (
            <button
              type="button"
              onClick={clearAll}
              className="select-none cursor-pointer flex items-center gap-[6px]
              border-[1.5px] border-[var(--color-border)] rounded-[8px] px-[16px]
              py-[9px] bg-[var(--color-surface)] whitespace-nowrap text-[13px]
              font-medium text-[var(--color-muted)] transition-colors duration-150"
            >
              Clear checks
            </button>
          ) : (
            <button
              type="button"
              onClick={markAll}
              className="select-none cursor-pointer flex items-center gap-[6px]
              border-[1.5px] border-[var(--color-border)] rounded-[8px] px-[16px]
              py-[9px] bg-[var(--color-surface)] whitespace-nowrap text-[13px]
              font-medium text-[var(--color-muted)] transition-colors duration-150"
            >
              Mark all
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {checkedCount > 0 && (
        <div className="mb-[24px]">
          <div
            className="overflow-hidden h-[7px] rounded-[6px]
              bg-[var(--color-border)]"
          >
            <div
              className={`h-full rounded-[6px] transition-[width,background-color]
                duration-[350ms]
                ${allChecked ? "bg-salmon-600" : "bg-green-600"}`}
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
              <Check size={12} strokeWidth={2} />
            </p>
          )}
        </div>
      )}

      {/* List */}
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

      {/* Footer note */}
      <p className="mt-[28px] leading-[1.6] text-[13px] text-[var(--color-muted)]">
        Based on your plan for this week.{" "}
        <Link
          href="/pantry"
          className="select-none font-semibold text-green-600"
        >
          Update your pantry
        </Link>{" "}
        to keep this list accurate.
      </p>
    </main>
  );
}
