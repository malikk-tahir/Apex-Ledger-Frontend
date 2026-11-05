"use client";

import React, { useState } from "react";
import { useClientPayments, useDeleteClientPayment } from "@/hooks/useClientPayments";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  Trash2, 
  Eye, 
  AlertCircle, 
  Wallet 
} from "lucide-react";
import Pagination from "@/components/Pagination";
import ImagePreviewDialog from "@/components/ImagePreviewDialogue";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialogue";

interface ClientOneTimePaymentSectionProps {
  clientId: string;
  clientType: string;
}

export default function ClientOneTimePayment({ clientId, clientType }: ClientOneTimePaymentSectionProps) {
  const isOneTime = clientType === "one_time" || clientType === "project";
  
  // Pagination state
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useClientPayments(clientId, { page });
  const { mutate: deletePayment, isPending: isDeleting } = useDeleteClientPayment();

  // Dialog States
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);

  if (!isOneTime && clientType === "retainer") {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-4 sm:p-6 bg-card border border-border rounded-xl text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
        <p className="text-sm font-medium text-foreground">Failed to load payment transactions</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="cursor-pointer">
          Try Again
        </Button>
      </div>
    );
  }

  const payments = data.data || [];
  const totalPages = data.totalPages || 1;
  const currentPage = data.currentPage || page;

  const totalPaid = payments.reduce((sum: number, p: any) => sum + (p.amountPaid || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* 1. Summary Card */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 shrink-0" /> Project Payment Overview
            </span>
            <h2 className="text-xl font-bold text-foreground tracking-tight mt-0.5 truncate">
              Transaction History
            </h2>
          </div>
          <span className="text-xs px-3 py-1 rounded-full font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
            {data.totalCount || payments.length} Payment(s) Recorded
          </span>
        </div>

        <div className="pt-4 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm">
          <span className="text-muted-foreground uppercase font-medium text-xs">Total Amount Collected</span>
          <span className="font-bold text-emerald-500 text-lg">PKR {totalPaid.toLocaleString()}</span>
        </div>
      </div>

      {/* 2. Payments Table Container */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="font-bold text-lg text-foreground tracking-tight">Logged Payments</h3>
          <span className="text-xs text-muted-foreground">One-time / Milestone invoicing</span>
        </div>

        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-xl text-center space-y-2">
            <FileText className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">No payments recorded yet</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Click the "Add Payment" button above to log receipts for this project.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Responsive Table with Horizontal Scroll on Smaller Screens */}
            <div className="w-full overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border text-xs text-muted-foreground uppercase font-medium">
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Billing Month</th>
                    <th className="py-3 px-4">Payment Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm bg-background">
                  {payments.map((payment: any) => (
                    <tr key={payment._id} className="hover:bg-secondary/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground whitespace-nowrap">
                        PKR {payment.amountPaid?.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-xs px-2.5 py-1 rounded uppercase font-semibold bg-secondary text-secondary-foreground">
                          {payment.paymentType?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                        {payment.monthYear || "N/A"}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                        {new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                        {payment.paymentScreenshotUrl ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPreviewImage(payment.paymentScreenshotUrl)}
                            className="border-border text-foreground hover:bg-secondary gap-1 cursor-pointer text-xs h-8 px-2.5"
                          >
                            <Eye className="w-3.5 h-3.5" /> Receipt
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground italic px-2">No receipt</span>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPaymentToDelete(payment._id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Component */}
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}
      </div>

      {/* 3. Reusable Dialog Modals */}
      <ImagePreviewDialog 
        imageUrl={previewImage} 
        onClose={() => setPreviewImage(null)} 
      />

      <ConfirmDeleteDialog
        isOpen={Boolean(paymentToDelete)}
        onClose={() => setPaymentToDelete(null)}
        isDeleting={isDeleting}
        description="This action cannot be undone. This will permanently delete this transaction record."
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