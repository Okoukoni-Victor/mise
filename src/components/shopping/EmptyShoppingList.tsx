import Link from "next/link";

export default function EmptyShoppingList() {
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
        {/* Bag body */}
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
          stroke="var(--color-green-200)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Empty lines inside */}
        <line
          x1="32"
          y1="60"
          x2="60"
          y2="60"
          stroke="var(--color-green-200)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="32"
          y1="72"
          x2="52"
          y2="72"
          stroke="var(--color-green-200)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Salmon accent dots */}
        <circle cx="83" cy="24" r="7" fill="var(--color-salmon-600)" />
        <circle cx="93" cy="36" r="4.5" fill="var(--color-salmon-200)" />
      </svg>

      <h3
        className="mb-[10px] leading-[1.2] text-center text-[26px] font-bold
          text-[var(--color-foreground)]"
      >
        Nothing planned yet
      </h3>

      <p
        className="max-w-[360px] mb-[32px] leading-[1.65] text-center text-[15px]
          text-[var(--color-muted)]"
      >
        Your shopping list builds itself once you plan your meals for the week.
      </p>

      <Link
        href="/planner"
        className="select-none rounded-[10px] px-[28px] py-[12px] bg-green-600 text-[14px]
          font-semibold text-white transition-colors duration-150
          hover:bg-green-800"
      >
        Go to planner
      </Link>
    </div>
  );
}
