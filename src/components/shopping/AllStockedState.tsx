import Image from "next/image";
import Link from "next/link";

interface AllStockedStateProps {
  mealCount: number;
}

export default function AllStockedState({ mealCount }: AllStockedStateProps) {
  return (
    <div className="flex flex-col justify-center items-center px-[40px]">
      <Image
        src="/all_stocked_state.svg"
        alt=""
        aria-hidden="true"
        width={108}
        height={108}
        className="select-none mb-[28px]"
      />

      <h3
        className="mb-[10px] leading-[1.2] text-center text-[20px] md:text-[24px]
          lg:text-[26px] font-bold text-[var(--color-foreground)]"
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

      <div className="flex items-center gap-[10px]">
        <Link
          href="/planner"
          className="select-none border-[1.5px]
            border-transparent rounded-[10px] px-[28px] py-[12px] bg-green-600
            whitespace-nowrap text-[14px] font-semibold text-white transition-colors
            duration-150 hover:bg-green-800"
        >
          View Planner
        </Link>

        <Link
          href="/pantry"
          className="select-none border-[1.5px]
            border-[var(--color-border)] rounded-[10px] px-[28px] py-[12px]
            bg-[var(--color-surface)] whitespace-nowrap text-[14px] font-semibold
            text-[var(--color-muted)] transition-colors duration-150
            hover:bg-[var(--color-border)] hover:text-[var(--color-foreground)]"
        >
          Update Pantry
        </Link>
      </div>
    </div>
  );
}
