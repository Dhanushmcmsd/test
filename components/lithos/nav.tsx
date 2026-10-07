"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useSession } from "@/lib/use-session";

const LINKS = [
  { id: "course", label: "Course", href: "/" },
  { id: "product", label: "Product", href: "/product" },
  { id: "guides", label: "Field Guides", href: "/product#field-guides" },
  { id: "geology", label: "Geology", href: "/product#geology" },
  { id: "plans", label: "Plans", href: "/product#plans" },
  { id: "tour", label: "Live Tour", href: "/product#live-tour" },
] as const;

function Logo() {
  return (
    <Link href="/" className="relative z-10 flex items-center gap-2.5">
      <svg width="26" height="26" viewBox="0 0 256 256" fill="#ffffff" aria-hidden="true">
        <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
      </svg>
      <span className="text-white text-2xl font-playfair italic">Lithos</span>
    </Link>
  );
}

export function LithosNav() {
  const pathname = usePathname();
  const session = useSession();
  const [hash, setHash] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  const activeId = (() => {
    if (pathname === "/product") {
      if (hash === "#field-guides") return "guides";
      if (hash === "#geology") return "geology";
      if (hash === "#plans") return "plans";
      if (hash === "#live-tour") return "tour";
      return "product";
    }
    return "course";
  })();

  const accountHref = session ? "/product" : "/sign-up";
  const accountLabel = session ? session.name.split(" ")[0] : "Sign Up";

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
      <Logo />

      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
        {LINKS.map((link) => {
          const active = link.id === activeId;
          return (
            <Link
              key={link.id}
              href={link.href}
              className={
                active
                  ? "text-white whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium"
                  : "text-white/80 whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 hover:text-white transition-colors"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="relative z-10 flex items-center gap-2">
        <Link
          href={accountHref}
          className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100"
        >
          {accountLabel}
        </Link>
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/15 border border-white/30 text-white"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden absolute top-[4.5rem] left-4 right-4 rounded-3xl bg-black/75 backdrop-blur-xl border border-white/20 p-3 flex flex-col gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={() => setOpen(false)}
              className={
                link.id === activeId
                  ? "text-white px-4 py-2.5 rounded-full text-sm font-medium bg-white/15"
                  : "text-white/80 px-4 py-2.5 rounded-full text-sm font-medium hover:bg-white/20 hover:text-white transition-colors"
              }
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={accountHref}
            onClick={() => setOpen(false)}
            className="mt-1 bg-white text-gray-900 text-sm font-semibold px-4 py-2.5 rounded-full text-center hover:bg-gray-100"
          >
            {accountLabel}
          </Link>
        </div>
      )}
    </nav>
  );
}
