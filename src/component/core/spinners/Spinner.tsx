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
  const wrapperClass = `spinner-wrapper ${className}`;
  const innerClass = `spinner ${size} ${color}`;

  switch (variant) {
    case "dots":
      return (
        <div className={wrapperClass}>
          <div className={`${innerClass} spinner-dots`}>
            {Array.from({ length: count }).map((_, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      );

    case "bars":
      return (
        <div className={wrapperClass}>
          <div className={`${innerClass} spinner-bars`}>
            {Array.from({ length: count }).map((_, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
      );

    case "pulse":
      return (
        <div className={wrapperClass}>
          <div className={`${innerClass} spinner-pulse`} />
        </div>
      );

    case "ring":
      return (
        <div className={wrapperClass}>
          <div className={`${innerClass} spinner-ring`} />
        </div>
      );

    case "dual-ring":
      return (
        <div className={wrapperClass}>
          <div className={`${innerClass} spinner-dual-ring`}>
            <span />
            <span />
          </div>
        </div>
      );

    case "orbit":
      return (
        <div className={wrapperClass}>
          <div className={`${innerClass} spinner-orbit`}>
            <span className="orbit-dot" />
          </div>
        </div>
      );

    case "grid":
      return (
        <div className={wrapperClass}>
          <div className={`${innerClass} spinner-grid grid-${gridSize}`}>
            {Array.from({ length: gridSize * gridSize }).map((_, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
      );

    case "ripple":
      return (
        <div className={wrapperClass}>
          <div className={`${innerClass} spinner-ripple`}>
            <span />
            <span />
          </div>
        </div>
      );

    case "circular":
    default:
      return (
        <div className={wrapperClass}>
          <div className={`${innerClass} spinner-circular`} />
        </div>
      );
  }
};

export default Spinner;
