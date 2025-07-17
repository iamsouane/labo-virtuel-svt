// src/components/ui/Tooltip.tsx
import { type ReactNode, useState } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  position?: "top" | "right" | "bottom" | "left";
}

export default function Tooltip({
  content,
  children,
  className = "",
  position = "top",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 transform -translate-x-1/2",
    right: "left-full ml-2 top-1/2 transform -translate-y-1/2",
    bottom: "top-full mt-2 left-1/2 transform -translate-x-1/2",
    left: "right-full mr-2 top-1/2 transform -translate-y-1/2",
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0} // focus clavier
      aria-describedby="tooltip"
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          id="tooltip"
          className={`absolute z-50 w-[280px] max-w-sm rounded-md bg-primary px-3 py-1.5 text-xs text-light font-sans shadow-lg whitespace-normal ${positionClasses[position]}`}
        >
          {content}
          {/* Flèche */}
          <div
            className={`absolute w-3 h-3 bg-primary rotate-45 left-1/2 transform -translate-x-1/2 ${
              position === "top"
                ? "bottom-[-6px]"
                : position === "bottom"
                ? "top-[-6px]"
                : position === "left"
                ? "right-[-6px] top-1/2 -translate-y-1/2"
                : "left-[-6px] top-1/2 -translate-y-1/2"
            }`}
          />
        </div>
      )}
    </div>
  );
}