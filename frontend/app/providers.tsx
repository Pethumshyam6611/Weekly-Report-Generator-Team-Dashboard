'use client';

import { AuthProvider } from '@/lib/auth/AuthContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            border: '1px solid #E5E3EC',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            color: '#1A1A1F'
          }
        }}
      />
    </AuthProvider>
  );
}
