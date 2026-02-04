import React from 'react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  service: {
    _id: any;
    id: string;
    organizerName: string;
    serviceType: string;
    location: string;
    rating: number;
    description: string;
    packages: Array<{
      name: string;
      price: number;
      description: string;
      features: string[];
    }>;
  };
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  // Generate a beautiful gradient based on service type
  const generateGradient = (text: string) => {
    const colors = [
      'from-blue-400 to-purple-500',
      'from-green-400 to-teal-500',
      'from-pink-400 to-rose-500',
      'from-orange-400 to-red-500',
      'from-purple-400 to-indigo-500',
      'from-teal-400 to-cyan-500',
      'from-amber-400 to-yellow-500',
      'from-emerald-400 to-green-500'
    ];
    
    const hash = text.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  const gradientClass = generateGradient(service.serviceType);
  const startingPrice = Math.min(...service.packages.map(p => p.price));

  // Generate stars based on rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-lg ${
              i < Math.floor(rating) 
                ? 'text-yellow-400' 
                : i < rating 
                  ? 'text-yellow-300' 
                  : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  // Get service icon based on service type
  const getServiceIcon = (serviceType: string) => {
    const icons: { [key: string]: string } = {
      'wedding': '💒',
      'photography': '📸',
      'catering': '🍽️',
      'music': '🎵',
      'decoration': '🎨',
      'planning': '📋',
      'venue': '🏛️',
      'entertainment': '🎪',
      'default': '💼'
    };
    
    const lowerType = serviceType.toLowerCase();
    for (const [key, icon] of Object.entries(icons)) {
      if (lowerType.includes(key)) return icon;
    }
    return icons.default;
  };

  const serviceIcon = getServiceIcon(service.serviceType);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Service Header with Gradient */}
      <div className={`h-40 bg-gradient-to-r ${gradientClass} relative p-6 text-white`}>
        <div className="absolute top-4 left-4 text-3xl bg-white bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center">
          {serviceIcon}
        </div>
        
        <div className="absolute top-4 right-4 bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm font-semibold">
          Starting at ₹{startingPrice.toLocaleString()}
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold truncate">{service.organizerName}</h3>
          <p className="text-white text-opacity-90 text-sm truncate">{service.serviceType}</p>
        </div>
      </div>
      
      <div className="p-6">
        {/* Location and Rating */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center text-gray-600 text-sm">
            <span className="mr-1">📍</span>
            {service.location}
          </div>
          {renderStars(service.rating)}
        </div>
        
        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-2 h-12">
          {service.description}
        </p>
        
        {/* Packages Preview */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Packages</span>
            <span>{service.packages.length} options</span>
          </div>
          <div className="space-y-1">
            {service.packages.slice(0, 2).map((pkg, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="truncate flex-1 mr-2">{pkg.name}</span>
                <span className="font-semibold text-green-600 whitespace-nowrap">
                  ₹{pkg.price.toLocaleString()}
                </span>
              </div>
            ))}
            {service.packages.length > 2 && (
              <div className="text-xs text-gray-500 text-center">
                +{service.packages.length - 2} more packages
              </div>
            )}
          </div>
        </div>
        
        {/* Features Preview */}
        {service.packages[0]?.features && service.packages[0].features.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Includes:</div>
            <div className="flex flex-wrap gap-1">
              {service.packages[0].features.slice(0, 3).map((feature, index) => (
                <span 
                  key={index}
                  className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
              {service.packages[0].features.length > 3 && (
                <span className="text-gray-500 text-xs">+{service.packages[0].features.length - 3} more</span>
              )}
            </div>
          </div>
        )}
        
        {/* CTA Button */}
// ServiceCard.tsx - Fix the Link
<Link 
  to={`/services/${service._id}`}  // Change service.id to service._id
  className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold"
>
  View Details
</Link>
      </div>
    </div>
  );
};

export default ServiceCard;