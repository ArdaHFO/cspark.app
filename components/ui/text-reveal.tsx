"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextRevealByWord = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const [wordsArray, setWordsArray] = useState<string[]>([]);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once: true });

  useEffect(() => {
    setWordsArray(text.split(" "));
  }, [text]);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const renderWords = () => {
    return (
      <motion.div ref={ref} initial="hidden" animate={controls}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={`${word}-${idx}`}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
              transition={{
                duration: 0.25,
                delay: idx * 0.1,
              }}
              className={cn("inline-block", className)}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="dark:text-white text-black text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
