import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { timeAgo } from '@/lib/utils/formatters';
import type { AiHistoryItem } from '@/lib/types/ai.types';

export function ChatHistoryPanel({ history }: { history: AiHistoryItem[] }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-ink">Previous questions</h2>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <EmptyState title="No chat history" description="Questions you ask the assistant will be saved here." />
        ) : (
          <ul className="divide-y divide-line">
            {history.map((item) => (
              <li key={item.id} className="py-3">
                <p className="text-sm font-medium text-ink">{item.query_text}</p>
                <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{item.response_text}</p>
                <p className="mt-1 text-xs text-ink-faint">{timeAgo(item.created_at)}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
