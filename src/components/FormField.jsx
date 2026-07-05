import { forwardRef } from 'react'

export function FormField({ label, error, required, children }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

const inputBase = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500'

export const Input = forwardRef(function Input({ className = '', ...props }, ref) {
  return <input ref={ref} className={`${inputBase} ${className}`} {...props} />
})

export const Select = forwardRef(function Select({ children, className = '', ...props }, ref) {
  return (
    <select ref={ref} className={`${inputBase} ${className}`} {...props}>
      {children}
    </select>
  )
})

export const Textarea = forwardRef(function Textarea({ className = '', ...props }, ref) {
  return <textarea ref={ref} className={`${inputBase} resize-none ${className}`} rows={3} {...props} />
})
