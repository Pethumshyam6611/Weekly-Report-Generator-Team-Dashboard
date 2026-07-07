import { FileText } from 'lucide-react';
import { Button } from './Button';

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-panel border border-dashed border-line bg-white px-6 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-panel bg-brand-soft text-brand">
        <FileText className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-ink">{title}</h3>
      {description ? <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p> : null}
      {actionLabel && onAction ? (
        <Button type="button" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
