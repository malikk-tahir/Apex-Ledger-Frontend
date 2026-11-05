"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, ClientFormValues, businessCategoryEnum, clientTypeEnum } from "@/schemaValidators/clientSchema";
import { useCreateClient } from "@/hooks/useClient";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddClientModal({ open, onOpenChange }: AddClientModalProps) {
  const { mutate: createClient, isPending } = useCreateClient();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema) as any, 
    defaultValues: {
      companyName: "",
      ownerName: "",
      contact: "",
      address: "",
      type: "one_time",
      services: ["media"],
      monthlyContractAmount: undefined,
      date: new Date(),
    },
  });

  const clientType = form.watch("type");

  const onSubmit = (values: ClientFormValues) => {
    createClient(values, {
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
          <AlertDialogTitle className="text-lg sm:text-xl font-bold tracking-tight">Add New Client</AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Enter the details for the new client contract. Retainer clients require a monthly contract amount.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            
            {/* Company Name */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                    Company Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Apex Enterprise"
                      {...field}
                      className="bg-background border-border text-xs sm:text-sm text-foreground block w-full px-3 h-10 rounded-xl"
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-destructive mt-1" />
                </FormItem>
              )}
            />

            {/* Owner Name */}
            <FormField
              control={form.control}
              name="ownerName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                    Owner / Representative Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. John Doe"
                      {...field}
                      className="bg-background border-border text-xs sm:text-sm text-foreground block w-full px-3 h-10 rounded-xl"
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-destructive mt-1" />
                </FormItem>
              )}
            />

            {/* Business Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                    Business Category
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-background border-border text-xs sm:text-sm text-foreground h-10 rounded-xl">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card text-foreground border border-border rounded-xl">
                      {businessCategoryEnum.map((cat) => (
                        <SelectItem key={cat} value={cat} className="focus:bg-secondary text-xs sm:text-sm">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-medium text-destructive mt-1" />
                </FormItem>
              )}
            />

            {/* Contact & Address Row */}
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
                        placeholder="+92 300 1234567"
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
                name="address"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="City, Office Location"
                        {...field}
                        className="bg-background border-border text-xs sm:text-sm text-foreground block w-full px-3 h-10 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-destructive mt-1" />
                  </FormItem>
                )}
              />
            </div>

            {/* Client Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                    Client Type
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-background border-border text-xs sm:text-sm text-foreground h-10 rounded-xl">
                        <SelectValue placeholder="Select Client Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card text-foreground border border-border rounded-xl">
                      {clientTypeEnum.map((type) => (
                        <SelectItem key={type} value={type} className="capitalize focus:bg-secondary text-xs sm:text-sm">
                          {type.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-medium text-destructive mt-1" />
                </FormItem>
              )}
            />

            {/* Conditional Monthly Contract Amount (Only for Retainer) */}
            {clientType === "retainer" && (
              <FormField
                control={form.control}
                name="monthlyContractAmount"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground">
                      Monthly Contract Amount (PKR)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50000"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        value={field.value ?? ""}
                        className="bg-background border-border text-xs sm:text-sm text-foreground block w-full px-3 h-10 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-destructive mt-1" />
                  </FormItem>
                )}
              />
            )}

            <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-border text-foreground hover:bg-secondary cursor-pointer w-full sm:w-auto h-10 text-xs sm:text-sm rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer w-full sm:w-auto h-10 text-xs sm:text-sm font-semibold rounded-xl"
              >
                {isPending ? "Saving..." : "Save Client"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}