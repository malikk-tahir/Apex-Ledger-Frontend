"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useEmployeeById, useSetEmployeeStatus } from "@/hooks/useEmployees";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Edit3, 
  Phone, 
  Briefcase, 
  Calendar, 
  Wallet, 
  AlertCircle 
} from "lucide-react";
import UpdateEmployee from "./components/UpdateEmployee";
import EmployeeSalaries from "./components/EmployeeSalaries";
import Link from "next/link";
// import EmployeeSalariesSection from "../components/EmployeeSalariesSection";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SingleEmployeePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const employeeId = resolvedParams.id;

  const router = useRouter();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const { data: employeeData, isLoading: isLoadingEmployee, isError: isErrorEmployee } = useEmployeeById(employeeId);
  const { mutate: setStatus, isPending: isUpdatingStatus } = useSetEmployeeStatus();

  const employee = employeeData?.data;

  const handleStatusToggle = (checked: boolean) => {
    if (!employeeId) return;
    setStatus({ id: employeeId, isActive: checked });
  };

  if (isLoadingEmployee) {
    return (
      <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-32 rounded-lg" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isErrorEmployee || !employee) {
    return (
      <div className="p-4 sm:p-6 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-destructive" />
        <h2 className="text-lg font-bold text-foreground">Employee Not Found</h2>
        <p className="text-xs text-muted-foreground">The requested employee record could not be loaded.</p>
        <Button asChild variant="outline" className="border-border text-foreground hover:bg-secondary w-full sm:w-auto">
          <Link href="/dashboard/employeemanagement">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Employees
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      
      <div>
        <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground p-0 hover:bg-transparent justify-start">
          <Link href="/dashboard/employeemanagement" className="flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="w-4 h-4 shrink-0" /> 
            <span className="truncate">Back to Employee Management</span>
          </Link>
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-5">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent font-bold text-xl shrink-0">
              {employee.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                  {employee.name}
                </h1>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                  employee.isActive 
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}>
                  {employee.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{employee.designation}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-background">
              <span className="text-xs text-muted-foreground font-medium">Status</span>
              <Switch
                checked={employee.isActive}
                onCheckedChange={handleStatusToggle}
                disabled={isUpdatingStatus}
              />
            </div>

            <Button
              onClick={() => setIsUpdateModalOpen(true)}
              variant="outline"
              size="sm"
              className="gap-2 cursor-pointer border-border hover:bg-secondary"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </Button>
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Contact Number
            </span>
            <p className="text-sm font-semibold text-foreground">{employee.contact}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" /> Designation
            </span>
            <p className="text-sm font-semibold text-foreground">{employee.designation}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-emerald-500" /> Base Salary
            </span>
            <p className="text-sm font-bold text-emerald-500">
              PKR {employee.baseSalary?.toLocaleString()}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Billing Cycle Start
            </span>
            <p className="text-sm font-semibold text-foreground">Day {employee.startDay} of month</p>
          </div>
        </div>
      </div>

      <EmployeeSalaries employeeId={employeeId} baseSalary={employee.baseSalary} />

      <UpdateEmployee
        employee={employee}
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
      />

    </div>
  );
}