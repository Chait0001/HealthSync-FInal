"use client";

import { useState, MouseEvent as ReactMouseEvent } from "react";
import { cn } from "@/lib/utils";

export const CardSpotlight = ({
  children,
  radius = 350,
  className,
  ...props
}: {
  radius?: number;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: ReactMouseEvent<HTMLDivElement>) {
    let { left, top } = currentTarget.getBoundingClientRect();
    setMousePosition({ x: clientX - left, y: clientY - top });
  }

  return (
    <div
      className={cn(
        "group/spotlight p-10 rounded-md relative border border-neutral-800 bg-black overflow-hidden transition-all duration-300 cursor-pointer",
        isHovering && "border-neutral-700",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      {/* Spotlight gradient that follows mouse */}
      <div
        className="pointer-events-none absolute z-0 -inset-px rounded-md transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(${radius}px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.15), transparent 80%)`,
        }}
      />

      {/* Subtle dot pattern on hover */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          opacity: isHovering ? 0.5 : 0,
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.08) 1px, transparent 1px),
                            radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.08) 1px, transparent 1px)`,
          backgroundSize: '30px 30px, 50px 50px',
        }}
      />

      {children}
    </div>
  );
};
