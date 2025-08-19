"use client";
import React from "react";
import { FlipWords } from "@/components/ui/flip-words";

export function CSparkFlipWordsDemo() {
  const words = ["hızlı", "kolay", "profesyonel", "akıllı"];

  return (
    <div className="flex justify-center items-center px-4 relative z-30">
      <div className="text-5xl md:text-7xl lg:text-9xl mx-auto font-bold text-center">
        <div className="mb-6">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
            CSpark
          </span>
        </div>
        <div className="text-3xl md:text-5xl lg:text-6xl mb-4">
          <FlipWords words={words} className="text-purple-400 font-extrabold drop-shadow-lg" />
          <span className="text-white drop-shadow-lg"> içerik üretimi</span>
        </div>
      </div>
    </div>
  );
}
