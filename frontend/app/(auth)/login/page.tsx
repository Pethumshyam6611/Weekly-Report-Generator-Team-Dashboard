'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { BarChart3, CheckCircle2, LogIn, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
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
    <main className="flex min-h-screen items-center justify-center bg-surface-page px-4 py-10">
      <Card className="w-full max-w-4xl overflow-hidden">
        <CardContent className="grid p-0 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="border-b border-line bg-white p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="flex h-11 w-11 items-center justify-center rounded-panel bg-brand-soft text-brand">
              <BarChart3 className="h-5 w-5" />
            </div>

            <div className="mt-8 max-w-md">
              <p className="text-sm font-medium text-brand">Weekly report generator</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-normal text-ink">
                Welcome to the platform
              </h1>
              <p className="mt-3 text-sm leading-6 text-ink-muted">
                Sign in to manage weekly reports, review team submissions, monitor blockers, and keep project updates organized in one workspace.
              </p>
            </div>

            <div className="mt-8 grid gap-3 text-sm text-ink-muted">
              <div className="flex items-start gap-3 rounded-panel border border-line bg-surface-page p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-status-submitted" />
                <span>Submit weekly progress updates with clear project context.</span>
              </div>
              <div className="flex items-start gap-3 rounded-panel border border-line bg-surface-page p-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>Role-based access keeps team member and manager views separate.</span>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 sm:p-8">
            <div className="mb-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-panel bg-brand-soft text-brand">
                <LogIn className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-ink">Log in</h2>
              <p className="mt-1 text-sm text-ink-muted">Use your account credentials to continue.</p>
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
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
