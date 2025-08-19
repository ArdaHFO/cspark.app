import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CSpark - AI Destekli İçerik Üretimi",
  description: "Saniyeler içinde profesyonel blog yazıları, video scriptleri ve sosyal medya içerikleri üretin. AI destekli içerik üretim platformu.",
  icons: {
    icon: [
      { url: "/octopus-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/octopus-logo.png", sizes: "16x16", type: "image/png" }
    ],
    shortcut: "/octopus-logo.png",
    apple: "/octopus-logo.png",
    other: {
      rel: "icon",
      url: "/octopus-logo.png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
