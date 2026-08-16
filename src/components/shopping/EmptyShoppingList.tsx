import Image from "next/image";
import Link from "next/link";

export default function EmptyShoppingList() {
  return (
    <div className="flex flex-col justify-center items-center px-[40px]">
      <Image
        src="/empty_shopping_list.svg"
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
        Nothing planned yet
      </h3>

      <p
        className="max-w-[360px] mb-[32px] leading-[1.65] text-center text-[15px]
          text-white"
      >
        Your shopping list builds itself once you plan your meals for the week.
      </p>

      <Link
        href="/planner"
        className="select-none rounded-[10px] px-[28px] py-[12px] bg-[var(--color-surface)]
          whitespace-nowrap text-[14px] md:text-[15px] font-semibold text-green-600
          transition-colors duration-150 hover:bg-[var(--color-border)]"
      >
        Go to Planner
      </Link>
    </div>
  );
}
