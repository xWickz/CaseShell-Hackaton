import Link from "next/link";
import { ReactNode } from "react";

type GlowButtonProps = {
  href: string;
  children: ReactNode;
};

export default function GlowButton({ href, children }: GlowButtonProps) {
  return (
    <div className=" group relative inline-flex items-center justify-center gap-4">
      <div className="absolute inset-0 rounded-xl bg-linear-to-r from-indigo-500 via-pink-500 to-yellow-400 opacity-60 blur-lg filter transition-all duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
      <Link
        href={href}
        role="button"
        className="group relative inline-flex items-center justify-center rounded-xl bg-gray-900 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-gray-600/30"
      >
        {children}
        <svg
          aria-hidden="true"
          viewBox="0 0 10 10"
          height="10"
          width="10"
          fill="none"
          className="ml-2 -mr-1 mt-0.5 stroke-white stroke-2"
        >
          <path
            d="M0 5h7"
            className="opacity-0 transition group-hover:opacity-100"
          />
          <path
            d="M1 1l4 4-4 4"
            className="transition group-hover:translate-x-[3px]"
          />
        </svg>
      </Link>
    </div>
  );
}
