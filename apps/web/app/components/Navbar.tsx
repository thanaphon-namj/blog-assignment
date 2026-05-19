"use client";

import Link from "next/link";

interface NavbarProps {
  name?: string;
  onLogout: () => void;
}

export default function Navbar({ name, onLogout }: Readonly<NavbarProps>) {
  return (
    <nav className="border-b border-slate-200/60 bg-white/90 backdrop-blur-md sticky top-0 z-50 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex items-center justify-between max-w-7xl">
        <Link
          href="/posts"
          className="text-xl font-extrabold text-blue-600 cursor-pointer select-none hover:opacity-90"
        >
          Blog
        </Link>
        <div className="flex items-center gap-4">
          {name && (
            <span className="hidden sm:inline text-sm text-slate-500 font-medium">
              {name}
            </span>
          )}
          <button
            className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
