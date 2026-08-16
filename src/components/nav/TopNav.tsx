import Link from "next/link";

export default function TopNav() {
  return (
    <div
      className="z-fixed fixed inset-x-0 top-0 flex lg:hidden items-center
        h-16 border-b border-[var(--color-muted)] px-[20px] md:px-[48px]
        pt-[env(safe-area-inset-top)] bg-green-600"
    >
      <Link
        href="/"
        className="select-none text-3xl font-display font-bold text-white"
      >
        Mise<span className="text-salmon-600">.</span>
      </Link>
    </div>
  );
}
