"use client";

import React from "react";
import Link from "next/link";
import { useTransactionSummary, useTransactions } from "@/hooks/useExpenses";
import { useClients } from "@/hooks/useClient";
import { useEmployees } from "@/hooks/useEmployees";
import { getDefaultDates } from "@/lib/utils";
import { 
  Users, 
  UserCheck, 
  Receipt, 
  ArrowUpRight, 
  ArrowDownLeft,
  Building2,
  Plus
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import InteractiveAreaChart from "@/components/InteractiveAreaChart";

export default function DashboardPage() {
  const defaultDates = getDefaultDates();
  
  const { data: summaryData, isLoading: isSummaryLoading } = useTransactionSummary({
    startDate: defaultDates.startDate,
    endDate: defaultDates.endDate,
  });

  const { data: transactionsData, isLoading: isTransactionsLoading } = useTransactions({
    startDate: defaultDates.startDate,
    endDate: defaultDates.endDate,
    page: 1,
  });

  const { data: clientsData, isLoading: isClientsLoading } = useClients(1, "", {});
  const { data: employeesData, isLoading: isEmployeesLoading } = useEmployees({}, true);

  const summary = summaryData?.summary || {
    totalIncoming: 0,
    totalOutgoing: 0,
    netBalance: 0,
  };

  const safeNetBalance = Math.max(0, summary.netBalance);
  const totalClients = clientsData?.totalCount || clientsData?.data?.length || 0;
  const totalEmployees = employeesData?.totalCount || employeesData?.data?.length || 0;
  const rawTransactions = transactionsData?.data || [];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-border/60">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-accent">
            <Building2 className="w-3.5 h-3.5 shrink-0" /> Apex Marketing — Enterprise Workspace
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-0.5">
            Financial & Operations Wallet
          </h1>
        </div>
      </div>

      {/* Primary Balance Banner Card */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-bl from-accent/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          
          <div className="space-y-3 max-w-full">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Total Liquidity Reserve (Net Balance)
            </span>
            
            {isSummaryLoading ? (
              <Skeleton className="h-9 w-44 sm:w-56 rounded-lg" />
            ) : (
              <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight break-words">
                PKR {safeNetBalance.toLocaleString()}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <ArrowDownLeft className="w-3.5 h-3.5 shrink-0" /> Influx: PKR {summary.totalIncoming?.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" /> Outflow: PKR {summary.totalOutgoing?.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center gap-3 w-full lg:w-auto shrink-0 pt-1 lg:pt-0">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-xs sm:text-sm font-semibold cursor-pointer shadow-xs h-9 sm:h-10 px-4 w-full sm:w-auto justify-center">
              <Link href="/clients/new">
                <Plus className="w-4 h-4 shrink-0" /> Add Client
              </Link>
            </Button>
            <Button asChild className="border-border bg-accent hover:bg-accent-foreground gap-2 text-xs sm:text-sm font-semibold cursor-pointer shadow-xs h-9 sm:h-10 px-4 w-full sm:w-auto justify-center">
              <Link href="/expenses/new">
                <Plus className="w-4 h-4 shrink-0" /> Add Expense
              </Link>
            </Button>
          </div>

        </div>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">Active Clients</span>
            <div className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          {isClientsLoading ? (
            <Skeleton className="h-7 w-20 rounded-md" />
          ) : (
            <div className="text-xl font-black text-foreground">{totalClients}</div>
          )}
          <p className="text-[11px] text-muted-foreground">Retainer & project accounts</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">Registered Staff</span>
            <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          {isEmployeesLoading ? (
            <Skeleton className="h-7 w-20 rounded-md" />
          ) : (
            <div className="text-xl font-black text-foreground">{totalEmployees}</div>
          )}
          <p className="text-[11px] text-muted-foreground">Managed through automated payroll</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-1.5 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">Expense Ratio</span>
            <div className="w-7 h-7 rounded-full bg-secondary text-foreground flex items-center justify-center shrink-0">
              <Receipt className="w-3.5 h-3.5" />
            </div>
          </div>
          {isSummaryLoading ? (
            <Skeleton className="h-7 w-20 rounded-md" />
          ) : (
            <div className="text-xl font-black text-foreground">
              {summary.totalIncoming > 0 ? `${Math.round((summary.totalOutgoing / summary.totalIncoming) * 100)}%` : "0%"}
            </div>
          )}
          <p className="text-[11px] text-muted-foreground">Outgoing vs Incoming proportion</p>
        </div>

      </div>

      {/* Area Chart Section */}
      {isTransactionsLoading ? (
        <Skeleton className="h-[360px] w-full rounded-2xl" />
      ) : (
        <InteractiveAreaChart transactions={rawTransactions} />
      )}

    </div>
  );
}