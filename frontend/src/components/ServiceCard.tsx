import * as Icons from 'lucide-react';
import type { Service } from '../types';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  // Dynamically get the icon component
  const IconComponent = (Icons as any)[service.icon] || Icons.Home;

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
      <div className="mb-4">
        <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
          <IconComponent className="w-7 h-7 text-gray-700" />
        </div>
      </div>
      <h3 className="text-lg font-bold mb-2">{service.name}</h3>
      <p className="text-gray-600 text-sm">{service.description}</p>
    </div>
  );
};

export default ServiceCard;
