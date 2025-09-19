"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import IconFile from "@/public/file.svg";
import IconFileCheck from "@/public/file-check.svg";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  maxSize?: number; // in MB
  allowedTypes?: string[];
}

export default function ImageUpload({
  onImageUpload,
  maxSize = 10,
  allowedTypes = [],
}: ImageUploadProps) {
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    setError(null);
    // Check file type
    // if (!allowedTypes.includes(file.type)) {
    //   setError("Unsupported file format. Please upload a text file.");
    //   return;
    // }

    // Check file size (in bytes)
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSize}MB.`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    setFileName(file.name);

    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Pass file to parent component
    onImageUpload(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-2 lg:mb-4">
      <div
        role="presentation"
        tabIndex={0}
        className={`group relative flex pt-3 pb-3 cursor-pointer items-center justify-center rounded-xl border backdrop-blur-md ${isDragging
            ? "border-purple-500/60 bg-black/70"
            : "border-purple-500/30 bg-black/60 hover:bg-black/70 hover:border-purple-500/40 hover:shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
          } transition-all duration-300`}
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          accept={allowedTypes.join(',')}
          tabIndex={-1}
          type="file"
          className="hidden"
          onChange={handleInputChange}
        />

        {previewUrl ? (
          <div className="relative z-10 text-center">
            <div className="mb-3">
              <IconFileCheck width={85} height={85} className="m-auto text-purple-400" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-purple-400">
                Click To Change Image
              </p>
              <p className="text-xs text-gray-400 mt-2">
                File Name: <span className="text-white">{fileName}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="relative z-10 text-center">
            <div className="mb-3">
              <IconFile width={70} height={70} className="m-auto text-purple-400" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-purple-400">
                Drag and drop image here or click to upload
              </p>
              <p className="text-xs text-gray-400">
                Supported formats: TMP
              </p>
              <div className="text-[10px] text-gray-500">Max Size: {maxSize}MB</div>
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}