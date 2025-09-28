import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";
import { Providers } from "~/components/providers";

export const metadata: Metadata = {
  title: "Hey Gen",
  description: "An AI-powered video generation platform where users can create lifelike avatars, generate voiceovers, and produce high-quality videos instantly.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="flex min-h-svh flex-col justify-center items-center">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
