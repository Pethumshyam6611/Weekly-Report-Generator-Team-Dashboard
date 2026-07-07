import { cn } from '@/lib/utils/cn';

export type ChatMessageModel = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

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
        {message.content}
      </div>
    </div>
  );
}
