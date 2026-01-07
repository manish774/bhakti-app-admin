import React, { useState } from "react";
import Select from "react-select";

/* ========================================
 * Types
 * ====================================== */

export interface SelectOption {
  label: string;
  value: string;
}

interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  type?: string;
  error?: string;
  numberOfFields?: number;
  rows?: number;
  multiple?: boolean;
  options?: SelectOption[];

  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    index?: number
  ) => void;

  onFileSelect?: (files: File[], index?: number) => void;
}

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  label?: string;
}

/* ========================================
 * Image Upload
 * ====================================== */

const ImageUpload: React.FC<ImageUploadProps> = ({ onFileSelect }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
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
  );
};

/* ========================================
 * InputField
 * ====================================== */

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  error,
  numberOfFields,
  onChange,
  onFileSelect,
  rows = 3,
  options,
  multiple,
  ...rest
}) => {
  const [activeFields, setActiveFields] = useState(1);

  /* ---------- Styles ---------- */

  const inputStyle: React.CSSProperties = {
    height: type === "textarea" ? "auto" : "35px",
    padding: "10px 14px",
    borderRadius: "4px",
    border: `2px solid ${error ? "#8b0000" : "#1a1a1a"}`,
    outline: "none",
    fontSize: "14px",
    background: error ? "#fff5f5" : rest.disabled ? "#d4c4a8" : "#f5eed8",
    color: "#000",
    width: "100%",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "6px",
    display: "block",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "6px 12px",
    fontSize: "13px",
    background: "#f5eed8",
    border: "2px solid #1a1a1a",
    borderRadius: "4px",
    cursor: "pointer",
  };

  /* ---------- Handlers ---------- */

  const handleAddMore = () => {
    if (numberOfFields && activeFields < numberOfFields) {
      setActiveFields((p) => p + 1);
    }
  };

  const handleRemove = () => {
    if (activeFields > 1) {
      setActiveFields((p) => p - 1);
    }
  };

  /* ---------- Renderer ---------- */

  const renderField = (index: number) => {
    if (type === "textarea") {
      return (
        <textarea
          key={index}
          aria-index={`${index}`}
          //@ts-expect-error: expecting
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          rows={rows}
          style={inputStyle}
          onChange={(e) => onChange?.(e, index)}
        />
      );
    }

    /* FILE */
    if (type === "file") {
      return (
        <ImageUpload
          key={index}
          onFileSelect={(file) => onFileSelect?.([file], index)}
        />
      );
    }

    /* SELECT (single + multi) */
    if (type === "select") {
      return (
        <Select
          //@ts-expect-error no issue
          options={options}
          isMulti={multiple}
          value={[]}
          {...rest}
          //@ts-expect-error no issue
          onChange={(e) => onChange?.(e, index)}
        />
      );
    }

    /* DEFAULT INPUT */
    return (
      <input
        key={index}
        type={type}
        {...rest}
        style={inputStyle}
        onChange={(e) => onChange?.(e, index)}
      />
    );
  };

  /* ---------- JSX ---------- */

  return (
    <div style={{ marginBottom: "16px" }}>
      {label && (
        <label style={labelStyle}>
          {label}
          {rest.required && <span style={{ color: "#8b0000" }}> *</span>}
        </label>
      )}

      {numberOfFields ? (
        <>
          {Array.from({ length: activeFields }).map((_, i) => (
            <div
              key={i}
              className="multi-field-row"
              style={{ marginBottom: "8px" }}
            >
              {renderField(i)}
              {activeFields > 1 && (
                <button
                  type="button"
                  onClick={handleRemove}
                  style={buttonStyle}
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          {activeFields < numberOfFields && (
            <button type="button" onClick={handleAddMore} style={buttonStyle}>
              + Add More ({activeFields}/{numberOfFields})
            </button>
          )}
        </>
      ) : (
        renderField(0)
      )}

      {error && (
        <div style={{ color: "#8b0000", fontSize: "12px", marginTop: "4px" }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default InputField;
