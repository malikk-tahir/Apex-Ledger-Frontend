"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector} from '@/store/hooks'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/schemaValidators/loginSchema";
import { login } from "@/store/authSlice";
import api from "@/lib/api-client";
import { toast } from "sonner";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { isAuthenticated, loading: authLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", data);
      
      if (response.data) {
        dispatch(login({ userData: response.data.user || response.data }));
        toast.success("Logged in successfully!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        <div className="text-center flex flex-col items-center space-y-3">
          <div className="relative w-40 h-16 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={160}
              height={64}
              sizes="160px"
              priority
              className="object-contain w-full h-full"
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Sign in to access your financial ledger and workspace.
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="admin@devnth.com"
                          {...field}
                          className="w-full bg-background text-foreground border-border rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm transition-all h-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-destructive mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="w-full bg-background text-foreground border-border rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm transition-all h-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-destructive mt-1" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-xs sm:text-sm h-10 sm:h-11 rounded-xl shadow-xs cursor-pointer gap-2 justify-center mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" /> Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4 shrink-0" />
                  </>
                )}
              </Button>

            </form>
          </Form>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Protected enterprise workspace. Unauthorized access is monitored.
        </p>

      </div>
    </div>
  );
}