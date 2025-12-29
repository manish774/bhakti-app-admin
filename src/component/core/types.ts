export interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "textarea"
    | "file"
    | "checkbox"
    | "select";

  error?: string;
  numberOfFields?: number;
  options?: { name: string; value: string }[];
  multiple?: boolean;
}
