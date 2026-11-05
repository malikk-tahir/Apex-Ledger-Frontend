"use client";

import React, { useState } from "react";
import { useEmployeeSalaries, useUndoSalaryPayment } from "@/hooks/useEmployeeSalary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Wallet, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  CreditCard, 
  ExternalLink,
  Calendar
} from "lucide-react";
import Pagination from "@/components/Pagination";
import PaySalary from "./PaySalary";
import ImagePreviewDialog from "@/components/ImagePreviewDialogue"; 

interface EmployeeSalariesSectionProps {
  employeeId: string;
  baseSalary: number;
}

export default function EmployeeSalaries({
  employeeId,
  baseSalary,
}: EmployeeSalariesSectionProps) {
  const [page, setPage] = useState(1);
  const [selectedSalaryForPayment, setSelectedSalaryForPayment] = useState<any | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  
  // State for image preview dialog
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useEmployeeSalaries(employeeId, { page });
  const { mutate: undoPayment, isPending: isUndoing } = useUndoSalaryPayment();

  const salaries = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || page;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-500" /> Salary Ledger
          </h2>
          <p className="text-xs text-muted-foreground">Monthly generated salary records and payment history.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 pt-2">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-xl text-center space-y-2">
          <p className="text-sm font-medium text-foreground">Failed to load salary records</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="cursor-pointer">
            Try Again
          </Button>
        </div>
      ) : salaries.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-xl text-center space-y-2">
          <Wallet className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">No salary records found</p>
          <p className="text-xs text-muted-foreground">Monthly salary sheets will automatically appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          
          <div className="space-y-3">
            {salaries.map((salary: any) => (
              <div
                key={salary._id}
                className="p-4 bg-background border border-border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-accent/40 transition-all shadow-xs"
              >
                
                <div className="space-y-1 min-w-[150px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-foreground text-base">
                      {salary.salaryMonth}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase flex items-center gap-1 ${
                      salary.isPaid
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    }`}>
                      {salary.isPaid ? (
                        <><CheckCircle2 className="w-3 h-3" /> Paid</>
                      ) : (
                        <><XCircle className="w-3 h-3" /> Pending</>
                      )}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Due: {salary.dueDate ? new Date(salary.dueDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>

                <div className="space-y-0.5 text-xs text-muted-foreground flex-1">
                  {salary.isPaid ? (
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      <span>Method: <strong className="text-foreground">{salary.paymentType || "N/A"}</strong></span>
                      <span>Paid Date: <strong className="text-foreground">{salary.paymentDate ? new Date(salary.paymentDate).toLocaleDateString() : "N/A"}</strong></span>
                      {salary.paymentScreenshotUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewImageUrl(salary.paymentScreenshotUrl)}
                          className="text-accent hover:underline flex items-center gap-1 font-medium bg-transparent border-none p-0 cursor-pointer text-xs"
                        >
                          View Receipt <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <span>Status: Awaiting processing and payout</span>
                  )}
                </div>

                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 pt-3 md:pt-0 border-t md:border-0 border-border">
                  <div className="text-left md:text-right">
                    <span className="block text-[10px] uppercase font-semibold text-muted-foreground">Amount</span>
                    <span className="font-extrabold text-foreground text-base">
                      PKR {(salary.amountPaid || baseSalary)?.toLocaleString()}
                    </span>
                  </div>

                  {salary.isPaid ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => undoPayment(salary._id)}
                      disabled={isUndoing}
                      className="gap-1.5 border-border hover:bg-destructive/10 hover:text-destructive text-xs cursor-pointer h-9 shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Undo
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedSalaryForPayment(salary);
                        setIsPayModalOpen(true);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold cursor-pointer h-9 shrink-0 shadow-sm"
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Pay Salary
                    </Button>
                  )}
                </div>

              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />

        </div>
      )}

      <PaySalary
        salary={selectedSalaryForPayment}
        baseSalary={baseSalary}
        open={isPayModalOpen}
        onOpenChange={setIsPayModalOpen}
      />

      <ImagePreviewDialog
        imageUrl={previewImageUrl}
        onClose={() => setPreviewImageUrl(null)}
        title="Payment Receipt Screenshot"
        description="Viewing attached transaction proof for employee salary."
      />

    </div>
  );
}