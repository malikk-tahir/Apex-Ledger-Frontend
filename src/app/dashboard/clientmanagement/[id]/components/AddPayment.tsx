"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  paymentSchema,
  PaymentFormValues,
  PAYMENT_CATEGORIES,
  PAYMENT_TYPES,
} from "@/schemaValidators/clientPaymentSchema";
import { useAddClientPayment } from "@/hooks/useClientPayments";
import ImageUpload from "@/components/ImageUpload";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddPaymentModalProps {
  clientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddPayment({
  clientId,
  open,
  onOpenChange,
}: AddPaymentModalProps) {
  const { mutate: addPayment, isPending } = useAddClientPayment();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema) as any,
    defaultValues: {
      category: "client_amount",
      amountPaid: 0,
      monthYear: new Date().toISOString().slice(0, 7),
      paymentType: "bank_transfer",
      paymentDate: new Date().toISOString().split("T")[0] as any,
      note: "",
      file: null,
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }
    onOpenChange(isOpen);
  };

  const onSubmit = (values: PaymentFormValues) => {
    const formData = new FormData();
    formData.append("category", values.category || "client_amount");
    formData.append("amountPaid", String(values.amountPaid));
    formData.append("monthYear", values.monthYear);
    formData.append("paymentType", values.paymentType);

    if (values.paymentDate) {
      formData.append("paymentDate", new Date(values.paymentDate).toISOString());
    }

    if (values.note && values.note.trim()) {
      formData.append("note", values.note.trim());
    }

    if (values.file instanceof File) {
      formData.append("file", values.file);
    }

    addPayment(
      { clientId, formData },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="sm:max-w-lg bg-card border border-border text-foreground max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">
            Record Client Payment
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            Log a client retainer payment or expense, select the billing month, add an optional note, and attach a receipt.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
            {/* Payment Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                    Payment Category
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background border-border text-xs sm:text-sm text-foreground h-10 rounded-xl">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card border-border text-foreground">
                      {PAYMENT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-medium text-destructive mt-1" />
                </FormItem>
              )}
            />

            {/* Amount Paid */}
            <FormField
              control={form.control}
              name="amountPaid"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                    Amount Paid (PKR)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="50000"
                      {...field}
                      className="bg-background border-border text-xs sm:text-sm text-foreground block w-full px-3 h-10 rounded-xl"
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-destructive mt-1" />
                </FormItem>
              )}
            />

            {/* Billing Month */}
            <FormField
              control={form.control}
              name="monthYear"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                    Billing Month (YYYY-MM)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="2026-11"
                      {...field}
                      className="bg-background border-border text-xs sm:text-sm text-foreground block w-full px-3 h-10 rounded-xl"
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-destructive mt-1" />
                </FormItem>
              )}
            />

            {/* Payment Method */}
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
                      <SelectTrigger className="bg-background border-border text-xs sm:text-sm text-foreground h-10 rounded-xl">
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card border-border text-foreground">
                      {PAYMENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-medium text-destructive mt-1" />
                </FormItem>
              )}
            />

            {/* Payment Date */}
            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                    Payment Date
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? String(field.value).split("T")[0] : ""}
                        className="bg-background border-border text-xs sm:text-sm text-foreground block w-full px-3 h-10 rounded-xl dark:[color-scheme:dark] dark:invert"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-destructive mt-1" />
                </FormItem>
              )}
            />

            {/* Note */}
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                    Note (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="e.g., Shoot fuel or influencer advance"
                      {...field}
                      value={field.value ?? ""}
                      className="bg-background border-border text-xs sm:text-sm text-foreground block w-full px-3 h-10 rounded-xl"
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-destructive mt-1" />
                </FormItem>
              )}
            />

            {/* Reusable Image Upload Component */}
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormControl>
                    <ImageUpload
                      label="Payment Receipt / Screenshot"
                      value={field.value}
                      onChange={(file) => field.onChange(file)}
                      error={form.formState.errors.file?.message as string}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-destructive mt-1" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="border-border text-foreground hover:bg-secondary cursor-pointer h-10 text-xs sm:text-sm rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer h-10 text-xs sm:text-sm rounded-xl"
              >
                {isPending ? "Recording Payment..." : "Save Payment"}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}