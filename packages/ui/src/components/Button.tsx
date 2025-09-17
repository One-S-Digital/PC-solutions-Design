import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'light';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  leftIcon?: React.ElementType;
  rightIcon?: React.ElementType;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-button focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed shadow-minimal hover:shadow-interactive";
  
  // These styles now use semantic names that will be defined differently by each app's Tailwind config
  const variantStyles = {
    primary: 'bg-success text-white hover:bg-opacity-90 focus:ring-success',
    secondary: 'bg-accent text-accent-contrast hover:bg-opacity-90 focus:ring-accent',
    danger: 'bg-danger text-white hover:bg-opacity-90 focus:ring-danger',
    outline: 'border border-accent text-accent hover:bg-accent/10 focus:ring-accent',
    ghost: 'text-accent hover:bg-accent/10 focus:ring-accent shadow-none hover:shadow-none',
    light: 'bg-surface-2 text-text-default hover:bg-surface-3 focus:ring-gray-300 border border-border',
  };

  const sizeStyles = {
    xs: 'px-2.5 py-1 text-xs',
    sm: 'px-3.5 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {LeftIcon && <LeftIcon className={`h-4 w-4 ${children ? 'mr-2' : ''}`} />}
      {children}
      {RightIcon && <RightIcon className={`h-4 w-4 ${children ? 'ml-2' : ''}`} />}
    </button>
  );
};

export default Button;
