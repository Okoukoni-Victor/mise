import Image from "next/image";
import Link from "next/link";

export default function EmptyPantry() {
  return (
    <div className="flex flex-col justify-center items-center px-[40px]">
      <Image
        src="/empty_pantry.svg"
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
        className="select-none rounded-[10px] px-[28px]
          py-[12px] bg-green-600 whitespace-nowrap text-[14px] font-semibold text-white
          transition-colors duration-150 hover:bg-green-800"
      >
        Go to Meals
      </Link>
    </div>
  );
}
