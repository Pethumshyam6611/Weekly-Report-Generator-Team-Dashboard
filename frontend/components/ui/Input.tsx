'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef, useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
};

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

const fieldClass = 'w-full rounded-panel border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:bg-surface-page disabled:text-ink-faint';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, id, type, showPasswordToggle, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const canTogglePassword = showPasswordToggle && type === 'password' && !props.disabled;
  const inputType = canTogglePassword && isPasswordVisible ? 'text' : type;

  return (
    <label className="block" htmlFor={inputId}>
      {label ? <span className="field-label mb-1.5 block">{label}</span> : null}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          className={cn(fieldClass, canTogglePassword ? 'pr-10' : null, className)}
          {...props}
        />
        {canTogglePassword ? (
          <button
            type="button"
            className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-ink-muted transition hover:bg-brand-soft hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            onClick={() => setIsPasswordVisible((current) => !current)}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            aria-pressed={isPasswordVisible}
          >
            {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        ) : null}
      </div>
      {error ? <p className="field-error">{error}</p> : null}
    </label>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className, id, ...props },
  ref
) {
  return (
    <label className="block" htmlFor={id}>
      {label ? <span className="field-label mb-1.5 block">{label}</span> : null}
      <textarea ref={ref} id={id} className={cn(fieldClass, 'min-h-28 resize-y', className)} {...props} />
      {error ? <p className="field-error">{error}</p> : null}
    </label>
  );
});
