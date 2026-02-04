// components/ServiceListItem.tsx
interface ServiceListItemProps {
  service: {
    id: string;
    name: string;
    type: string;
    location: string;
    rating: number;
    description: string;
    price: number;
    packages: number;
  };
}

const ServiceListItem: React.FC<ServiceListItemProps> = ({ service }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
          <p className="text-gray-600 mt-1">{service.type} • {service.location}</p>
          <p className="text-gray-700 mt-2 line-clamp-2">{service.description}</p>
          <div className="flex items-center mt-3 space-x-4">
            <span className="flex items-center text-yellow-600">
              ⭐ {service.rating}
            </span>
            <span className="text-gray-600">{service.packages} packages</span>
            <span className="text-green-600 font-bold">From ₹{service.price.toLocaleString()}</span>
          </div>
        </div>
        <button 
          onClick={() => window.location.href = `/services/${service.id}`}
          className="mt-4 md:mt-0 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ServiceListItem;