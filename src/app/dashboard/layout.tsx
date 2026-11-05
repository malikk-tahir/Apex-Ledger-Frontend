"use client";

import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/providers/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);       
  const [desktopCollapsed, setDesktopCollapsed] = useState(false); 

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen} 
          collapsed={desktopCollapsed} 
        />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                onClick={() => setDesktopCollapsed(!desktopCollapsed)}
                className="hidden md:flex p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors"
                title={desktopCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                <Menu className="w-5 h-5" />
              </button>

              <h1 className="text-base sm:text-lg font-bold tracking-tight">
                Apex Management Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border rounded-lg"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent animate-pulse" />
              </Button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 bg-background/50 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}