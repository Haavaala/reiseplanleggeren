import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
  ReactNode,
} from 'react'
import { useId } from 'react'
import { cn } from '@/utils/cn'

const fieldBase =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ' +
  'placeholder:text-slate-400 shadow-sm transition-colors ' +
  'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 ' +
  'disabled:cursor-not-allowed disabled:bg-slate-50'

interface FieldWrapProps {
  label?: string
  error?: string
  hint?: string
  htmlFor: string
  children: ReactNode
}

function FieldWrap({ label, error, hint, htmlFor, children }: FieldWrapProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  return (
    <FieldWrap label={label} error={error} hint={hint} htmlFor={fieldId}>
      <input
        id={fieldId}
        className={cn(fieldBase, error && 'border-red-400', className)}
        {...props}
      />
    </FieldWrap>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export function Textarea({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: TextareaProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  return (
    <FieldWrap label={label} error={error} hint={hint} htmlFor={fieldId}>
      <textarea
        id={fieldId}
        className={cn(fieldBase, 'resize-y', error && 'border-red-400', className)}
        {...props}
      />
    </FieldWrap>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
}

export function Select({
  label,
  error,
  hint,
  className,
  id,
  children,
  ...props
}: SelectProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  return (
    <FieldWrap label={label} error={error} hint={hint} htmlFor={fieldId}>
      <select
        id={fieldId}
        className={cn(fieldBase, 'appearance-none pr-8', className)}
        {...props}
      >
        {children}
      </select>
    </FieldWrap>
  )
}
