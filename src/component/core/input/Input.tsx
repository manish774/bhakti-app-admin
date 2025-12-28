import React, { useState } from "react";

interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  type?: string;
  error?: string;
  numberOfFields?: number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => void;
  onFileSelect?: (files: File[], index?: number) => void;
  rows?: number;
}

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  label: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onFileSelect }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{
          padding: "10px 14px",
          borderRadius: "4px",
          border: "2px solid #1a1a1a",
          background: "#f5eed8",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  error,
  numberOfFields,
  onChange,
  onFileSelect,
  rows = 3,
  ...rest
}) => {
  const [activeFields, setActiveFields] = useState<number>(1);

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
    marginBottom: "8px",
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

  const buttonStyle: React.CSSProperties = {
    marginTop: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: 500,
    color: "#000000",
    background: "#f5eed8",
    border: "2px solid #1a1a1a",
    borderRadius: "4px",
    cursor: "pointer",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    transition: "all 0.2s ease",
  };

  const handleAddMore = () => {
    if (numberOfFields && activeFields < numberOfFields) {
      setActiveFields(activeFields + 1);
    }
  };

  //@ts-expect-error: justddd jh
  const handleRemove = (indexToRemove: number) => {
    if (activeFields > 1) {
      setActiveFields(activeFields - 1);
    }
  };

  const renderField = (index: number) => {
    if (type === "textarea") {
      return (
        <div key={index} style={{ position: "relative" }}>
          <textarea
            aria-index={`${index}`}
            key={index}
            //@ts-expect-error: typecasting
            {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            onChange={(e) => onChange?.(e, index)}
            style={inputStyle}
            rows={rows}
            placeholder={`${rest.placeholder || ""} ${
              numberOfFields ? `(${index + 1}/${numberOfFields})` : ""
            }`}
          />
          {numberOfFields && activeFields > 1 && (
            <button
              type="button"
              onClick={() => handleRemove(index)}
              style={{
                ...buttonStyle,
                marginTop: "0",
                marginLeft: "8px",
                padding: "4px 12px",
                background: "#ffe0e0",
                border: "2px solid #8b0000",
                color: "#8b0000",
              }}
            >
              Remove
            </button>
          )}
        </div>
      );
    } else if (type === "file") {
      return (
        <div key={index} style={{ position: "relative", marginBottom: "8px" }}>
          <ImageUpload
            aria-index={`${index}`}
            key={index}
            onFileSelect={(file) => onFileSelect?.([file], index)}
            label={`${
              numberOfFields ? `Upload ${index + 1}/${numberOfFields}` : ""
            }`}
          />
          {numberOfFields && activeFields > 1 && (
            <button
              type="button"
              onClick={() => handleRemove(index)}
              style={{
                ...buttonStyle,
                marginTop: "8px",
                padding: "4px 12px",
                background: "#ffe0e0",
                border: "2px solid #8b0000",
                color: "#8b0000",
              }}
            >
              Remove
            </button>
          )}
        </div>
      );
    } else {
      return (
        <div
          key={index}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <input
            aria-index={`${index}`}
            type={type}
            {...rest}
            onChange={(e) => onChange?.(e, index)}
            style={{ ...inputStyle, marginBottom: "0", flex: 1 }}
            placeholder={`${rest.placeholder || ""} ${
              numberOfFields ? `(${index + 1}/${numberOfFields})` : ""
            }`}
          />
          {numberOfFields && activeFields > 1 && (
            <button
              type="button"
              onClick={() => handleRemove(index)}
              style={{
                ...buttonStyle,
                marginTop: "0",
                padding: "6px 12px",
                background: "#ffe0e0",
                border: "2px solid #8b0000",
                color: "#8b0000",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          )}
        </div>
      );
    }
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      {label && (
        <label style={labelStyle}>
          {label}
          {rest.required && <span style={{ color: "#8b0000" }}>*</span>}
        </label>
      )}

      {numberOfFields ? (
        <>
          {Array.from({ length: activeFields }, (_, i) => renderField(i))}

          {activeFields < numberOfFields && (
            <button
              type="button"
              onClick={handleAddMore}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e8ddc0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f5eed8";
              }}
            >
              + Add More ({activeFields}/{numberOfFields})
            </button>
          )}
        </>
      ) : (
        renderField(0)
      )}

      {error && <div style={errorStyle}>{error}</div>}
    </div>
  );
};
export default InputField;
