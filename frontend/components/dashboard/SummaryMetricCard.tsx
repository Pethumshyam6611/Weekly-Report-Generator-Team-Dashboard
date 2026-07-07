import { Card, CardContent } from '@/components/ui/Card';

type SummaryMetricCardProps = {
  label: string;
  value: string | number;
  detail?: string;
};

export function SummaryMetricCard({ label, value, detail }: SummaryMetricCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-ink-muted">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-brand">{value}</p>
        {detail ? <p className="mt-1 text-xs text-ink-faint">{detail}</p> : null}
      </CardContent>
    </Card>
  );
}
