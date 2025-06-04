import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  readOnly?: boolean;
}

export function Rating({
  value,
  max = 5,
  onChange,
  size = "md",
  className,
  readOnly = false,
}: RatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const starSize = sizeClasses[size];

  const handleMouseEnter = (starValue: number) => {
    if (readOnly) return;
    setHoverValue(starValue);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverValue(null);
  };

  const handleClick = (starValue: number) => {
    if (readOnly || !onChange) return;
    onChange(starValue);
  };

  const renderStar = (starValue: number) => {
    const displayValue = hoverValue !== null ? hoverValue : value;
    const filled = starValue <= displayValue;

    return (
      <Star
        key={starValue}
        className={cn(
          starSize,
          "transition-all",
          filled
            ? "fill-amber-500 text-amber-500"
            : "fill-transparent text-gray-300",
          !readOnly && "cursor-pointer hover:text-amber-400"
        )}
        onMouseEnter={() => handleMouseEnter(starValue)}
        onClick={() => handleClick(starValue)}
      />
    );
  };

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: max }, (_, i) => renderStar(i + 1))}
    </div>
  );
}

export function RatingDisplay({ value, className }: { value: number; className?: string }) {
  // Round to nearest half
  const roundedValue = Math.round(value * 2) / 2;
  
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="font-medium">{roundedValue.toFixed(1)}</span>
      <Rating value={roundedValue} readOnly size="sm" />
    </div>
  );
}
