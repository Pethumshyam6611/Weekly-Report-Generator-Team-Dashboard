import Image from 'next/image';
import { BarChart3, CheckCircle2, ShieldCheck } from 'lucide-react';

type AuthVisualPanelProps = {
  heading: string;
  description: string;
};

export function AuthVisualPanel({ heading, description }: AuthVisualPanelProps) {
  return (
    <section className="relative min-h-[320px] overflow-hidden border-b border-line bg-brand-soft lg:min-h-full lg:border-b-0 lg:border-r">
      <Image
        src="/images/auth-dashboard-hero.png"
        alt="Team dashboard workspace"
        fill
        priority
        sizes="(min-width: 1024px) 58vw, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-blue-900/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-panel bg-white/15 text-white ring-1 ring-white/25 backdrop-blur">
          <BarChart3 className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium text-blue-100">Weekly report generator</p>
        <h1 className="mt-2 max-w-md text-3xl font-semibold tracking-normal">{heading}</h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-blue-50/90">{description}</p>

        <div className="mt-6 grid gap-2 text-sm text-blue-50/95 sm:grid-cols-2">
          <div className="flex items-start gap-2 rounded-panel bg-white/12 p-3 ring-1 ring-white/15 backdrop-blur">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Clear weekly project updates</span>
          </div>
          <div className="flex items-start gap-2 rounded-panel bg-white/12 p-3 ring-1 ring-white/15 backdrop-blur">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Role-aware team dashboard</span>
          </div>
        </div>
      </div>
    </section>
  );
}
