import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary: 'border-brand bg-brand text-white hover:bg-brand-hover disabled:bg-brand/60',
  secondary: 'border-line bg-white text-ink hover:bg-surface-subtle disabled:text-ink-faint',
  ghost: 'border-transparent bg-transparent text-ink-muted hover:bg-surface-subtle hover:text-ink disabled:text-ink-faint',
  danger: 'border-status-late bg-status-late text-white hover:bg-red-800 disabled:bg-status-late/60'
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-3 text-sm',
  md: 'h-10 gap-2 px-4 text-sm'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-panel border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand/25 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
});
