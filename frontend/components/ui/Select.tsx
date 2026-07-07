import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options?: Array<{ label: string; value: string | number }>;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, className, id, children, ...props },
  ref
) {
  return (
    <label className="block" htmlFor={id}>
      {label ? <span className="field-label mb-1.5 block">{label}</span> : null}
      <select
        ref={ref}
        id={id}
        className={cn(
          'h-10 w-full rounded-panel border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:bg-surface-page disabled:text-ink-faint',
          className
        )}
        {...props}
      >
        {options
          ? options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
          : children}
      </select>
      {error ? <p className="field-error">{error}</p> : null}
    </label>
  );
});
