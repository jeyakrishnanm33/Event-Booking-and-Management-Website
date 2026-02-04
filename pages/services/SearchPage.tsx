import React, { useState, useEffect } from 'react';
import ServiceListItem from '../../components/ServiceListItem';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

interface Service {
  _id: string;
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
  organizer: {
    _id: string;
    businessName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const SearchPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState('');
  const [location, setLocation] = useState('');

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/user/services');
        
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        
        const data = await response.json();
        setServices(data.services || []);
        setFilteredServices(data.services || []);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter services based on search criteria
  const handleSearch = () => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (eventType) {
      filtered = filtered.filter(service =>
        service.serviceType.toLowerCase().includes(eventType.toLowerCase())
      );
    }

    if (location) {
      filtered = filtered.filter(service =>
        service.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  // Get unique locations and service types for dropdowns
  const uniqueLocations = [...new Set(services.map(service => service.location))];
  const uniqueServiceTypes = [...new Set(services.map(service => service.serviceType))];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Find the Perfect Event Service</h1>
      
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <Input 
          label="Search by Name" 
          id="search-name" 
          placeholder="e.g., Perfect Weddings" 
          className="lg:col-span-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <Select 
          label="Service Type" 
          id="service-type"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        >
          <option value="">All Types</option>
          {uniqueServiceTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>
        
        <Select 
          label="Location" 
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {uniqueLocations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </Select>
        
        <Button 
          className="w-full" 
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Search'}
        </Button>
      </div>

      {/* Results */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
        </h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">No services found matching your criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search filters.</p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setEventType('');
                setLocation('');
                setFilteredServices(services);
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div>
            {filteredServices.map(service => (
              <ServiceListItem 
                key={service._id} 
                service={{
                  id: service._id,
                  name: service.organizerName,
                  type: service.serviceType,
                  location: service.location,
                  rating: service.rating,
                  description: service.description,
                  price: Math.min(...service.packages.map(p => p.price)),
                  packages: service.packages.length
                }} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;