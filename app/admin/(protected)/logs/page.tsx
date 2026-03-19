import type { Metadata } from "next";
import LogsClient from "./LogsClient";

export const metadata: Metadata = {
  title: "Scan Logs — Admin",
  robots: { index: false, follow: false },
};

export default function LogsPage() {
  return <LogsClient />;
}
