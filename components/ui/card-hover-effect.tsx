"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    icon: React.ReactNode;
    gradient: string;
  }[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full w-full"
        >
          <AnimatedCard>
            <Card>
              <CardIcon gradient={item.gradient}>{item.icon}</CardIcon>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </Card>
          </AnimatedCard>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardIcon = ({
  children,
  gradient,
}: {
  children: React.ReactNode;
  gradient: string;
}) => {
  return (
    <div className={cn(
      "w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4 bg-gradient-to-r",
      gradient
    )}>
      {children}
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};

const AnimatedCard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        rotateX: 5,
        rotateY: 5,
      }}
      transition={{
        duration: 0.15,
        ease: "easeOut",
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
      className="relative h-full w-full"
    >
      {children}
    </motion.div>
  );
};
