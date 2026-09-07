import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import NeutronCursor from "@/components/NeutronCursor";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Md Shahnewaj Al Hasan — Physics & Web Development Portfolio",
  description:
    "Scholarship application portfolio highlighting academic achievements in physics and full-stack web development expertise.",
  keywords: [
    "physics",
    "nuclear physics",
    "quantum mechanics",
    "web development",
    "portfolio",
    "scholarship",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">
        <NeutronCursor />
        {children}
      </body>
    </html>
  );
}
