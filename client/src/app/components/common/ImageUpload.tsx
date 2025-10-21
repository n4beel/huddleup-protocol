"use client";
import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  className?: string;
  onChange?: (file: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ className = "", onChange }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      if (onChange) onChange(file);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreview(null);
    if (onChange) onChange(null);
  };

  return (
    <div className={`flex items-center justify-center w-full ${className}`}>
      <label
        htmlFor="dropzone-file"
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer 
        transition-all duration-200 relative overflow-hidden`}
      >
        {!preview ? (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={preview}
              alt="Preview"
              className="object-cover w-full h-full rounded-lg"
                fill
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                removeImage();
              }}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <input
          id="dropzone-file"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default ImageUpload;
