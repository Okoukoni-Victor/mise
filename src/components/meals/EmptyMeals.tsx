interface EmptyMealsProps {
  onAdd: () => void;
}

export default function EmptyMeals({ onAdd }: EmptyMealsProps) {
  return (
    <div className="flex flex-col justify-center items-center px-[40px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="108"
        height="108"
        viewBox="0 0 108 108"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className="mb-[28px]"
      >
        {/* Plate */}
        <circle cx="54" cy="60" r="38" fill="var(--color-green-50)" />
        <circle
          cx="54"
          cy="60"
          r="38"
          stroke="var(--color-green-200)"
          strokeWidth="1.5"
        />
        {/* Inner plate ring */}
        <circle
          cx="54"
          cy="60"
          r="28"
          stroke="var(--color-green-200)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        {/* Fork */}
        <line
          x1="42"
          y1="40"
          x2="42"
          y2="78"
          stroke="var(--color-green-400)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="38"
          y1="40"
          x2="38"
          y2="52"
          stroke="var(--color-green-400)"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <line
          x1="46"
          y1="40"
          x2="46"
          y2="52"
          stroke="var(--color-green-400)"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M38 52 Q42 56 46 52"
          stroke="var(--color-green-400)"
          strokeWidth="1.75"
          fill="none"
          strokeLinecap="round"
        />
        {/* Knife */}
        <line
          x1="66"
          y1="40"
          x2="66"
          y2="78"
          stroke="var(--color-green-400)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M66 40 Q74 48 66 58"
          stroke="var(--color-green-400)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Salmon accent dots */}
        <circle cx="82" cy="24" r="7" fill="var(--color-salmon-600)" />
        <circle cx="92" cy="37" r="4.5" fill="var(--color-salmon-200)" />
        <circle cx="76" cy="14" r="3" fill="var(--color-salmon-200)" />
      </svg>

      <h3
        className="mb-[10px] leading-[1.2] text-center text-[26px] font-bold
          text-[var(--color-foreground)]"
      >
        No meals yet
      </h3>

      <p
        className="max-w-[360px] mb-[32px] leading-[1.65] text-center text-[15px]
          text-[var(--color-muted)]"
      >
        Add your go-to meals here. Once your library is built, you can plan your
        entire week in seconds.
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="select-none cursor-pointer rounded-[10px] px-[28px] py-[12px]
          bg-green-600 text-[14px] font-semibold text-white transition-colors duration-150
          hover:bg-green-800"
      >
        Add your first meal
      </button>
    </div>
  );
}
