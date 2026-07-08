'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ChatHistoryPanel } from '@/components/ai/ChatHistoryPanel';
import { ChatWidget } from '@/components/ai/ChatWidget';
import { Spinner } from '@/components/ui/Spinner';
import { getAiHistory } from '@/lib/api/aiChat.api';
import { getApiErrorMessage } from '@/lib/api/axiosClient';
import type { AiHistoryItem } from '@/lib/types/ai.types';

export default function AiAssistantPage() {
  const [history, setHistory] = useState<AiHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(() => {
    getAiHistory({ perPage: 20 })
      .then((data) => setHistory(data.history))
      .catch((error) => toast.error(getApiErrorMessage(error, 'Could not load AI history')))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="section-title">AI assistant</h2>
        <p className="section-subtitle">Ask natural-language questions over weekly report data.</p>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <ChatWidget onAnswered={loadHistory} />
        {loading ? <Spinner label="Loading chat history" /> : <ChatHistoryPanel history={history} />}
      </div>
    </div>
  );
}
