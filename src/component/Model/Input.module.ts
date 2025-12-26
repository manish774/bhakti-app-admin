export interface InputProps<T> {
  onchangeHandler: (value: React.ChangeEvent<HTMLInputElement>) => any;
  type?: "number" | "text" | "email" | "file" | "checkbox" | "range";
  max?: number;
  min?: number;
  value: T;
  label?: JSX.Element | string | number;
  labelPosition?: "left" | "right" | "above" | "below";
  placeholder?: string;
  multiple?: boolean;
  otherProps?: Record<string, number>;
  style?: React.CSSProperties;
  className?: string;
  debounceTime?: number;
  disabled?: boolean;
  id?: string;
  key?: string | number;
}
