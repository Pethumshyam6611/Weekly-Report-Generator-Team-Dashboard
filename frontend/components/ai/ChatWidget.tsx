'use client';

import { FormEvent, useState } from 'react';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { ChatMessage, type ChatMessageModel } from './ChatMessage';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { askAi } from '@/lib/api/aiChat.api';
import { getApiErrorMessage } from '@/lib/api/axiosClient';

const suggestions = [
  'Which projects have the most blockers?',
  'What did the team work on last week?',
  'Summarize late or pending reports.',
  'Who reported the most workload recently?'
];

export function ChatWidget({ onAnswered }: { onAnswered?: () => void }) {
  const [messages, setMessages] = useState<ChatMessageModel[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async (event?: FormEvent) => {
    event?.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;

    const userMessage: ChatMessageModel = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed
    };
    setMessages((current) => [...current, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const result = await askAi(trimmed);
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: result.answer
        }
      ]);
      onAnswered?.();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not reach the AI assistant'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex min-h-[620px] flex-col">
      <CardHeader>
        <h2 className="text-sm font-semibold text-ink">AI report assistant</h2>
        <p className="mt-1 text-sm text-ink-muted">Ask about reports, blockers, project progress, or workload.</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex-1 space-y-3 overflow-y-auto rounded-panel border border-line bg-surface-page p-3">
          {messages.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-ink-muted">Try one of these prompts:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="rounded-md border border-line bg-white px-3 py-1.5 text-sm text-ink-muted transition hover:border-brand-border hover:text-brand"
                    onClick={() => setQuestion(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => <ChatMessage key={message.id} message={message} />)
          )}
          {loading ? <Spinner label="Thinking" className="py-3" /> : null}
        </div>

        <form className="flex gap-2" onSubmit={send}>
          <input
            className="h-10 min-w-0 flex-1 rounded-panel border border-line bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            placeholder="Ask a question about team reports"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />
          <Button type="submit" isLoading={loading} aria-label="Send message">
            <Send className="h-4 w-4" />
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
