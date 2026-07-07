'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth/useAuth';
import { getApiErrorMessage } from '@/lib/api/axiosClient';
import { registerSchema, type RegisterFormValues } from '@/lib/validators/auth.schema';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not create account'));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-page px-4 py-10">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-panel bg-brand-soft text-brand">
              <UserPlus className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold text-ink">Create account</h1>
            <p className="mt-1 text-sm text-ink-muted">New accounts are created as team members.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input label="Name" autoComplete="name" error={errors.name?.message} {...register('name')} />
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
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Register
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-ink-muted">
            Already have an account?{' '}
            <Link className="font-medium text-brand hover:text-brand-hover" href="/login">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
