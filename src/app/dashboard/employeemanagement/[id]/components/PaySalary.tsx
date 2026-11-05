"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paySalaryFormSchema, PaySalaryFormValues, PAYMENT_TYPES } from "@/schemaValidators/salarySchema";
import { usePaySalary } from "@/hooks/useEmployeeSalary";
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
import { CreditCard } from "lucide-react";
import ImageUpload from "@/components/ImageUpload"; 

interface PaySalaryProps {
  salary: {
    _id: string;
    salaryMonth: string;
    amountPaid?: number;
  } | null;
  baseSalary?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatPaymentTypeLabel = (type: string) => {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function PaySalary({
  salary,
  baseSalary = 0,
  open,
  onOpenChange,
}: PaySalaryProps) {
  const { mutate: paySalary, isPending } = usePaySalary();

  const form = useForm<PaySalaryFormValues>({
    resolver: zodResolver(paySalaryFormSchema) as any,
    defaultValues: {
      amountPaid: baseSalary || salary?.amountPaid || 0,
      paymentType: "bank_transfer",
      paymentDate: new Date().toISOString().split("T")[0],
      file: null,
    },
  });

  React.useEffect(() => {
    if (salary) {
      form.reset({
        amountPaid: baseSalary || salary.amountPaid || 0,
        paymentType: "bank_transfer",
        paymentDate: new Date().toISOString().split("T")[0],
        file: null,
      });
    }
  }, [salary, baseSalary, form]);

  const onSubmit = (values: PaySalaryFormValues) => {
    if (!salary?._id) return;

    const formData = new FormData();
    formData.append("amountPaid", values.amountPaid.toString());
    formData.append("paymentType", values.paymentType);
    formData.append("paymentDate", values.paymentDate);

    if (values.file instanceof File) {
      formData.append("file", values.file);
    }

    paySalary(
      { salaryId: salary._id, formData },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[92vw] max-w-lg bg-card border border-border text-foreground p-4 sm:p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
        
        <AlertDialogHeader className="space-y-1 text-left">
          <AlertDialogTitle className="text-lg sm:text-xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-accent" /> Process Salary Payment
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Record payment details and attach a receipt for <span className="font-semibold text-foreground">{salary?.salaryMonth}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          className="bg-background border-border text-xs sm:text-sm text-foreground block w-full px-3 h-10 rounded-xl dark:[color-scheme:dark] dark:invert"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-destructive mt-1" />
                  </FormItem>
                )}
              />
            </div>

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
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card text-card-foreground border border-border shadow-md rounded-xl">
                      {PAYMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {formatPaymentTypeLabel(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-medium text-destructive mt-1" />
                </FormItem>
              )}
            />

            {/* Receipt ImageUpload Field */}
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      label="Payment Screenshot / Receipt (Optional)"
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
                className="bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer w-full sm:w-auto h-10 text-xs sm:text-sm font-semibold rounded-xl"
              >
                {isPending ? "Processing..." : "Confirm Payment"}
              </Button>
            </AlertDialogFooter>

          </form>
        </Form>

      </AlertDialogContent>
    </AlertDialog>
  );
}