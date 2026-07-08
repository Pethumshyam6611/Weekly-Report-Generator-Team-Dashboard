'use client';

import { AuthProvider } from '@/lib/auth/AuthContext';
import { ThemeProvider } from '@/lib/theme/ThemeContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'rgb(var(--color-surface-panel))',
              border: '1px solid rgb(var(--color-line))',
              boxShadow: 'var(--shadow-subtle)',
              color: 'rgb(var(--color-ink))'
            }
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
