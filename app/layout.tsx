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
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "16x16", type: "image/png" }
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
    other: [
      { rel: "icon", url: "/favicon.png", sizes: "64x64" },
      { rel: "apple-touch-icon", url: "/favicon.png" }
    ],
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
