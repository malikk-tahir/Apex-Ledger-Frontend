"use client";

import React, { useState } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  Wallet, 
  Plus, 
  Phone, 
  Briefcase, 
  Calendar, 
  AlertCircle, 
  ChevronRight 
} from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import AddEmployee from "./components/AddEmployee";

export default function EmployeesPage() {
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useEmployees({ page });

  const employees = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || page;
  const summary = data?.summary || { activeEmployees: 0, totalMonthlyPayroll: 0 };

  return (
    <div className="space-y-5 p-3 sm:p-6 max-w-7xl mx-auto w-full overflow-x-hidden">
      
      {/* Page Header & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 pb-3 border-b border-border/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            Employee Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage team member salaries, billing cycles, and active status.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 text-xs sm:text-sm font-semibold cursor-pointer shadow-xs h-9 sm:h-10 px-4 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 shrink-0" /> Add Employee
        </Button>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs space-y-1.5">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-accent shrink-0" /> Active Staff
          </span>
          <p className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            {summary.activeEmployees} <span className="text-xs font-normal text-muted-foreground">Active</span>
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs space-y-1.5">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Total Monthly Payroll
          </span>
          <p className="text-xl sm:text-2xl font-black text-emerald-500 tracking-tight truncate">
            PKR {summary.totalMonthlyPayroll.toLocaleString()}
          </p>
        </div>

      </div>

      {/* Employees Content Section */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        
        {isLoading ? (
          <div className="space-y-3 pt-1">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-xl text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <p className="text-sm font-medium text-foreground">Failed to load employees</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="cursor-pointer text-xs h-8">
              Try Again
            </Button>
          </div>
        ) : employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-xl text-center space-y-2">
            <Users className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">No employees found</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Get started by adding your first employee.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            
            <div className="grid grid-cols-1 gap-3">
              {employees.map((employee: any) => (
                <Link
                  key={employee._id}
                  href={`/dashboard/employeemanagement/${employee._id}`}
                  className="group block p-3.5 sm:p-4 bg-background border border-border hover:border-accent/50 rounded-xl transition-all shadow-xs hover:shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-foreground text-sm sm:text-base group-hover:text-accent transition-colors truncate">
                          {employee.name}
                        </h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                          employee.isActive 
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                            : "bg-destructive/10 text-destructive border border-destructive/20"
                        }`}>
                          {employee.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1 truncate">
                          <Briefcase className="w-3 h-3 text-foreground shrink-0" /> {employee.designation}
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <Phone className="w-3 h-3 text-foreground shrink-0" /> {employee.contact}
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <Calendar className="w-3 h-3 text-foreground shrink-0" /> Cycle: Day {employee.startDay}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3.5 pt-2 sm:pt-0 border-t sm:border-0 border-border">
                      <div className="text-left sm:text-right">
                        <span className="block text-[10px] uppercase font-medium text-muted-foreground">Base Salary</span>
                        <span className="font-bold text-foreground text-sm sm:text-base">
                          PKR {employee.baseSalary?.toLocaleString()}
                        </span>
                      </div>

                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors shrink-0">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>

                  </div>
                </Link>
              ))}
            </div>

            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />

          </div>
        )}
      </div>

      <AddEmployee open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />

    </div>
  );
}