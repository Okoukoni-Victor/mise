import { Check } from "lucide-react";
import { Ingredient } from "@/lib/types";

type IngredientRowProps = {
  ingredient: Ingredient;
  available: boolean;
  onToggle: () => void;
};

export default function IngredientRow({
  ingredient,
  available,
  onToggle,
}: IngredientRowProps) {
  return (
    <li
      onClick={onToggle}
      title={
        available ? "Click to mark as needed" : "Click to mark as available"
      }
      className={`group cursor-pointer flex items-center gap-[24px]
        border rounded-[8px] px-[13px] py-[11px] text-center transition-all duration-150
        ${
          available
            ? `border-green-200 bg-green-50 hover:border-green-400 hover:bg-green-100`
            : `border-[var(--color-border)] bg-[var(--color-surface)]
               hover:border-green-200 hover:bg-green-50`
        }`}
    >
      <span
        className={`inline-flex shrink-0 justify-center items-center
          w-[20px] h-[20px] border rounded-full text-white transition-all duration-150
          ${
            available
              ? `border-green-600 bg-green-600`
              : `border-[var(--color-border)] bg-transparent group-hover:border-green-400`
          }
        `}
      >
        {available && <Check size={14} strokeWidth={2} />}
      </span>

      <span
        className={`flex-1 truncate text-[14px] transition-colors duration-150
          ${
            available
              ? `font-medium text-green-600`
              : `font-normal text-[var(--color-foreground)] group-hover:text-green-600`
          }
        `}
      >
        {ingredient.name}
      </span>

      <span
        className={`opacity-0 shrink-0 text-[11px] font-medium transition-opacity
          duration-150 group-hover:opacity-100
          ${available ? "text-salmon-900" : "text-green-900"}`}
      >
        {available ? "Remove" : "Got it"}
      </span>
    </li>
  );
}
