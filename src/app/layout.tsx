import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/hooks/useStore";
import Sidebar from "@/components/nav/Sidebar";
import TopNav from "@/components/nav/TopNav";
import BottomNav from "@/components/nav/BottomNav";

export const metadata: Metadata = {
  title: "Mise — Plan before hunger decides",
  description:
    "A personal meal planner built to eliminate food decision fatigue. Know what you're eating before you're too hungry to think.",
};

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const DMSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${DMSans.variable} antialiased`}
    >
      <body>
        <StoreProvider>
          <TopNav />
          <div className="flex">
            <Sidebar />

            {children}
          </div>

          <BottomNav />
        </StoreProvider>
      </body>
    </html>
  );
}
