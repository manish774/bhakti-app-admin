import React, { useState, useRef } from "react";

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onFileSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndPreview = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    onFileSelect(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndPreview(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) validateAndPreview(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div style={{ padding: "20px 0" }}>
      <h2>Temple Image *</h2>

      {preview ? (
        <div style={{ position: "relative" }}>
          <img
            src={preview}
            alt="Temple preview"
            style={{
              width: "100%",
              maxHeight: "350px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
          <button type="button" onClick={handleRemove}>
            Remove Image
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: "2px dashed #aaa",
            padding: "30px",
            textAlign: "center",
            borderRadius: "8px",
            cursor: "pointer",
            backgroundColor: isDragging ? "#f0f8ff" : "transparent",
          }}
        >
          <p>Drag & drop an image here, or click to select</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
