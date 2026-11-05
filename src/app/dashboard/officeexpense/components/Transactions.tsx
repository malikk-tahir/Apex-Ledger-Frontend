"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTransactions, useDeleteTransaction } from "@/hooks/useExpenses";
import { getDefaultDates } from "@/lib/utils"; 
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel ,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Receipt, 
  Trash2, 
  ExternalLink, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Calendar, 
  Filter 
} from "lucide-react";
import Pagination from "@/components/Pagination";
import ImagePreviewDialog from "@/components/ImagePreviewDialogue";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialogue";

interface FilterFormValues {
  type: string;
  startDate: string;
  endDate: string;
}

export default function Transactions() {
  const [page, setPage] = useState(1);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Delete Dialog States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  // Active filters applied to the query hook
  const [filters, setFilters] = useState<{ type?: string; startDate?: string; endDate?: string }>({
    ...getDefaultDates(),
    type: "all",
  });

  const defaultDates = getDefaultDates();

  const form = useForm<FilterFormValues>({
    defaultValues: {
      type: "all",
      startDate: defaultDates.startDate,
      endDate: defaultDates.endDate,
    },
  });

  // Pass page and current active filters to query hook
  const { data, isLoading, isError, refetch } = useTransactions({
    page,
    ...(filters.type && filters.type !== "all" ? { type: filters.type } : {}),
    ...(filters.startDate ? { startDate: filters.startDate } : {}),
    ...(filters.endDate ? { endDate: filters.endDate } : {}),
  });

  const { mutate: deleteTransaction, isPending: isDeleting } = useDeleteTransaction();

  const transactions = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || page;

  const onSubmitFilters = (values: FilterFormValues) => {
    setPage(1); // Reset to first page on filter application
    setFilters({
      type: values.type,
      startDate: values.startDate,
      endDate: values.endDate,
    });
  };

  const handleResetFilters = () => {
    const freshDates = getDefaultDates();
    form.reset({
      type: "all",
      startDate: freshDates.startDate,
      endDate: freshDates.endDate,
    });
    setPage(1);
    setFilters({
      type: "all",
      startDate: freshDates.startDate,
      endDate: freshDates.endDate,
    });
  };

  const handleDeleteClick = (id: string) => {
    setSelectedTxId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedTxId) return;

    deleteTransaction(selectedTxId, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setSelectedTxId(null);
      },
    });
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm space-y-6">
      
      {/* Section Header */}
      <div className="border-b border-border pb-4">
        <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
          <Receipt className="w-5 h-5 text-emerald-500 shrink-0" /> Office Transactions & Ledger
        </h2>
        <p className="text-xs text-muted-foreground">Manage incoming income, operational expenses, and receipts.</p>
      </div>

      {/* Filter Bar (React Hook Form + Shadcn) */}
      <div className="bg-background border border-border rounded-xl p-3 sm:p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitFilters)} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
            
            {/* Type Filter */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                    Transaction Type
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-card border-border text-xs sm:text-sm text-foreground h-10 rounded-xl">
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card text-card-foreground border border-border shadow-md rounded-xl">
                      <SelectItem value="all" className="text-xs sm:text-sm">All Types</SelectItem>
                      <SelectItem value="in" className="text-xs sm:text-sm">Money In (Income)</SelectItem>
                      <SelectItem value="out" className="text-xs sm:text-sm">Money Out (Expense)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-medium text-destructive mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                    Start Date
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="date"
                        {...field}
                        className="bg-card border-border h-10 text-xs sm:text-sm text-foreground block w-full rounded-xl px-3 dark:[color-scheme:dark] dark:invert"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-destructive mt-1" />
                </FormItem>
              )}
            />

            {/* End Date */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                    End Date
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="date"
                        {...field}
                        className="bg-card border-border h-10 text-xs sm:text-sm text-foreground block w-full rounded-xl px-3 dark:[color-scheme:dark] dark:invert"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-destructive mt-1" />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1 sm:pt-0">
              <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-semibold h-9 cursor-pointer gap-1.5 shadow-xs">
                <Filter className="w-3.5 h-3.5" /> Filter
              </Button>
              <Button type="button" variant="outline" onClick={handleResetFilters} className="text-xs h-9 border-border cursor-pointer px-3">
                Reset
              </Button>
            </div>

          </form>
        </Form>
      </div>

      {/* Content Body */}
      {isLoading ? (
        <div className="space-y-3 pt-2">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-xl text-center space-y-2">
          <p className="text-sm font-medium text-foreground">Failed to load transactions</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="cursor-pointer">
            Try Again
          </Button>
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-xl text-center space-y-2">
          <Receipt className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">No transactions found</p>
          <p className="text-xs text-muted-foreground">Try altering your date range or add a new entry.</p>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Responsive Table Container with smooth horizontal scroll on mobile */}
          <div className="w-full overflow-x-auto border border-border rounded-xl shadow-xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[650px]">
              <thead className="bg-secondary/50 border-b border-border text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="p-3 sm:p-4">Purpose / Category</th>
                  <th className="p-3 sm:p-4">Type</th>
                  <th className="p-3 sm:p-4">Method</th>
                  <th className="p-3 sm:p-4">Date</th>
                  <th className="p-3 sm:p-4">Amount</th>
                  <th className="p-3 sm:p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {transactions.map((tx: any) => (
                  <tr key={tx._id} className="hover:bg-secondary/20 transition-colors">
                    
                    <td className="p-3 sm:p-4">
                      <div className="font-bold text-foreground whitespace-nowrap">{tx.purpose}</div>
                      {tx.receiptScreenshotUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewImageUrl(tx.receiptScreenshotUrl)}
                          className="text-accent hover:underline flex items-center gap-1 font-medium bg-transparent border-none p-0 cursor-pointer text-[11px] mt-0.5 whitespace-nowrap"
                        >
                          View Receipt <ExternalLink className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap">No receipt</span>
                      )}
                    </td>

                    <td className="p-3 sm:p-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        tx.type === "in"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                      }`}>
                        {tx.type === "in" ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {tx.type === "in" ? "Income" : "Expense"}
                      </span>
                    </td>

                    <td className="p-3 sm:p-4 capitalize text-muted-foreground font-medium whitespace-nowrap">
                      {tx.paymentType?.replace("_", " ")}
                    </td>

                    <td className="p-3 sm:p-4 text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        {tx.transactionDate ? new Date(tx.transactionDate).toLocaleDateString() : "N/A"}
                      </div>
                    </td>

                    <td className="p-3 sm:p-4 whitespace-nowrap">
                      <span className={`font-extrabold ${tx.type === "in" ? "text-emerald-500" : "text-foreground"}`}>
                        {tx.type === "in" ? "+" : "-"} PKR {tx.amount?.toLocaleString()}
                      </span>
                    </td>

                    <td className="p-3 sm:p-4 text-right whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(tx._id)}
                        disabled={isDeleting}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />

        </div>
      )}

      {/* Image Preview Dialog for Receipts */}
      <ImagePreviewDialog
        imageUrl={previewImageUrl}
        onClose={() => setPreviewImageUrl(null)}
        title="Transaction Receipt Proof"
        description="Viewing attached receipt screenshot."
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedTxId(null);
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        title="Delete Transaction?"
        description="This action cannot be undone. This will permanently remove this transaction and update your company financial balance."
        confirmText="Delete Transaction"
      />

    </div>
  );
}