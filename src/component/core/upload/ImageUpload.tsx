import React, { useState, useRef } from "react";
import "./ImageUpload.css";

interface ImageUploadProps {
  onFileSelect: (files: File[]) => void;
  label?: string;
  maxFiles?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onFileSelect,
  label,
  maxFiles = 5,
}) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (selectedFiles: File[]) => {
    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds 5MB`);
        continue;
      }

      validFiles.push(file);
    }

    return validFiles;
  };

  const generatePreviews = (files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const incoming = Array.from(selectedFiles);
    const allowedCount = maxFiles - files.length;

    if (allowedCount <= 0) {
      alert(`You can upload maximum ${maxFiles} images`);
      return;
    }

    const validated = validateFiles(incoming.slice(0, allowedCount));
    if (!validated.length) return;

    setFiles((prev) => {
      const updated = [...prev, ...validated];
      onFileSelect(updated);
      return updated;
    });

    generatePreviews(validated);
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      onFileSelect(updated);
      return updated;
    });

    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="image-upload">
      {label && <h2 className="image-upload__label">{label}</h2>}

      {files.length < maxFiles && (
        <div
          className={`image-upload__dropzone ${isDragging ? "dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
        >
          <p className="image-upload__hint">
            Drag & drop images or click to upload
          </p>
          <p className="image-upload__subtext">
            Max {maxFiles} images • Each &lt; 5MB
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            style={{ display: "none" }}
          />
        </div>
      )}
      {previews.length > 0 && (
        <div className="image-upload__preview-grid">
          {previews.map((src, index) => (
            <div key={index} className="image-upload__preview-item">
              <img
                src={src}
                alt={`Preview ${index}`}
                className="image-upload__preview-img"
              />
              <button
                type="button"
                className="image-upload__remove-btn"
                onClick={() => handleRemove(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
