import React from "react";
import "./Spinners.css";

// ========================================
// Types
// ========================================

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerColor =
  | "white"
  | "primary"
  | "success"
  | "warning"
  | "danger";

export type SpinnerVariant =
  | "circular"
  | "dots"
  | "bars"
  | "pulse"
  | "ring"
  | "dual-ring"
  | "orbit"
  | "grid"
  | "ripple";

export interface SpinnerProps {
  variant?: SpinnerVariant;
  size?: SpinnerSize;
  color?: SpinnerColor;
  count?: number;
  gridSize?: 3 | 4;
  className?: string;
}

// ========================================
// Spinner
// ========================================

export const Spinner: React.FC<SpinnerProps> = ({
  variant = "circular",
  size = "md",
  color = "white",
  count = 3,
  gridSize = 3,
  className = "",
}) => {
  const baseClass = `spinner ${size} ${color} ${className}`;

  switch (variant) {
    case "dots":
      return (
        <div className={`${baseClass} spinner-dots`}>
          {Array.from({ length: count }).map((_, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      );

    case "bars":
      return (
        <div className={`${baseClass} spinner-bars`}>
          {Array.from({ length: count }).map((_, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      );

    case "pulse":
      return <div className={`${baseClass} spinner-pulse`} />;

    case "ring":
      return <div className={`${baseClass} spinner-ring`} />;

    case "dual-ring":
      return (
        <div className={`${baseClass} spinner-dual-ring`}>
          <span />
          <span />
        </div>
      );

    case "orbit":
      return (
        <div className={`${baseClass} spinner-orbit`}>
          <span className="orbit-dot" />
        </div>
      );

    case "grid":
      return (
        <div className={`${baseClass} spinner-grid grid-${gridSize}`}>
          {Array.from({ length: gridSize * gridSize }).map((_, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      );

    case "ripple":
      return (
        <div className={`${baseClass} spinner-ripple`}>
          <span />
          <span />
        </div>
      );

    case "circular":
    default:
      return <div className={`${baseClass} spinner-circular`} />;
  }
};

export default Spinner;
