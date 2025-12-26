import { size, theme } from "../../Model/Default";

export type BadgeProps<T> = {
  label: T;
  bgColor?: string;
  size?: size;
  type?: "bordered" | "default";
  theme?: theme;
  style?: React.CSSProperties;
  title?: React.ReactElement | string;
};

export interface CircleBadgeProps<T> {
  labels: T[];
  size?: size;
  type?: theme;
  customColor?: { background: string; border: string };
  style?: React.CSSProperties;
  title?: React.ReactElement | string;
}
