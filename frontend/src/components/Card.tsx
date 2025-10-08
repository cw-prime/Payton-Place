import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const Card = ({ children, className = '', hover = false }: CardProps) => {
  const baseClasses = 'bg-white rounded-lg overflow-hidden';
  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-300' : '';

  const Component = hover ? motion.div : 'div';

  return (
    <Component
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...(hover && {
        whileHover: { y: -4 },
        transition: { duration: 0.3 },
      })}
    >
      {children}
    </Component>
  );
};

export default Card;
