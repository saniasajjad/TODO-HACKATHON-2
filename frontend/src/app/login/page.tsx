import { LoginForm } from "@/components/auth/LoginForm";
import { Sparkles, ArrowRight, Brain, Zap, BarChart3 } from "lucide-react";

export const metadata = {
  title: "Sign In - Nexora",
  description: "Sign in to your Nexora account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex relative lg:w-[46%] overflow-hidden" style={{ background: "radial-gradient(ellipse at 30% 20%, oklch(0.22 0.08 270), oklch(0.14 0.05 265) 50%, oklch(0.09 0.03 258))" }}>
        {/* Glow orbs */}
        <div className="absolute top-[-15%] left-[-10%] w-[450px] h-[450px] rounded-full bg-primary/15 blur-[120px] animate-float pointer-events-none" />
        <div className="absolute bottom-[-12%] right-[-8%] w-[350px] h-[350px] rounded-full bg-[oklch(0.45_0.18_290)]/10 blur-[100px] animate-float pointer-events-none" style={{ animationDelay: "3s" }} />

        {/* Content — vertically centered, generous padding */}
        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16 w-full">
          {/* Logo + Brand */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-[oklch(0.58_0.20_290)] flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-white/90 font-bold text-2xl tracking-tight">Nexora</span>
            <span className="text-white/20 text-2xl font-light">|</span>
            <span className="text-white/60 text-lg font-medium">Welcome back</span>
          </div>

          {/* Description */}
          <p className="text-white/50 text-[0.95rem] leading-[1.9] max-w-sm mb-12">
            Your AI assistant remembered everything — sign in to pick up right where you left off.
          </p>

          {/* Features */}
          <div className="flex flex-col gap-4">
            {[
              { icon: Brain, label: "AI prioritization" },
              { icon: Zap, label: "Real-time sync" },
              { icon: BarChart3, label: "Deadline tracking" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-white/55 text-sm font-medium tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-8 py-10 bg-gradient-to-b from-background to-muted/15 relative">
        <div className="w-full max-w-[400px] relative z-10 animate-scaleIn">
          {/* Mobile branding */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-[oklch(0.58_0.20_290)] flex items-center justify-center shadow-lg shadow-primary/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">Nexora</span>
          </div>

          <div className="mb-6">
            <h2 className="text-[1.65rem] font-bold text-foreground tracking-tight leading-tight">
              Sign in to your account
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              New here?{" "}
              <a
                href="/register"
                className="font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 group"
              >
                Create a free account
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-[11px] text-muted-foreground/50 mt-6">
            Protected by enterprise-grade encryption
          </p>
        </div>
      </div>
    </div>
  );
}
