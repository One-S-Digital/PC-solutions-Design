import React, { ReactNode } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverEffect = false, ...rest }) => {
  const baseClasses = 'bg-surface-1 rounded-card shadow-soft';
  const hoverClasses = hoverEffect ? 'hover:shadow-float hover:scale-[1.015] transition-all duration-300 ease-in-out' : '';
  
  return (
    <div
      {...rest}
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {children}
    </div>
  );
};

export default Card;
