'use client';

import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

type ChartCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

type LegendItem = {
  label: string;
  color: string;
};

type TooltipPayloadItem = {
  name?: string;
  value?: number | string;
  color?: string;
};

type ChartTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: TooltipPayloadItem[];
  labelFormatter?: (label: string) => string;
  valueFormatter?: (value: number | string, name?: string) => string;
};

export const chartColors = {
  primary: 'var(--chart-primary)',
  secondary: 'var(--chart-secondary)',
  submitted: 'var(--chart-submitted)',
  pending: 'var(--chart-pending)',
  late: 'var(--chart-late)',
  grid: 'rgb(var(--color-line))',
  axis: 'rgb(var(--color-ink-muted))'
};

export function ChartCard({ title, description, children, className }: ChartCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="bg-white">
        <div>
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
          {description ? <p className="mt-1 text-xs text-ink-muted">{description}</p> : null}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function ChartLegend({ items }: { items: LegendItem[] }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item.label}
          className="inline-flex items-center gap-2 rounded-panel border border-line bg-surface-page px-2.5 py-1 text-xs font-medium text-ink-muted"
        >
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

export function ChartEmptyState({ message = 'No chart data for the selected filters.' }: { message?: string }) {
  return (
    <div className="flex h-72 flex-col items-center justify-center rounded-panel border border-dashed border-line bg-surface-page px-4 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-panel bg-brand-soft text-brand">
        <BarChart3 className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm font-medium text-ink">Nothing to chart yet</p>
      <p className="mt-1 max-w-xs text-sm text-ink-muted">{message}</p>
    </div>
  );
}

export function ChartTooltip({
  active,
  label,
  payload,
  labelFormatter,
  valueFormatter
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-panel border border-line bg-white px-3 py-2 shadow-subtle">
      {label ? (
        <p className="mb-2 text-xs font-semibold text-ink">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      ) : null}
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={`${item.name}-${item.color}`} className="flex min-w-36 items-center justify-between gap-4 text-xs">
            <span className="inline-flex items-center gap-2 text-ink-muted">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
            <span className="font-semibold text-ink">
              {valueFormatter && item.value !== undefined
                ? valueFormatter(item.value, item.name)
                : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
