"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
}

export default function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete this item and update related records.",
  confirmText = "Delete",
}: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="w-[92vw] max-w-md bg-card border border-border text-foreground p-4 sm:p-6 rounded-2xl">
        <AlertDialogHeader className="space-y-1 text-left">
          <AlertDialogTitle className="text-lg sm:text-xl font-bold tracking-tight">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-4">
          <AlertDialogCancel
            onClick={onClose}
            className="border-border text-foreground hover:bg-secondary cursor-pointer w-full sm:w-auto h-10 sm:h-9 text-sm m-0"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer w-full sm:w-auto h-10 sm:h-9 text-sm font-semibold m-0"
          >
            {isDeleting ? "Deleting..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}