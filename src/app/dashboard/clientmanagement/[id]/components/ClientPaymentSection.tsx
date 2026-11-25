"use client";

import React, { useState } from "react";
import { useClientMonthlyLedger } from "@/hooks/useClientPayments";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MonthlyPayments from "./MonthlyPayments";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Wallet,
  FileText,
} from "lucide-react";

interface ClientPaymentSectionProps {
  clientId: string;
  clientType: string;
}

export default function ClientPaymentSection({
  clientId,
  clientType,
}: ClientPaymentSectionProps) {
  // Only load ledger if the client is a retainer client (as per backend rule)
  const isRetainer = clientType === "retainer";
  const { data, isLoading, isError, refetch } = useClientMonthlyLedger(
    clientId,
    isRetainer
  );

  // Track which month accordions are open (stores monthYear strings e.g. ["2026-10"])
  const [openMonths, setOpenMonths] = useState<string[]>([]);

  const toggleMonthAccordion = (monthYear: string) => {
    setOpenMonths((prev) =>
      prev.includes(monthYear)
        ? prev.filter((m) => m !== monthYear)
        : [...prev, monthYear]
    );
  };

  if (!isRetainer) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm text-center space-y-2">
        <p className="text-sm font-medium text-foreground">Monthly Ledger Not Applicable</p>
        <p className="text-xs text-muted-foreground">
          Monthly ledger and retainer tracking are reserved for retainer-based clients.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-36 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 bg-card border border-border rounded-xl text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
        <p className="text-sm font-medium text-foreground">Failed to load client monthly ledger</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="cursor-pointer">
          Try Again
        </Button>
      </div>
    );
  }

  const { summary, data: months } = data;

  // Status Badge Helper
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
      {/* 1. Overall Financial Summary Dashboard Card */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5" /> Retainer Financial Overview
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mt-0.5">
              Account Ledger Summary
            </h2>
          </div>
          {summary.unpaidMonths > 0 ? (
            <span className="text-xs px-3 py-1 rounded-full font-medium bg-destructive/10 text-destructive border border-destructive/20">
              {summary.unpaidMonths} Unpaid / Partial Month(s)
            </span>
          ) : (
            <span className="text-xs px-3 py-1 rounded-full font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              All Dues Cleared
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border text-sm">
          <div>
            <p className="text-[11px] text-muted-foreground uppercase font-medium">Monthly Rate</p>
            <p className="font-bold text-foreground text-base">
              PKR {summary.monthlyContractAmount?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground uppercase font-medium">Total Due</p>
            <p className="font-bold text-foreground text-base">
              PKR {summary.totalDue?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground uppercase font-medium">Total Paid</p>
            <p className="font-bold text-emerald-500 text-base">
              PKR {summary.totalPaid?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground uppercase font-medium">Total Remaining</p>
            <p className="font-bold text-destructive text-base">
              PKR {summary.totalRemaining?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Monthly Ledger Breakdown */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg text-foreground tracking-tight">
            Monthly Payment Breakdown
          </h3>
          <span className="text-xs text-muted-foreground">{months.length} billing cycle(s)</span>
        </div>

        {months.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-xl text-center space-y-2">
            <FileText className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">No monthly ledger records found</p>
            <p className="text-xs text-muted-foreground">
              Billing cycles will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {months.map((month: any) => {
              const isOpen = openMonths.includes(month.monthYear);
              // const contractPaidAmount = month.contractPaidAmount ?? 0;
              // const extraExpensesAmount = month.extraExpensesAmount ?? 0;
              // const paidAmount = month.paidAmount ?? contractPaidAmount + extraExpensesAmount;
              // const remainingBalance = month.remainingBalance ?? 0;

              return (
                <div
                  key={month.monthYear}
                  className="border border-border rounded-xl bg-background overflow-hidden transition-all"
                >
                  <div
                    onClick={() => toggleMonthAccordion(month.monthYear)}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 cursor-pointer hover:bg-secondary/40 gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-foreground font-bold text-xs shrink-0">
                        <Calendar className="w-4 h-4 text-accent" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-foreground text-base tracking-tight">
                          {month.monthYear}
                        </h4>
                        {/* <p className="text-xs text-muted-foreground">
                          Contract Paid: PKR {contractPaidAmount.toLocaleString()} /{" "}
                          {month.contractAmount?.toLocaleString()} · Remaining: PKR{" "}
                          {remainingBalance.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Expenses: PKR {extraExpensesAmount.toLocaleString()} · Total Logged: PKR{" "}
                          {paidAmount.toLocaleString()}
                        </p> */}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                      {getStatusBadge(month.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="p-4 border-t border-border bg-card/50 space-y-4">
                      <MonthlyPayments clientId={clientId} monthYear={month.monthYear} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}