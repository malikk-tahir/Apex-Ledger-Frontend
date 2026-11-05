"use client";

import React, { useState } from "react";
import { useTransactionSummary } from "@/hooks/useExpenses";
import { getDefaultDates } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  Receipt 
} from "lucide-react";
import AddExpense from "./components/AddExpense";
import Transactions from "./components/Transactions";

export default function TransactionsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch summary metrics (using default date range for overall or current metrics view)
  const defaultDates = getDefaultDates();
  const { data: summaryData, isLoading: isSummaryLoading } = useTransactionSummary({
    startDate: defaultDates.startDate,
    endDate: defaultDates.endDate,
  });

  const summary = summaryData?.summary || {
    totalIncoming: 0,
    totalOutgoing: 0,
    netBalance: 0,
  };

  const safeNetBalance = Math.max(0, summary.netBalance);

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6 max-w-7xl mx-auto">
      
      {/* Page Header & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 shrink-0" /> Office & Financial Ledger
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Monitor company revenue, office expenses, receipts, and net cash flow.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs sm:text-sm font-semibold cursor-pointer shadow-xs h-9 sm:h-10 px-4 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Add Transaction
        </Button>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        
        {/* Total Incoming Card */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground tracking-wider">Total Incoming</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          {isSummaryLoading ? (
            <Skeleton className="h-7 sm:h-8 w-28 sm:w-32 rounded-lg" />
          ) : (
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-500 truncate">
              PKR {summary.totalIncoming?.toLocaleString()}
            </div>
          )}
          <p className="text-[10px] sm:text-[11px] text-muted-foreground">Total revenue and money in recorded</p>
        </div>

        {/* Total Outgoing Card */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground tracking-wider">Total Outgoing</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
              <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          {isSummaryLoading ? (
            <Skeleton className="h-7 sm:h-8 w-28 sm:w-32 rounded-lg" />
          ) : (
            <div className="text-xl sm:text-2xl font-extrabold text-foreground truncate">
              PKR {summary.totalOutgoing?.toLocaleString()}
            </div>
          )}
          <p className="text-[10px] sm:text-[11px] text-muted-foreground">Total operational expenses and money out</p>
        </div>

        {/* Net Balance Card */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground tracking-wider">Net Balance</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          {isSummaryLoading ? (
            <Skeleton className="h-7 sm:h-8 w-28 sm:w-32 rounded-lg" />
          ) : (
            <div className="text-xl sm:text-2xl font-extrabold text-foreground truncate">
              PKR {safeNetBalance.toLocaleString()}
            </div>
          )}
          <p className="text-[10px] sm:text-[11px] text-muted-foreground">Available balance summary</p>
        </div>

      </div>

      {/* Transactions Table & Filter Section */}
      <Transactions />

      {/* Add Transaction Dialog Modal */}
      <AddExpense
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

    </div>
  );
}