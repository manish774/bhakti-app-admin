import React from "react";
import type { InputFieldProps } from "../types";
import ImageUpload from "../upload/ImageUpload";

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  error,
  ...rest
}) => {
  const inputStyle: React.CSSProperties = {
    height: type === "textarea" ? "auto" : "35px",
    minHeight: type === "textarea" ? "35px" : undefined,
    padding: "10px 14px",
    borderRadius: "4px",
    border: `2px solid ${error ? "#8b0000" : "#1a1a1a"}`,
    outline: "none",
    fontSize: "14px",
    background: error ? "#fff5f5" : rest.disabled ? "#d4c4a8" : "#f5eed8",
    color: "#000000",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    transition: "all 0.2s ease",
    width: "100%",
    boxSizing: "border-box",
    resize: type === "textarea" ? "vertical" : undefined,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: 600,
    color: "#000000",
    marginBottom: "6px",
    display: "block",
  };

  const errorStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#8b0000",
    marginTop: "4px",
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      {label && (
        <label style={labelStyle}>
          {label}
          {rest.required && <span style={{ color: "#8b0000" }}>*</span>}
        </label>
      )}

      {type === "textarea" ? (
        <textarea
          //@ts-expect-error ignore
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          style={inputStyle}
        />
      ) : type === "file" ? (
        //@ts-expect-error: ignore
        <ImageUpload onFileSelect={rest.onChange} label="" />
      ) : (
        <input type={type} {...rest} style={inputStyle} />
      )}

      {error && <div style={errorStyle}>{error}</div>}
    </div>
  );
};

export default InputField;

// Usage:
/*
<InputField
  label="Username"
  placeholder="Enter username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  required
  maxLength={20}
  autoComplete="username"
/>

<InputField
  label="Email"
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error="Invalid email address"
  autoFocus
/>

<InputField
  label="Age"
  type="number"
  min={18}
  max={100}
  value={age}
  onChange={(e) => setAge(e.target.value)}
/>

<InputField
  label="Description"
  type="textarea"
  placeholder="Enter description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={5}
/>
*/
