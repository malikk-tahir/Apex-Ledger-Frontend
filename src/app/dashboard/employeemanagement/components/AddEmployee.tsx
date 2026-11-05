"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeFormSchema, EmployeeFormValues } from "@/schemaValidators/employeeSchema";
import { useCreateEmployee } from "@/hooks/useEmployees";
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
import { Switch } from "@/components/ui/switch";
import { UserPlus } from "lucide-react";

interface AddEmployeeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddEmployee({ open, onOpenChange }: AddEmployeeProps) {
  const { mutate: createEmployee, isPending } = useCreateEmployee();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema) as any,
    defaultValues: {
      name: "",
      contact: "",
      designation: "",
      baseSalary: 0,
      startDay: 1,
      isActive: true,
    },
  });

  const onSubmit = (values: EmployeeFormValues) => {
    createEmployee(values, {
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
            <UserPlus className="w-5 h-5 text-accent" /> Add New Employee
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Enter the employee details, salary, and billing cycle start day.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Ali Khan"
                      {...field}
                      className="bg-background border-border text-xs sm:text-sm text-foreground block w-full px-3 h-10 rounded-xl"
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-destructive mt-1" />
                </FormItem>
              )}
            />

            {/* Contact & Designation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                      Contact Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 03001234567"
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
                name="designation"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                      Designation
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Frontend Dev"
                        {...field}
                        className="bg-background border-border text-xs sm:text-sm text-foreground block w-full px-3 h-10 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-destructive mt-1" />
                  </FormItem>
                )}
              />
            </div>

            {/* Base Salary & Start Day Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="baseSalary"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                      Base Salary (PKR)
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
                name="startDay"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                      Start Day (1-28)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={28}
                        placeholder="1"
                        {...field}
                        className="bg-background border-border text-xs sm:text-sm text-foreground block w-full px-3 h-10 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-destructive mt-1" />
                  </FormItem>
                )}
              />
            </div>

            {/* Is Active Switch */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-3 rounded-xl border border-border bg-background">
                  <div className="space-y-0.5">
                    <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                      Active Status
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">Is this employee currently active?</p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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
                {isPending ? "Creating..." : "Create Employee"}
              </Button>
            </AlertDialogFooter>

          </form>
        </Form>

      </AlertDialogContent>
    </AlertDialog>
  );
}