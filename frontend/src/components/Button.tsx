import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  fullWidth?: boolean;
}

const Button = ({ variant = 'primary', children, fullWidth = false, className = '', ...props }: ButtonProps) => {
  const baseClasses = 'px-6 py-3 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-gray-700 text-white hover:bg-gray-800',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
