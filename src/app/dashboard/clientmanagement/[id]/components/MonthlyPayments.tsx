"use client";

import React, { useState } from "react";
import { useMonthPayments, useDeleteClientPayment } from "@/hooks/useClientPayments";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialogue";
import ImagePreviewDialog from "@/components/ImagePreviewDialogue";
import {
  FileText,
  Trash2,
  Eye,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Dot
} from "lucide-react";

interface MonthlyPaymentsProps {
  clientId: string;
  monthYear: string; // Format: "YYYY-MM" (e.g. "2026-10")
}
export default function MonthlyPayments({ clientId, monthYear }: MonthlyPaymentsProps) {
  const { data, isLoading, isError, refetch } = useMonthPayments(clientId, monthYear);
  const { mutate: deletePayment, isPending: isDeleting } = useDeleteClientPayment();

  // Modal States
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 bg-card border border-border rounded-xl text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
        <p className="text-sm font-medium text-foreground">Failed to load monthly payments</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  const { month, data: payments } = data;
  const contractPaidAmount = month.contractPaidAmount ?? 0;
  const extraExpensesAmount = month.extraExpensesAmount ?? 0;
  const paidAmount = month.paidAmount ?? contractPaidAmount + extraExpensesAmount;
  const remainingBalance = month.remainingBalance ?? 0;

  // Status Badge Styling Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3" /> Paid
          </span>
        );
      case "partial":
        return (
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" /> Partial
          </span>
        );
      default:
        return (
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-1 w-fit">
            <AlertCircle className="w-3 h-3" /> Unpaid
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Month Summary Header Card */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Billing Period: {month.monthYear}
            </span>
            <h2 className="text-xl font-bold text-foreground tracking-tight mt-0.5">
              Monthly Ledger Summary
            </h2>
          </div>
          {getStatusBadge(month.status)}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t border-border text-sm">
          <div>
            <p className="text-[11px] text-muted-foreground uppercase font-medium">Contract Amount</p>
            <p className="font-bold text-foreground text-base">
              PKR {month.contractAmount?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground uppercase font-medium">Contract Paid</p>
            <p className="font-bold text-emerald-500 text-base">
              PKR {contractPaidAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground uppercase font-medium">Extra Expenses</p>
            <p className="font-bold text-amber-500 text-base">
              PKR {extraExpensesAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground uppercase font-medium">Total Logged</p>
            <p className="font-bold text-foreground text-base">
              PKR {paidAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground uppercase font-medium">Remaining Balance</p>
            <p className="font-bold text-destructive text-base">
              PKR {remainingBalance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Payments List */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg text-foreground tracking-tight">
            Payments Log ({payments.length})
          </h3>
          <span className="text-xs text-muted-foreground">Sorted by recent</span>
        </div>

        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-xl text-center space-y-2">
            <FileText className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              No transactions recorded for {month.monthYear}
            </p>
            <p className="text-xs text-muted-foreground">
              Payments logged for this month will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment: any) => {
              const isExpense = payment.category !== "client_amount";

              return (
                <div
                  key={payment._id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-background border border-border rounded-xl gap-4 transition-all hover:border-border/80"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-foreground text-base">
                        PKR {payment.amountPaid?.toLocaleString()}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 capitalize rounded-full font-semibold border ${
                          isExpense
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        }`}
                      >
                        {payment.category.replace("_", " ")}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded uppercase font-semibold bg-secondary text-secondary-foreground">
                        {payment.paymentType?.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        Date: {new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="capitalize">Status: {payment.status}</span>
                    </div>

                    {payment.note?.trim() && (
                      <p className="text-xs text-muted-foreground pt-0.5">
                        Note: <span className="text-foreground">{payment.note}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                    {/* Preview Receipt Button */}
                    {payment.paymentScreenshotUrl ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewImage(payment.paymentScreenshotUrl)}
                        className="border-border text-foreground hover:bg-secondary gap-1.5 cursor-pointer text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" /> Receipt
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground italic px-2">No receipt</span>
                    )}

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPaymentToDelete(payment._id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ImagePreviewDialog
        imageUrl={previewImage}
        onClose={() => setPreviewImage(null)}
      />

      <ConfirmDeleteDialog
        isOpen={Boolean(paymentToDelete)}
        onClose={() => setPaymentToDelete(null)}
        isDeleting={isDeleting}
        description="This action cannot be undone. This will permanently delete this payment transaction and recalculate the client's monthly ledger balance."
        confirmText="Delete Payment"
        onConfirm={() => {
          if (paymentToDelete) {
            deletePayment(paymentToDelete, {
              onSuccess: () => setPaymentToDelete(null),
            });
          }
        }}
      />
    </div>
  );
}