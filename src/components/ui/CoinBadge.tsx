import { motion } from "framer-motion";
import { Coins } from "lucide-react";

interface CoinBadgeProps {
  amount: number;
  showChange?: number;
  size?: "sm" | "md" | "lg";
}

export const CoinBadge = ({ amount, showChange, size = "md" }: CoinBadgeProps) => {
  const sizeClasses = {
    sm: "text-sm px-2 py-1 gap-1",
    md: "text-base px-3 py-1.5 gap-2",
    lg: "text-lg px-4 py-2 gap-2",
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  return (
    <motion.div
      className={`inline-flex items-center ${sizeClasses[size]} rounded-full bg-accent/10 border border-accent/30`}
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        className="text-accent"
        animate={showChange ? { rotateY: 360 } : {}}
        transition={{ duration: 0.6 }}
      >
        <Coins size={iconSizes[size]} />
      </motion.div>
      <span className="font-display font-semibold text-accent">
        {amount.toLocaleString()}
      </span>
      {showChange !== undefined && showChange !== 0 && (
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xs font-medium ${showChange > 0 ? "text-success" : "text-destructive"}`}
        >
          {showChange > 0 ? "+" : ""}{showChange}
        </motion.span>
      )}
    </motion.div>
  );
};
