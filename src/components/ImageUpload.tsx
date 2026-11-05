"use client";

import React, { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  label?: string;
  error?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Upload Screenshot / Image",
  error,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    typeof value === "string" ? value : value instanceof File ? URL.createObjectURL(value) : null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}

      {preview ? (
        <div className="relative w-full h-40 rounded-xl border border-border overflow-hidden bg-secondary/30 flex items-center justify-center group">
          <img src={preview} alt="Upload Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="gap-1.5 cursor-pointer"
            >
              <X className="w-4 h-4" /> Remove Image
            </Button>
          </div>
        </div>
      ) : (
        <label className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-accent/60 transition-colors bg-card text-center group">
          <div className="w-10 h-10 rounded-full bg-secondary text-muted-foreground flex items-center justify-center mb-2 group-hover:text-accent transition-colors">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-foreground">
            Click to upload <span className="text-muted-foreground font-normal">or drag and drop</span>
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">SVG, PNG, JPG or WEBP (Max 5MB)</p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}