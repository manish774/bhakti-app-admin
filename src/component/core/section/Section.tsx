import { type ReactNode } from "react";
import "./section.css";
interface SectionProps {
  children: ReactNode;
  className?: string;
}

interface SubComponentProps {
  children: ReactNode;
  className?: string;
}

const SectionRoot = ({ children, className = "" }: SectionProps) => {
  return <section className={`section ${className}`}>{children}</section>;
};

const Title = ({ children, className = "" }: SectionProps) => {
  return <h2 className={`section-title ${className}`}>{children}</h2>;
};

const Content = ({ children, className = "" }: SubComponentProps) => (
  <div className={`section-content ${className}`}>{children}</div>
);

export const Section = Object.assign(SectionRoot, {
  Title,
  Content,
});
