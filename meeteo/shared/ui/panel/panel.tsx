import type { HTMLAttributes, ReactNode } from "react";

export type PanelProps = {
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className">;

export function Panel({
  children,
  className = "",
  ...props
}: PanelProps) {
  return (
    <section
      {...props}
      className={[
        "rounded-xl p-6 sm:p-8 transition-colors duration-700 ease-in-out",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </section>
  );
}
