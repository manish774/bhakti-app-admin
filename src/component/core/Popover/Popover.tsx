import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import "./Popover.css";

export interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  trigger_type?: "click" | "hover";
  closeOnClickOutside?: boolean;
  className?: string;
  triggerClassName?: string;
  maxWidth?: number;
}

const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  position = "bottom",
  trigger_type = "click",
  closeOnClickOutside = true,
  className = "",
  triggerClassName = "",
  maxWidth = undefined,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        closeOnClickOutside &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    },
    [closeOnClickOutside],
  );

  // Reset states and check if popover overflows when opening
  useEffect(() => {
    if (isOpen) {
      // Reset to initial state
      setAdjustedPosition(position);
      setStyle({});

      // Use requestAnimationFrame to wait for DOM to be painted before measuring
      const rafId = requestAnimationFrame(() => {
        if (!popoverRef.current) return;

        const popoverRect = popoverRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const padding = 16;

        let newPosition = position;
        const customStyle: React.CSSProperties = {};

        // Check if popover overflows right edge
        if (popoverRect.right > viewportWidth - padding) {
          // Align to right edge with padding
          customStyle.left = "auto";
          customStyle.right = `${padding}px`;
          customStyle.transform = "none";
        } else if (popoverRect.left < padding) {
          // Align to left edge with padding
          customStyle.left = `${padding}px`;
          customStyle.right = "auto";
          customStyle.transform = "none";
        }

        // Check vertical overflow
        if (popoverRect.bottom > viewportHeight) {
          if (position === "bottom") {
            newPosition = "top";
          }
        } else if (popoverRect.top < 0) {
          if (position === "top") {
            newPosition = "bottom";
          }
        }

        setAdjustedPosition(newPosition);
        setStyle(customStyle);
      });

      return () => cancelAnimationFrame(rafId);
    }
  }, [isOpen, position]);

  useEffect(() => {
    if (trigger_type === "click" && isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, trigger_type, handleClickOutside]);

  return (
    <div className={`popover-wrapper ${className}`}>
      <div
        ref={triggerRef}
        className={`popover-trigger ${triggerClassName}`}
        onClick={trigger_type === "click" ? handleToggle : undefined}
        onMouseEnter={
          trigger_type === "hover" ? () => setIsOpen(true) : undefined
        }
        onMouseLeave={
          trigger_type === "hover" ? () => setIsOpen(false) : undefined
        }
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={popoverRef}
          className={`popover-content popover-${adjustedPosition}`}
          style={{ ...style, maxWidth: maxWidth ? `${maxWidth}px` : undefined }}
          onMouseEnter={
            trigger_type === "hover" ? () => setIsOpen(true) : undefined
          }
          onMouseLeave={
            trigger_type === "hover" ? () => setIsOpen(false) : undefined
          }
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Popover;
