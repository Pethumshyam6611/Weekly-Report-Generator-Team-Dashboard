import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export type ChatMessageModel = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

function MessageContent({ content }: { content: string }) {
  const lines = content.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push(
      <ul key={`list-${blocks.length}`} className="my-2 list-disc space-y-1 pl-5">
        {listItems.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }

    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      listItems.push(bulletMatch[1]);
      return;
    }

    flushList();
    blocks.push(
      <p key={`paragraph-${blocks.length}`} className="my-1">
        {trimmed}
      </p>
    );
  });

  flushList();

  return <>{blocks.length > 0 ? blocks : content}</>;
}

export function ChatMessage({ message }: { message: ChatMessageModel }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-panel border px-3 py-2 text-sm leading-6',
          isUser
            ? 'border-brand-border bg-brand-soft text-ink'
            : 'border-line bg-white text-ink'
        )}
      >
        <MessageContent content={message.content} />
      </div>
    </div>
  );
}
