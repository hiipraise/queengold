import type { Metadata } from "next";
import WatchesClient from "./WatchesClient";

export const metadata: Metadata = {
  title: "Watch Management — Admin",
  robots: { index: false, follow: false },
};

export default function WatchesPage() {
  return <WatchesClient />;
}
