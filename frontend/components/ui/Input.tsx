import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

const fieldClass = 'w-full rounded-panel border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:bg-surface-page disabled:text-ink-faint';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, id, ...props },
  ref
) {
  return (
    <label className="block" htmlFor={id}>
      {label ? <span className="field-label mb-1.5 block">{label}</span> : null}
      <input ref={ref} id={id} className={cn(fieldClass, className)} {...props} />
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
