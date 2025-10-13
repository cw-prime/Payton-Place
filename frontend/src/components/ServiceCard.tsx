import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import type { Service } from '../types';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  // Dynamically get the icon component
  const IconComponent = (Icons as any)[service.icon] || Icons.Home;

  return (
    <Link
      to={`/service-request?serviceId=${service._id}`}
      className="block border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col h-full group"
    >
      <div className="mb-4">
        <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
          <IconComponent className="w-7 h-7 text-gray-700 group-hover:text-blue-600 transition-colors" />
        </div>
      </div>
      <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">{service.name}</h3>
      <p className="text-gray-600 text-sm mb-4 flex-grow">{service.description}</p>
      <div className="inline-flex items-center justify-center gap-2 text-blue-600 group-hover:text-blue-700 font-medium text-sm transition-colors">
        Request This Service
        <Icons.ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
};

export default ServiceCard;
