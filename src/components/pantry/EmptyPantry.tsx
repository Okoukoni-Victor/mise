import Link from "next/link";

export default function EmptyPantry() {
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
        {/* Box body */}
        <rect
          x="18"
          y="48"
          width="72"
          height="48"
          rx="6"
          fill="var(--color-green-50)"
          stroke="var(--color-green-200)"
          strokeWidth="1.5"
        />
        {/* Box lid left flap */}
        <path
          d="M18 48 L18 34 Q18 28 26 28 L54 28"
          stroke="var(--color-green-200)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="var(--color-green-50)"
        />
        {/* Box lid right flap */}
        <path
          d="M90 48 L90 34 Q90 28 82 28 L54 28"
          stroke="var(--color-green-200)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="var(--color-green-50)"
        />
        {/* Centre crease on lid */}
        <line
          x1="54"
          y1="28"
          x2="54"
          y2="48"
          stroke="var(--color-green-200)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Box divider line */}
        <line
          x1="18"
          y1="64"
          x2="90"
          y2="64"
          stroke="var(--color-green-200)"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
        {/* Empty interior dots */}
        <circle cx="40" cy="74" r="3" fill="var(--color-green-200)" />
        <circle cx="54" cy="74" r="3" fill="var(--color-green-200)" />
        <circle cx="68" cy="74" r="3" fill="var(--color-green-200)" />
        {/* Salmon accent dots */}
        <circle cx="84" cy="22" r="7" fill="var(--color-salmon-600)" />
        <circle cx="94" cy="34" r="4.5" fill="var(--color-salmon-200)" />
        <circle cx="76" cy="13" r="3" fill="var(--color-salmon-200)" />
      </svg>

      <h3
        className="mb-[10px] leading-[1.2] text-center text-[26px] font-bold
          text-[var(--color-foreground)]"
      >
        Nothing to track yet
      </h3>

      <p
        className="max-w-[360px] mb-[32px] leading-[1.65] text-center text-[15px]
          text-[var(--color-muted)]"
      >
        Add meals with ingredients to your library and they&apos;ll appear here
        for you to track.
      </p>

      <Link
        href="/meals"
        className="select-none rounded-[10px] px-[28px] py-[12px] bg-green-600 text-[14px]
          font-semibold text-white transition-colors duration-150
          hover:bg-green-800"
      >
        Go to Meals
      </Link>
    </div>
  );
}
