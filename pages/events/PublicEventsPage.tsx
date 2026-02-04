import React, { useState, useEffect } from 'react';
import EventCard from '../../components/EventCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface Event {
  _id: string;
  name: string;
  date: string;
  venue: string;
  description: string;
  packages: {
    type: string;
    name: string;
    price: number;
  }[];
  organizer: {
    _id: string;
    businessName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Service {
  _id: string;
  organizerName: string;
  serviceType: string;
  location: string;
  rating: number;
  description: string;
  packages: {
    name: string;
    price: number;
    description: string;
    features: string[];
  }[];
  organizer: {
    _id: string;
    businessName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const PublicEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'events' | 'services'>('events');

  useEffect(() => {
    fetchPublicData();
  }, []);

  const fetchPublicData = async () => {
    try {
      setLoading(true);
      
      // Fetch events
      const eventsResponse = await fetch('http://localhost:5000/api/user/events');
      if (!eventsResponse.ok) {
        throw new Error('Failed to fetch events');
      }
      const eventsData = await eventsResponse.json();
      
      // Fetch services (we'll create this endpoint)
      const servicesResponse = await fetch('http://localhost:5000/api/user/services');
      if (!servicesResponse.ok) {
        console.log('Services endpoint not available yet');
      }
      const servicesData = await servicesResponse.ok ? await servicesResponse.json() : { services: [] };

      setEvents(eventsData.events || []);
      setServices(servicesData.services || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading events and services...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Discover Events & Services</h1>
      
      {/* Tab Navigation */}
      <div className="mb-8 border-b">
        <div className="flex space-x-4 justify-center">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'events'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('events')}
          >
            Public Events ({events.length})
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'services'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('services')}
          >
            Services ({services.length})
          </button>
        </div>
      </div>

      {/* Events Tab */}
      {activeTab === 'events' && (
        <>
          {events.length === 0 ? (
            <Card className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No Events Available</h3>
              <p className="text-gray-600">Check back later for exciting events!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {events.map(event => (
                <EventCard 
                  key={event._id} 
                  event={{
                    id: event._id,
                    name: event.name,
                    date: event.date,
                    venue: event.venue,
                    description: event.description,
                    gallery: ['/api/placeholder/300/200'], // You can add actual images later
                    tickets: {
                      general: event.packages.find(p => p.type === 'general')?.price || 0,
                      vip: event.packages.find(p => p.type === 'vip')?.price || 0
                    },
                    organizer: event.organizer?.businessName || 'Unknown Organizer'
                  }} 
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <>
          {services.length === 0 ? (
            <Card className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No Services Available</h3>
              <p className="text-gray-600">Check back later for professional services!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map(service => (
                <Card key={service._id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{service.organizerName}</h3>
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                      {service.rating} ★
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-2">{service.serviceType}</p>
                  <p className="text-gray-500 text-sm mb-4">{service.location}</p>
                  
                  <p className="text-gray-700 mb-4 line-clamp-3">{service.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Packages:</h4>
                    {service.packages.slice(0, 2).map((pkg, index) => (
                      <div key={index} className="flex justify-between text-sm mb-1">
                        <span>{pkg.name}</span>
                        <span className="font-medium">₹{pkg.price.toLocaleString()}</span>
                      </div>
                    ))}
                    {service.packages.length > 2 && (
                      <p className="text-xs text-gray-500">+{service.packages.length - 2} more packages</p>
                    )}
                  </div>
                  
                  <Button className="w-full" onClick={() => window.location.href = `/services/${service._id}`}>
                    View Details
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PublicEventsPage;