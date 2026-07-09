'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AuthVisualPanel } from '@/components/auth/AuthVisualPanel';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/lib/auth/useAuth';
import { getApiErrorMessage } from '@/lib/api/axiosClient';
import { registerSchema, type RegisterFormValues } from '@/lib/validators/auth.schema';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'team_member',
      managerInviteCode: '',
      password: '',
      confirmPassword: ''
    }
  });
  const selectedRole = useWatch({ control, name: 'role' });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        ...(values.role === 'manager' ? { managerInviteCode: values.managerInviteCode?.trim() } : {})
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not create account'));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-page px-4 py-8">
      <Card className="w-full max-w-6xl overflow-hidden">
        <CardContent className="grid min-h-[720px] p-0 lg:grid-cols-[1.15fr_0.85fr]">
          <AuthVisualPanel
            heading="Start reporting with the right project context"
            description="Create a team member account, or use an invite code when you need manager access."
          />

          <section className="flex items-center bg-white p-6 sm:p-8 lg:p-10">
            <div className="w-full">
              <div className="mb-8">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-panel bg-brand-soft text-brand">
                  <UserPlus className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-brand">Create workspace access</p>
                <h1 className="mt-2 text-2xl font-semibold text-ink">Create your account</h1>
                <p className="mt-2 text-sm text-ink-muted">
                  Team members can sign up directly. Managers need the private invite code.
                </p>
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
                <Select label="Account type" error={errors.role?.message} {...register('role')}>
                  <option value="team_member">Team member</option>
                  <option value="manager">Manager</option>
                </Select>
                {selectedRole === 'manager' ? (
                  <Input
                    label="Manager invite code"
                    type="password"
                    autoComplete="off"
                    showPasswordToggle
                    error={errors.managerInviteCode?.message}
                    {...register('managerInviteCode')}
                  />
                ) : null}
                <Input
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  showPasswordToggle
                  error={errors.password?.message}
                  {...register('password')}
                />
                <Input
                  label="Confirm password"
                  type="password"
                  autoComplete="new-password"
                  showPasswordToggle
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
            </div>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
