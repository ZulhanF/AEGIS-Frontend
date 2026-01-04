/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Route guard untuk admin-only routes
 */
export function AdminGuard({ children, user }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "ADMIN") {
    return (
      <motion.div
        className="flex-1 w-full p-6 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-md border-destructive">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-destructive/10 rounded-full">
                <ShieldAlert className="h-12 w-12 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl text-destructive">
              Access Denied
            </CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            <p>This page is restricted to administrators only.</p>
            <p className="mt-2">
              Your role: <span className="font-semibold">{user.role || "ENGINEER"}</span>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return <>{children}</>;
}

/**
 * Component guard untuk conditional rendering berdasarkan role
 */
export function RequireAdmin({ children, user, fallback = null }) {
  if (!user || user.role !== "ADMIN") {
    return fallback;
  }

  return <>{children}</>;
}

/**
 * Hook untuk cek apakah user adalah admin
 */
export function useIsAdmin(user) {
  return user?.role === "ADMIN";
}
