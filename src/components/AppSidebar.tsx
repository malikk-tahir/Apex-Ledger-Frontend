"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout as logoutAction } from "@/store/authSlice";
import api from "@/lib/api-client";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Receipt,
  LogOut,
  User,
  X,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Client Management", url: "/dashboard/clientmanagement", icon: Users },
  { title: "Employee Management", url: "/dashboard/employeemanagement", icon: Briefcase },
  { title: "Office Expenses", url: "/dashboard/officeexpense", icon: Receipt },
];

interface AppSidebarProps {
  isOpen: boolean;        
  setIsOpen: (open: boolean) => void;
  collapsed: boolean;     
}

export default function AppSidebar({ isOpen, setIsOpen, collapsed }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { userData } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logged out locally");
    } finally {
      dispatch(logoutAction());
      router.push("/login");
    }
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card text-foreground transition-all duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "md:w-20" : "md:w-64"} w-64`}
      >
        <div className="flex h-20 items-center justify-between md:justify-center px-4 sm:px-5 border-b border-border overflow-hidden">
          {(!collapsed || isOpen) ? (
            <Link href="/dashboard" className="flex items-center gap-2 min-w-0 justify-start">
              <div className="relative w-36 h-16 flex items-center">
                <Image
                  src="/logo.png" 
                  alt="Apex Marketing Agency"
                  width={140}
                  height={40}
                  priority
                  className="object-contain object-left w-full h-full"
                />
              </div>
            </Link>
          ) : (
            <div className="hidden md:flex w-full justify-center">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <Image
                  src="/logo.png" 
                  alt="Apex"
                  width={40}
                  height={40}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          )}

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.url;
            return (
              <Link
                key={item.title}
                href={item.url}
                onClick={() => setIsOpen(false)} 
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                } ${collapsed ? "md:justify-center md:px-2" : ""}`}
                title={collapsed ? item.title : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                />
                {(!collapsed || isOpen) && <span className="truncate">{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <div
            className={`flex items-center justify-between gap-2 p-2.5 rounded-xl bg-secondary/50 border border-border ${
              collapsed ? "md:justify-center md:p-2" : ""
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-bold text-xs shrink-0">
                <User className="w-4 h-4" />
              </div>
              {(!collapsed || isOpen) && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-foreground truncate">
                    {userData?.name || "Workspace Admin"}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate">
                    {userData?.email || "admin@apex.com"}
                  </span>
                </div>
              )}
            </div>

            {(!collapsed || isOpen) && (
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 text-muted-foreground hover:text-accent hover:bg-secondary rounded-lg transition-colors shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}