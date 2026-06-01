import { Check } from "lucide-react";

interface ShoppingRowProps {
  name: string;
  meals: string[];
  isChecked: boolean;
  onToggle: () => void;
}

export default function ShoppingRow({
  name,
  meals,
  isChecked,
  onToggle,
}: ShoppingRowProps) {
  return (
    <li
      onClick={onToggle}
      className={`group cursor-pointer flex gap-[12px] border rounded-[10px] px-[16px]
        py-[13px] transition-all duration-150
        ${
          isChecked
            ? `opacity-72 border-green-200 bg-green-50`
            : `opacity-100 border-[var(--color-border)] bg-[var(--color-surface)]
               hover:bg-[var(--color-background)]`
        }
      `}
    >
      {/* Circle checkbox */}
      <span
        className={`inline-flex shrink-0 justify-center items-center w-[22px] h-[22px] mt-[1px]
          border-2 rounded-full text-white transition-all duration-150
          ${
            isChecked
              ? "border-green-600 bg-green-600"
              : "border-[var(--color-border)] bg-transparent group-hover:border-green-400"
          }`}
      >
        {isChecked && <Check size={14} strokeWidth={2.5} />}
      </span>

      <div className="flex-1 min-w-0">
        {/* Name */}
        <span
          className={`block truncate
            text-[15px] font-medium transition-colors duration-150
            ${
              isChecked
                ? "line-through text-[var(--color-muted)]"
                : "text-[var(--color-foreground)]"
            }
            ${meals.length > 0 && !isChecked ? "mb-[6px]" : ""}`}
        >
          {name}
        </span>

        {/* Meal tags */}
        {meals.length > 0 && !isChecked && (
          <div className="flex flex-wrap gap-[4px]">
            {meals.map((meal) => (
              <span
                key={meal}
                className="select-none max-w-[180px] border
                  border-salmon-200 rounded-[20px] px-[8px] py-[2px] bg-salmon-50
                  truncate text-[11px] font-semibold
                  text-salmon-800"
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
