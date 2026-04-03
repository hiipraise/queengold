import type { Metadata } from "next";
import VerifyClient from "./VerifyClient";

export const metadata: Metadata = {
  title: "Verify Your Watch — Digital Watch Passport",
  description:
    "Enter your Queen Gold serial number to verify your timepiece's authenticity and view its Digital Watch Passport.",
  alternates: { canonical: "/verify" },
  openGraph: {
    title:       "Verify Your Queen Gold Timepiece",
    description: "Instant authenticity verification. Enter your serial number to reveal your Digital Watch Passport.",
    type:        "website",
  },
};

interface Props {
  searchParams: { sn?: string };
}

export default function VerifyPage({ searchParams }: Props) {
  return <VerifyClient initialSerial={searchParams.sn ?? ""} />;
}