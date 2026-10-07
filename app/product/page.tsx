"use client";

import Link from "next/link";
import { Compass, Layers, Map, Mountain, Radio } from "lucide-react";
import { LithosNav } from "@/components/lithos/nav";
import { signOut } from "@/lib/auth";
import { useSession } from "@/lib/use-session";

const BG_IMAGE_2 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85";

const sections = [
  {
    id: "field-guides",
    icon: Compass,
    title: "Field Guides",
    body: "Pocket references for minerals, fossils, and outcrops. Each guide pins a formation to the map so you can read the rock in place.",
  },
  {
    id: "geology",
    icon: Layers,
    title: "Geology",
    body: "Cross-sections of sediment, ash, and bedrock. Peel a layer to see what was shoreline, desert, or seafloor millions of years ago.",
  },
  {
    id: "plans",
    icon: Mountain,
    title: "Plans",
    body: "Routes for a single afternoon or a season in the field. Plans stack maps, guides, and stops into one dig you can follow.",
  },
  {
    id: "live-tour",
    icon: Radio,
    title: "Live Tour",
    body: "A guided pass across the same ground, narrated as the crust opens. Join a tour or replay the last one from the map.",
  },
];

export default function ProductPage() {
  const session = useSession();

  return (
    <div
      className="min-h-screen bg-[#07080c] text-white tracking-[-0.02em]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <LithosNav />
      <main className="pt-28 pb-20 px-5 sm:px-10 md:px-14 max-w-6xl mx-auto">
        <section className="relative overflow-hidden rounded-[28px] border border-white/10 min-h-[420px] flex items-end">
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${BG_IMAGE_2})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
          <div className="relative z-10 p-7 sm:p-10 max-w-xl">
            <p className="text-[#e8702a] text-sm font-medium mb-3 flex items-center gap-2">
              <Map className="w-4 h-4" />
              Product
            </p>
            <h1 className="text-4xl sm:text-6xl leading-[0.95] font-playfair italic">
              Peel back the crust
            </h1>
            <p className="mt-4 text-white/80 text-sm sm:text-base leading-relaxed">
              Lithos maps are the product: interactive layers you can open from the home hero, then follow through field guides, geology, plans, and a live tour.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {session ? (
                <>
                  <span className="text-sm text-white/80">
                    Signed in as {session.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="text-sm font-medium px-5 py-2.5 rounded-full border border-white/30 hover:bg-white/10 transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
              >
                <Icon className="w-5 h-5 text-[#e8702a]" />
                <h2 className="mt-4 text-2xl font-playfair italic">{section.title}</h2>
                <p className="mt-3 text-sm text-white/75 leading-relaxed">{section.body}</p>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
