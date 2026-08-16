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
          lg:text-[26px] font-bold text-white"
      >
        You&apos;re all stocked up
      </h3>

      <p
        className="max-w-[360px] mb-[32px] leading-[1.65] text-center text-[15px]
          text-white"
      >
        Every ingredient needed for your {mealCount} planned meal
        {mealCount !== 1 ? "s" : ""} this week is already in your pantry.
      </p>

      <div className="flex items-center gap-[10px]">
        <Link
          href="/planner"
          className="select-none rounded-[10px] px-[28px] py-[12px] bg-[var(--color-surface)]
            whitespace-nowrap text-[14px] md:text-[15px] font-semibold text-green-600
            transition-colors duration-150 hover:bg-[var(--color-border)]"
        >
          View Planner
        </Link>

        <Link
          href="/pantry"
          className="select-none rounded-[10px] px-[28px] py-[12px]
            bg-salmon-400 whitespace-nowrap text-[14px] md:text-[15px] font-semibold
            text-[var(--color-foreground)] transition-colors duration-150
            hover:bg-salmon-600"
        >
          Update Pantry
        </Link>
      </div>
    </div>
  );
}
