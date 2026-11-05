"use client";

import React from "react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ImagePreviewDialogProps {
  imageUrl: string | null;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function ImagePreviewDialog({
  imageUrl,
  onClose,
  title = "Payment Receipt Screenshot",
  description = "Viewing attached transaction proof.",
}: ImagePreviewDialogProps) {
  return (
    <AlertDialog open={Boolean(imageUrl)} onOpenChange={onClose}>
      <AlertDialogContent className="w-[92vw] max-w-lg sm:max-w-xl bg-card border border-border text-foreground p-4 sm:p-6 rounded-2xl">
        <AlertDialogHeader className="space-y-1 text-left">
          <AlertDialogTitle className="text-lg sm:text-xl font-bold tracking-tight">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Responsive Image Container */}
        <div className="relative my-2 flex justify-center items-center overflow-hidden rounded-xl border border-border bg-background p-2 min-h-[220px] max-h-[55vh] sm:max-h-[65vh]">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Receipt Preview"
              width={600}
              height={600}
              className="max-h-[50vh] sm:max-h-[60vh] w-auto h-auto object-contain rounded-lg"
              unoptimized
            />
          )}
        </div>

        <AlertDialogFooter className="pt-2 sm:pt-4">
          <AlertDialogAction
            onClick={onClose}
            className="bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer w-full sm:w-auto h-10 sm:h-9 text-sm font-semibold"
          >
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}