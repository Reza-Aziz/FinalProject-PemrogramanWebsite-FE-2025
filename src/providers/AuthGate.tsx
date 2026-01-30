import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/api/axios";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { setToken, setUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      setToken(token);

      try {
        const res = await api.get("/api/auth/me");
        if (isMounted) {
          setUser(res.data.data);
        }
      } catch {
        logout();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [setToken, setUser, logout]);

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  return <>{children}</>;
}
