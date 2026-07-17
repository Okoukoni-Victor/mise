"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import EmptyPantry from "./EmptyPantry";
import ColEmpty from "./ColEmpty";
import ColHeader from "./ColHeader";
import IngredientRow from "./IngredientRow";

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
  const allDone = total > 0 && totalAvailable === total;

  return (
    <main
      className="flex-1 min-w-0 min-h-dvh px-[20px] md:px-[48px] pt-[28px] pb-[92px]
        lg:py-[40px]"
    >
      <div className="mb-[28px]">
        <p
          className="mb-[6px] tracking-[0.08em] text-[12px] uppercase font-semibold
              text-salmon-600"
        >
          Pantry
        </p>

        <h1
          className="leading-[1.15] text-[28px] md:text-[32px] lg:text-[36px] font-bold
            text-[var(--color-foreground)]"
        >
          What&apos;s at home
        </h1>

        {total !== 0 && (
          <>
            <p className="mt-[6px] text-[14px] text-[var(--color-muted)]">
              {totalAvailable} of {total} ingredient{total !== 1 ? "s" : ""}{" "}
              available
            </p>

            <div className="flex items-center gap-[8px] mt-[16px]">
              <button
                type="button"
                onClick={markAllAvailable}
                className="select-none cursor-pointer rounded-[8px] px-[16px] py-[9px]
                  bg-green-600 whitespace-nowrap text-[13px] font-semibold text-white
                  transition-colors duration-150 hover:bg-green-800"
              >
                Mark all available
              </button>

              <button
                type="button"
                onClick={clearAll}
                className="select-none cursor-pointer rounded-[8px] px-[16px] py-[9px]
                  bg-salmon-800 whitespace-nowrap text-[13px] font-semibold text-white
                  transition-colors duration-150 hover:bg-salmon-900"
              >
                Clear all
              </button>
            </div>

            {/* Progress bar */}
            {totalAvailable > 0 && (
              <div className="mt-[40px]">
                <div className="overflow-hidden h-[7px] rounded-[6px] bg-[var(--color-border)]">
                  <div
                    className={`h-full rounded-[6px] transition-[width,background-color]
                    duration-[350ms] ease-in-out
                  ${allDone ? "bg-green-600" : "bg-salmon-600"}`}
                    style={{ width: `${(totalAvailable / total) * 100}%` }}
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
            )}

            {/* Search — only shown when there are enough ingredients */}
            {store.ingredients.length > 6 && (
              <div className="relative max-w-[360px] mt-[40px]">
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
                  className="w-full border-[1.5px] border-[var(--color-border)]
                    rounded-[8px] pl-[34px] pr-[12px] py-[9px] bg-[var(--color-surface)]
                    text-[14px] text-[var(--color-foreground)] transition-colors
                    duration-150 focus-visible:outline-none focus:ring-2
                    focus:ring-offset-0 focus:ring-salmon-200 focus:border-transparent"
                />
              </div>
            )}
          </>
        )}
      </div>

      {total === 0 ? (
        <EmptyPantry />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          {/* In your pantry */}
          <div>
            <ColHeader
              label="In your pantry"
              count={available.length}
              variant="green"
            />

            {available.length === 0 ? (
              <ColEmpty message="Mark ingredients as available to see them here." />
            ) : (
              <ul className="flex flex-col gap-[6px]">
                {available.map((ing) => (
                  <IngredientRow
                    key={ing.id}
                    ingredient={ing}
                    available={true}
                    onToggle={() => toggleIngredient(ing.id)}
                  />
                ))}
              </ul>
            )}
          </div>

          {/* Still need */}
          <div>
            <ColHeader
              label="Still need"
              count={needed.length}
              variant="salmon"
            />
            {needed.length === 0 ? (
              <ColEmpty
                message="All stocked up — nothing left to buy."
                success
              />
            ) : (
              <ul className="flex flex-col gap-[6px]">
                {needed.map((ing) => (
                  <IngredientRow
                    key={ing.id}
                    ingredient={ing}
                    available={false}
                    onToggle={() => toggleIngredient(ing.id)}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
