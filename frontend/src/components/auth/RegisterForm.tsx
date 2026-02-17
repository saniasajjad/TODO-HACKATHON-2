"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import type { SignUpRequest } from "@/types/auth";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpRequest>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
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
      const result = await apiClient.signUp(formData);
      setSuccess(true);
      setTimeout(() => { router.push("/login"); }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("already registered")) {
          setError("Email already registered");
        } else if (err.message.includes("Invalid email format")) {
          setError("Invalid email format");
        } else if (err.message.includes("Password must be at least")) {
          setError(err.message);
        } else {
          setError("Failed to create account. Please try again.");
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

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl shadow-primary/5">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={cn(
                "w-full px-4 py-3",
                "bg-background/50 border border-input rounded-xl",
                "text-foreground placeholder:text-muted-foreground/60",
                "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "hover:border-primary/30"
              )}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading || success}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className={cn(
                "w-full px-4 py-3",
                "bg-background/50 border border-input rounded-xl",
                "text-foreground placeholder:text-muted-foreground/60",
                "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "hover:border-primary/30"
              )}
              placeholder="Min 8 characters"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading || success}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl animate-fadeIn">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl animate-fadeIn">
            <p className="text-sm text-green-600">
              Account created! Redirecting to login...
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || success}
          className={cn(
            "w-full py-3 px-4",
            "bg-primary text-primary-foreground",
            "rounded-xl font-medium text-sm",
            "hover:opacity-90 hover:shadow-lg hover:shadow-primary/20",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200",
            "active:scale-[0.98]"
          )}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Creating account...
            </span>
          ) : success ? "Account created!" : "Create Account"}
        </button>
      </form>
    </div>
  );
}
