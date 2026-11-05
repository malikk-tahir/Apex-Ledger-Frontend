"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = "",
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex items-center justify-between pt-4 border-t border-border ${className}`}
    >
      <p className="text-xs text-muted-foreground">
        Page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="h-8 px-2.5 cursor-pointer disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>

        <Button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="h-8 px-2.5 cursor-pointer disabled:opacity-40"
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;