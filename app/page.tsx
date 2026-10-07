import type { Metadata } from "next";
import { LithosHome } from "@/components/lithos/home";

export const metadata: Metadata = {
  title: "Lithos",
  description:
    "Every layer of sediment records a chapter of our planet. Peel back the crust with Lithos.",
};

export default function HomePage() {
  return <LithosHome />;
}
