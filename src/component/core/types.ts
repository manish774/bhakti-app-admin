export interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  type?: "text" | "email" | "password" | "number" | "textarea" | "file";
  error?: string;
}
