import { RegisterForm } from "@/components/auth/RegisterForm";
import {
  Sparkles,
  Brain,
  Zap,
  Shield,
  BarChart3,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Get Started - Nexora",
  description: "Create your Nexora account and start managing tasks with AI",
};

const features = [
  {
    icon: Brain,
    title: "AI Task Intelligence",
    description: "Auto-prioritize, tag, and schedule with contextual AI",
  },
  {
    icon: Zap,
    title: "Instant Capture",
    description: "Add tasks in natural language. Nexora handles the rest",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Track velocity, burndown, and productivity patterns",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "End-to-end encryption. SOC 2 compliant infrastructure",
  },
  {
    icon: Sparkles,
    title: "AI Chat Assistant",
    description: "Manage everything through conversational commands",
  },
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left panel: Hero branding ── */}
      <div className="relative flex flex-col justify-center px-6 sm:px-10 lg:px-12 xl:px-20 py-10 sm:py-14 lg:py-16 lg:w-1/2 bg-gradient-to-br from-[oklch(0.22_0.06_270)] via-[oklch(0.18_0.05_265)] to-[oklch(0.14_0.04_260)] overflow-x-clip">
        {/* Ambient glow orbs */}
        <div className="absolute top-[-20%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-primary/15 blur-[120px] animate-float pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[-5%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-[oklch(0.55_0.20_290)]/10 blur-[100px] animate-float pointer-events-none" style={{ animationDelay: "3s" }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-lg">
          {/* Logo mark */}
          <div className="flex items-center gap-3 mb-8 lg:mb-12">
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-primary to-[oklch(0.60_0.20_290)] flex items-center justify-center shadow-lg shadow-primary/30">
              <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <span className="text-white/90 font-bold text-lg lg:text-xl tracking-tight">Nexora</span>
          </div>

          {/* Hero copy */}
          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold leading-[1.15] tracking-tight mb-4 lg:mb-6">
            <span className="gradient-text">The AI workspace</span>
            <br />
            <span className="text-white">that thinks ahead.</span>
          </h1>

          <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-10 lg:mb-14">
            Join thousands of professionals who manage tasks smarter with
            AI assistance. Nexora learns your workflow, auto-prioritizes what
            matters, and eliminates the busywork — so you ship faster and
            stress less.
          </p>

          {/* Feature list */}
          <div className="space-y-4 lg:space-y-5">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="flex items-start gap-3 sm:gap-4 stagger-item"
                style={{ animationDelay: `${i * 100 + 200}ms` }}
              >
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                  <feature.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white/90">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-white/40 mt-0.5">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof strip */}
          <div className="mt-10 lg:mt-16 pt-6 lg:pt-8 border-t border-white/[0.06]">
            <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">12k+</div>
                <div className="text-xs text-white/40 mt-0.5">Active users</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">2M+</div>
                <div className="text-xs text-white/40 mt-0.5">Tasks completed</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">99.9%</div>
                <div className="text-xs text-white/40 mt-0.5">Uptime SLA</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel: Registration form ── */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-8 py-10 sm:py-12 lg:py-0 bg-gradient-to-b lg:bg-gradient-to-br from-background via-background to-muted/20 relative">
        {/* Subtle ambient on right side */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[420px] relative z-10 animate-scaleIn">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Create your account
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Start free. No credit card required.{" "}
              <a
                href="/login"
                className="font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
              >
                Sign in instead
                <ArrowRight className="w-3 h-3" />
              </a>
            </p>
          </div>

          {/* Form */}
          <RegisterForm />

          {/* Trust signal */}
          <p className="text-center text-xs text-muted-foreground/60 mt-6 leading-relaxed">
            By creating an account you agree to our Terms of Service
            <br />and Privacy Policy. Protected by enterprise-grade encryption.
          </p>
        </div>
      </div>
    </div>
  );
}
