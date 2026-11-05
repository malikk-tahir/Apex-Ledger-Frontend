"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  createTransactionSchema, 
  CreateTransactionFormValues, 
  EXPENSE_PURPOSES, 
  TRANSACTION_TYPES, 
  TRANSACTION_PAYMENT_TYPES 
} from "@/schemaValidators/officeSchema";
import { useAddTransaction } from "@/hooks/useExpenses";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Receipt } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { formatDateForInput } from '@/lib/utils';

interface AddExpenseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatLabel = (val: string) => {
  return val
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function AddExpense({ open, onOpenChange }: AddExpenseProps) {
  const { mutate: addTransaction, isPending } = useAddTransaction();

  const form = useForm<CreateTransactionFormValues>({
    resolver: zodResolver(createTransactionSchema) as any,
    defaultValues: {
      type: "out",
      purpose: "Office Rent",
      amount: 0,
      paymentType: "bank_transfer",
      transactionDate: formatDateForInput(new Date()),
      file: null,
    },
  });

  const onSubmit = (values: CreateTransactionFormValues) => {
    const formData = new FormData();
    formData.append("type", values.type);
    formData.append("purpose", values.purpose);
    formData.append("amount", values.amount.toString());
    formData.append("paymentType", values.paymentType);
    formData.append("transactionDate", values.transactionDate);

    if (values.file instanceof File) {
      formData.append("file", values.file);
    }

    addTransaction(formData, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[92vw] max-w-lg bg-card border border-border text-foreground p-4 sm:p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
        
        <AlertDialogHeader className="space-y-1 text-left">
          <AlertDialogTitle className="text-lg sm:text-xl font-bold tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-500" /> Add New Transaction
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Record incoming revenue or office expenses with optional receipt proofs.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            
            {/* Transaction Type & Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Type: In / Out */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                      Type
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-background border-border text-xs sm:text-sm text-foreground h-10 rounded-xl">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card text-card-foreground border border-border shadow-md rounded-xl">
                        {TRANSACTION_TYPES.map((t) => (
                          <SelectItem key={t} value={t} className="text-xs sm:text-sm">
                            {t === "in" ? "Money In (Income)" : "Money Out (Expense)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-medium text-destructive mt-1" />
                  </FormItem>
                )}
              />

              {/* Payment Type */}
              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                      Payment Method
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-background border-border text-xs sm:text-sm text-foreground h-10 rounded-xl">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card text-card-foreground border border-border shadow-md rounded-xl">
                        {TRANSACTION_PAYMENT_TYPES.map((pt) => (
                          <SelectItem key={pt} value={pt} className="text-xs sm:text-sm">
                            {formatLabel(pt)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-medium text-destructive mt-1" />
                  </FormItem>
                )}
              />

            </div>

            {/* Purpose Select */}
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                    Purpose / Category
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-background border-border text-xs sm:text-sm text-foreground h-10 rounded-xl">
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card text-card-foreground border border-border shadow-md max-h-60 rounded-xl">
                      {EXPENSE_PURPOSES.map((purpose) => (
                        <SelectItem key={purpose} value={purpose} className="text-xs sm:text-sm">
                          {purpose}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-medium text-destructive mt-1" />
                </FormItem>
              )}
            />

            {/* Amount & Transaction Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                      Amount (PKR)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1000"
                        {...field}
                        className="bg-background border-border text-xs sm:text-sm text-foreground block w-full px-3 h-10 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-destructive mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transactionDate"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                      Transaction Date
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="date"
                          {...field}
                          className="bg-background border-border text-xs sm:text-sm text-foreground block w-full px-3 h-10 rounded-xl dark:[color-scheme:dark] dark:invert"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-destructive mt-1" />
                  </FormItem>
                )}
              />

            </div>

            {/* Receipt Image Upload */}
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      label="Receipt Screenshot / Proof (Optional)"
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-destructive mt-1" />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
                className="border-border text-foreground hover:bg-secondary cursor-pointer w-full sm:w-auto h-10 text-xs sm:text-sm rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer w-full sm:w-auto h-10 text-xs sm:text-sm font-semibold rounded-xl"
              >
                {isPending ? "Saving..." : "Add Transaction"}
              </Button>
            </AlertDialogFooter>

          </form>
        </Form>

      </AlertDialogContent>
    </AlertDialog>
  );
}