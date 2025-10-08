import { ReactNode } from 'react';

interface SectionHeadingProps {
  children: ReactNode;
  subtitle?: string;
  centered?: boolean;
}

const SectionHeading = ({ children, subtitle, centered = false }: SectionHeadingProps) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      <h2 className="text-4xl font-bold mb-4">{children}</h2>
      {subtitle && <p className="text-gray-600 text-lg max-w-3xl">{subtitle}</p>}
    </div>
  );
};

export default SectionHeading;
