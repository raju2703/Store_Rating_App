import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = "md",
  className,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const starSize = sizes[size];

  const handleMouseOver = (index: number) => {
    if (readOnly) return;
    setHoverValue(index);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverValue(null);
  };

  const handleClick = (index: number) => {
    if (readOnly || !onChange) return;
    onChange(index);
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div 
      className={cn("flex items-center", className)} 
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          className={cn(
            starSize,
            "cursor-pointer transition-colors",
            index <= displayValue
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300",
            readOnly && "cursor-default"
          )}
          onMouseOver={() => handleMouseOver(index)}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
}
