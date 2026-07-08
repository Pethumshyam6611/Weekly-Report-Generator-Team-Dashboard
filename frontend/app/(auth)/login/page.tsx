'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AuthVisualPanel } from '@/components/auth/AuthVisualPanel';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth/useAuth';
import { getApiErrorMessage } from '@/lib/api/axiosClient';
import { loginSchema, type LoginFormValues } from '@/lib/validators/auth.schema';

export default function LoginPage() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Invalid credentials'));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-page px-4 py-8">
      <Card className="w-full max-w-6xl overflow-hidden">
        <CardContent className="grid min-h-[680px] p-0 lg:grid-cols-[1.15fr_0.85fr]">
          <AuthVisualPanel
            heading="Team updates in one clear dashboard"
            description="Create reports, track progress, and review project blockers with a focused workspace."
          />

          <section className="flex items-center bg-white p-6 sm:p-8 lg:p-10">
            <div className="w-full">
              <div className="mb-8">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-panel bg-brand-soft text-brand">
                  <LogIn className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-brand">Welcome back</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">Log in to your account</h2>
                <p className="mt-2 text-sm text-ink-muted">Use your account credentials to continue.</p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <Button type="submit" className="w-full" isLoading={isSubmitting}>
                  Log in
                </Button>
              </form>

              <p className="mt-5 text-center text-sm text-ink-muted">
                Need an account?{' '}
                <Link className="font-medium text-brand hover:text-brand-hover" href="/register">
                  Register
                </Link>
              </p>
            </div>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
