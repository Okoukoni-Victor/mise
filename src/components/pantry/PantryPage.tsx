"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { Ingredient } from "@/lib/types";
import EmptyPantry from "./EmptyPantry";

function ColHeader({
  label,
  count,
  background,
}: {
  label: string;
  count: number;
  background: string;
}) {
  return (
    <div
      className="flex items-center gap-[8px] mb-[12px] border-b
        border-[var(--color-border)] pb-[12px]"
    >
      <h2
        className="tracking-[0.02em] font-body text-[13px] font-bold
          text-[var(--color-foreground)]"
      >
        {label}
      </h2>

      <span
        className={`min-w-[24px] rounded-[20px] px-[8px] py-[2px] bg-salmon-600
          text-center leading-[1.6] text-[11px] font-bold text-white ${background}`}
      >
        {count}
      </span>
    </div>
  );
}

function ColEmpty({
  message,
  success = false,
}: {
  message: string;
  success?: boolean;
}) {
  return (
    <div
      className={`border border-dashed border-[var(--color-border)] rounded-[8px]
        px-[16px] py-[20px] text-center
        ${success ? "bg-green-50" : "bg-[var(--color-background)]"}`}
    >
      <p
        className={`leading-[1.5] text-[13px]
          ${success ? "font-medium" : "font-normal"}
          ${success ? "text-green-600" : "text-[var(--color-muted)]"}`}
      >
        {message}
      </p>
    </div>
  );
}

function IngredientRow({
  ingredient,
  available,
  onToggle,
}: {
  ingredient: Ingredient;
  available: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={
        available ? "Click to mark as needed" : "Click to mark as available"
      }
      className={`group select-none cursor-pointer flex items-center gap-[11px] w-full
        mb-[6px] border rounded-[8px] px-[13px] py-[11px] transition-all duration-150
        ease-in
        ${
          available
            ? `border-green-200 hover:border-green-400 bg-green-50
               hover:bg-green-100`
            : `border-[var(--color-border)] hover:border-green-200
               bg-[var(--color-surface)] hover:bg-green-50`
        }`}
    >
      {/* Circular check indicator */}
      <span
        className={`inline-flex justify-center items-center shrink-0 w-[20px] h-[20px]
        border rounded-full transition-all duration-150
        ${
          available
            ? "border-green-600"
            : "border-[var(--color-border)] group-hover:border-green-400"
        }
        ${available ? "bg-green-600" : "bg-transparent"}`}
      >
        {available && (
          <Check size={14} strokeWidth={2} className="text-white" />
        )}
      </span>

      {/* Ingredient name */}
      <span
        className={`flex-1 text-[14px] transition-colors duration-150
          ${available ? "font-medium" : "font-normal"}
          ${
            available
              ? "text-green-600"
              : "text-[var(--color-foreground)] group-hover:text-green-600"
          }`}
      >
        {ingredient.name}
      </span>

      {/* Hover hint */}
      <span
        className={`shrink-0 opacity-0 group-hover:opacity-100 text-[11px]
          font-medium transition-opacity duration-150
          ${available ? "text-salmon-600" : "text-green-600"}`}
      >
        {available ? "Remove" : "Got it"}
      </span>
    </button>
  );
}

export default function PantryPage() {
  const { store, dispatch } = useStore();
  const [search, setSearch] = useState("");

  const getPantryAvailable = useCallback(
    (id: string) =>
      store.pantry.find((p) => p.ingredientId === id)?.available ?? false,
    [store.pantry],
  );

  const toggleIngredient = (id: string) => {
    dispatch({
      type: "SET_PANTRY_ITEM",
      payload: { ingredientId: id, available: !getPantryAvailable(id) },
    });
  };

  const markAllAvailable = () => {
    store.ingredients.forEach((ing) =>
      dispatch({
        type: "SET_PANTRY_ITEM",
        payload: { ingredientId: ing.id, available: true },
      }),
    );
  };

  const clearAll = () => {
    store.ingredients.forEach((ing) =>
      dispatch({
        type: "SET_PANTRY_ITEM",
        payload: { ingredientId: ing.id, available: false },
      }),
    );
  };

  // Sorted + filtered ingredient list
  const filtered = useMemo(
    () =>
      [...store.ingredients]
        .filter((ing) => ing.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [store.ingredients, search],
  );

  const available = filtered.filter((ing) => getPantryAvailable(ing.id));
  const needed = filtered.filter((ing) => !getPantryAvailable(ing.id));

  const totalAvailable = store.ingredients.filter((ing) =>
    getPantryAvailable(ing.id),
  ).length;
  const total = store.ingredients.length;
  const progressPct = total > 0 ? (totalAvailable / total) * 100 : 0;
  const allDone = total > 0 && totalAvailable === total;

  // Empty state
  if (total === 0) {
    return (
      <div className="px-[20px] md:px-[48px] py-[28px] md:py-[40px]">
        <div className="mb-[40px]">
          <p
            className="mb-[6px] tracking-[0.08em] text-[12px] uppercase font-semibold
              text-salmon-600"
          >
            Pantry
          </p>

          <h1
            className="leading-[1.15] text-[36px] font-bold
              text-[var(--color-foreground)]"
          >
            What&apos;s at home
          </h1>
        </div>

        <EmptyPantry />
      </div>
    );
  }

  return (
    <main className="px-[20px] md:px-[48px] py-[28px] md:py-[40px]">
      <div className="flex flex-col justify-between gap-[16px] mb-[40px]">
        <div>
          <p
            className="mb-[6px] tracking-[0.08em] text-[12px] uppercase font-semibold
              text-salmon-600"
          >
            Pantry
          </p>

          <h1
            className="leading-[1.15] text-[36px] font-bold
              text-[var(--color-foreground)]"
          >
            What&apos;s at home
          </h1>

          <p className="mt-[6px] text-[14px] text-[var(--color-muted)]">
            {totalAvailable} of {total} ingredient{total !== 1 ? "s" : ""}{" "}
            available
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap shrink-0 gap-[8px]">
          <button
            type="button"
            onClick={markAllAvailable}
            className="select-none cursor-pointer border-[1.5px]
              border-[var(--color-border)] rounded-[8px] px-[16px] py-[9px]
              bg-[var(--color-surface)] whitespace-nowrap text-[13px] font-medium
              text-[var(--color-muted)] transition-colors duration-150
              hover:border-green-400"
          >
            Mark all available
          </button>

          <button
            type="button"
            onClick={clearAll}
            className="select-none cursor-pointer border-[1.5px]
              border-[var(--color-border)] rounded-[8px] px-[16px] py-[9px]
              bg-[var(--color-surface)] whitespace-nowrap text-[13px] font-medium
              text-[var(--color-muted)] transition-colors duration-150
              hover:border-salmon-400"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-[28px]">
        <div className="overflow-hidden h-[7px] rounded-[6px] bg-[var(--color-border)]">
          <div
            className={`h-full rounded-[6px] transition-[width,background-color]
            duration-400 ease-in-out
            ${allDone ? "bg-salmon-600" : "bg-green-600"}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {allDone && (
          <p
            className="flex items-center gap-[3px] mt-[7px] text-[12px] font-semibold
              text-salmon-600"
          >
            You have everything <Check size={14} strokeWidth={2} />
          </p>
        )}
      </div>

      {/* Search — only shown when there are enough ingredients */}
      {store.ingredients.length > 6 && (
        <div className="relative max-w-[360px] mb-[24px]">
          <Search
            size={14}
            strokeWidth={2}
            className="pointer-events-none absolute left-[11px] top-1/2
              -translate-y-1/2 text-[var(--color-muted)]"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ingredients..."
            className="w-full border-[1.5px] border-[var(--color-border)] rounded-[8px]
              pl-[34px] pr-[12px] py-[9px] bg-[var(--color-surface)] text-[14px]
              text-[var(--color-foreground)]"
          />
        </div>
      )}

      {/* Two-column ingredient list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
        {/* In your pantry */}
        <div>
          <ColHeader
            label="In your pantry"
            count={available.length}
            background="bg-green-600"
          />

          {available.length === 0 ? (
            <ColEmpty message="Tap any ingredient on the right to mark it as available." />
          ) : (
            available.map((ing) => (
              <IngredientRow
                key={ing.id}
                ingredient={ing}
                available={true}
                onToggle={() => toggleIngredient(ing.id)}
              />
            ))
          )}
        </div>

        {/* Still need */}
        <div>
          <ColHeader
            label="Still need"
            count={needed.length}
            background="bg-salmon-600"
          />
          {needed.length === 0 ? (
            <ColEmpty message="All stocked up — nothing left to buy." success />
          ) : (
            needed.map((ing) => (
              <IngredientRow
                key={ing.id}
                ingredient={ing}
                available={false}
                onToggle={() => toggleIngredient(ing.id)}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
