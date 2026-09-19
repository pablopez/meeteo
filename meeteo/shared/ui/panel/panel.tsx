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
        "rounded-xl p-6 sm:p-8",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </section>
  );
}
