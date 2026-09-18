import type { HTMLAttributes, ReactNode } from "react";

export type CardProps = {
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children" | "className">;

export function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={[
        "rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg overflow-hidden transition-colors duration-700 ease-in-out",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
