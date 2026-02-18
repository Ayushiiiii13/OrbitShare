import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export function Orb({ color = "bg-blue-500", size = "w-64 h-64", className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: [0.4, 0.8, 0.4],
        scale: [1, 1.2, 1],
        x: [0, 30, -30, 0],
        y: [0, -50, 20, 0],
      }}
      transition={{ 
        duration: 10, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: delay 
      }}
      className={cn(
        "absolute rounded-full blur-[80px] pointer-events-none mix-blend-screen",
        color,
        size,
        className
      )}
    />
  );
}
