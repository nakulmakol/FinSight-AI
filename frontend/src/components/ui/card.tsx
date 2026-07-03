import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = true,
}: CardProps) {
  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -4,
              scale: 1.01,
            }
          : undefined
      }
      transition={{
        duration: 0.2,
      }}
      className={`
        rounded-3xl
        border
        border-white/10
        bg-[#172235]
        shadow-xl
        backdrop-blur-xl
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}