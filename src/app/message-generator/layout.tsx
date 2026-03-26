import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Message Generator",
  description:
    "Draft and refine LinkedIn connection messages and follow-up campaigns with Profit Coach guidance.",
};

export default function MessageGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
