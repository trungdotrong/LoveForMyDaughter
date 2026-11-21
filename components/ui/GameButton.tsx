import Link from "next/link";
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

type Variant = "primary" | "secondary";
type Size = "lg" | "md";

interface StyleOptions {
  variant?: Variant;
  size?: Size;
  /** Accent color for primary buttons; defaults to a friendly orange. */
  color?: string;
  /** Darker shade used for the chunky 3D edge. */
  shade?: string;
}

const SIZES: Record<Size, string> = {
  lg: "min-h-16 px-8 text-2xl gap-3",
  md: "min-h-12 px-6 text-lg gap-2",
};

function buttonStyle({ variant = "primary", size = "lg", color = "#ff9f45", shade = "#e07b1f" }: StyleOptions) {
  const className = `inline-flex items-center justify-center rounded-full font-semibold select-none transition-transform active:translate-y-1 disabled:opacity-50 disabled:pointer-events-none ${SIZES[size]}`;
  const style: CSSProperties =
    variant === "primary"
      ? { background: color, color: "#fff", boxShadow: `0 6px 0 ${shade}` }
      : { background: "#fff", color: "var(--color-ink)", boxShadow: "0 5px 0 #e9dccb", border: "2px solid #f1e6d8" };
  return { className, style };
}

export function GameButton({
  variant,
  size,
  color,
  shade,
  className = "",
  style,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & StyleOptions) {
  const s = buttonStyle({ variant, size, color, shade });
  return <button type="button" className={`${s.className} ${className}`} style={{ ...s.style, ...style }} {...props} />;
}

export function GameLink({
  href,
  children,
  className = "",
  ...options
}: StyleOptions & { href: string; children: ReactNode; className?: string }) {
  const s = buttonStyle(options);
  return (
    <Link href={href} className={`${s.className} ${className}`} style={s.style}>
      {children}
    </Link>
  );
}

export function IconButton({
  label,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`grid size-12 place-items-center rounded-full bg-white/90 text-ink shadow-[0_4px_0_#e9dccb] transition-transform active:translate-y-1 ${className}`}
      {...props}
    />
  );
}
