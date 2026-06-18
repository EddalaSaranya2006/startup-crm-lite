import React from 'react'

const Button = ({ text, variant = 'primary', className = '', ...props }) => {
    const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 min-h-[44px] flex items-center justify-center';

    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-sm hover:shadow-md',
        secondary: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white',
        success: 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white',
        danger: 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white',
    };

    const variantClass = variants[variant] || variants.primary;

    return (
        <button className={`${baseStyles} ${variantClass} ${className}`} {...props}>
            {text}
        </button>
    )
}

export default Button
