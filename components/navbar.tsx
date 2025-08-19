"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();

  const navItems = [
    { name: "Ana Sayfa", href: "#home" },
    { name: "Özellikler", href: "#features" },
    { name: "Fiyatlandırma", href: "#pricing" },
    { name: "SSS", href: "#faq" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CSpark
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <button
            onClick={() => router.push('/app')}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Ücretsiz Başla
          </button>
        </div>
      </div>
    </header>
  );
}
