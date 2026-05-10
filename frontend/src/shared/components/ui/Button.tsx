import { type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
}

export function Button({ variant = 'primary', size = 'md', fullWidth = false, className, children, ...props }: ButtonProps) {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
                {
                    'bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200': variant === 'primary',
                    'border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 hover:bg-neutral-100 dark:hover:bg-neutral-800': variant === 'outline',
                    'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800': variant === 'ghost',
                },
                {
                    'text-xs px-3 py-2': size === 'sm',
                    'text-sm px-4 py-3': size === 'md',
                    'text-base px-5 py-4': size === 'lg',
                },
                { 'w-full': fullWidth },
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}