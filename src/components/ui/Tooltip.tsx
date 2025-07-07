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

    // Position classes Tailwind pour la bulle
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
            tabIndex={0} // pour focus clavier accessible
            aria-describedby="tooltip"
        >
            {children}
            {visible && (
                <div
                    role="tooltip"
                    id="tooltip"
                    className={`absolute z-50  w-[300px] max-w-md rounded-md bg-gray-700 px-3 py-1 text-xs text-white shadow-lg whitespace-normal ${positionClasses[position]}`}
                >
                    {content}
                    <div className="absolute w-2 h-2 bg-gray-700 rotate-45 left-1/2 -bottom-1 transform -translate-x-1/2"></div>
                </div>
            )}
        </div>
    );
}