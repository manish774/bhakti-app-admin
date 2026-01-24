import { tss } from "tss-react";

export const useStyles = tss
  .withParams<{
    type?: string;
    error?: boolean;
    disabled?: boolean;
    loading?: boolean;
  }>()
  .create(({ type, error, disabled, loading }) => ({
    input: {
      height: type === "textarea" ? "auto" : "35px",
      padding: "10px 14px",
      borderRadius: "4px",
      border: `2px solid ${error ? "#8b0000" : "#1a1a1a"}`,
      outline: "none",
      fontSize: "14px",
      background: error
        ? "#fff5f5"
        : disabled || loading
          ? "#d4c4a8"
          : "#f5eed8",
      color: loading ? "#666" : "#000",
      width: "100%",
      boxSizing: "border-box",
      cursor: loading ? "wait" : "auto",
    },
  }));
