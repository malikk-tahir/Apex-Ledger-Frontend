"use client";

import { useEffect, type ReactNode } from "react";
// import { useDispatch } from "react-redux";
import {useAppDispatch}from "@/store/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { login, logout } from "@/store/authSlice";
import api from "@/lib/api-client";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const response = await api.get("/auth/me");
        const userData = response.data?.user || response.data;
        if (!isMounted) return;

        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      } catch {
        if (!isMounted) return;
        dispatch(logout());
        queryClient.clear(); 
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [dispatch, queryClient]);

  return <>{children}</>;
}