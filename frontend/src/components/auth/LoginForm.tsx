"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import type { SignInRequest } from "@/types/auth";
import { cn } from "@/lib/utils";
import { Mail, Lock, ArrowRight } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignInRequest>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const validateForm = (): boolean => {
    setError(null);
    if (!formData.email) { setError("Email is required"); return false; }
    if (!validateEmail(formData.email)) { setError("Invalid email format"); return false; }
    if (!formData.password) { setError("Password is required"); return false; }
    if (!validatePassword(formData.password)) { setError("Password must be at least 8 characters"); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiClient.signIn(formData);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("Invalid email or password")) {
          setError("Invalid email or password");
        } else {
          setError("Failed to sign in. Please try again.");
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const inputClasses = cn(
    "w-full pl-11 pr-4 py-3 text-sm",
    "bg-background/60 border border-border/60 rounded-xl",
    "text-foreground placeholder:text-muted-foreground/50",
    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40",
    "transition-all duration-200",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "hover:border-border"
  );

  return (
    <div className="bg-card/70 backdrop-blur-md border border-border/40 rounded-2xl p-7 sm:p-8 shadow-xl shadow-black/[0.03]">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-[13px] font-medium text-foreground mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 pointer-events-none" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={inputClasses}
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-[13px] font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 pointer-events-none" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={inputClasses}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 bg-destructive/8 border border-destructive/15 rounded-xl animate-fadeIn">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full py-3 px-4 mt-1",
            "bg-primary text-primary-foreground",
            "rounded-xl font-semibold text-sm",
            "hover:brightness-110 hover:shadow-lg hover:shadow-primary/25",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200",
            "active:scale-[0.98]",
            "flex items-center justify-center gap-2 group"
          )}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            <>
              Sign In
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
