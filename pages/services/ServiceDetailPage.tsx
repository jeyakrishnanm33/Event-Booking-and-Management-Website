import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

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
    phone: string;
    serviceType: string;
  };
  createdAt: string;
  updatedAt: string;
}

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');

  useEffect(() => {
    if (id) {
      fetchServiceDetails(id);
    }
  }, [id]);
  
  const fetchServiceDetails = async (serviceId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/user/services/${serviceId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Service not found');
        }
        throw new Error('Failed to fetch service details');
      }
      
      const data = await response.json();
      setService(data.service);
      // Auto-select first package
      if (data.service.packages.length > 0) {
        setSelectedPackage(data.service.packages[0].name);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching service details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = async () => {
    if (!service || !currentUser) {
      alert('Please log in to book this service');
      navigate('/login');
      return;
    }

    if (!selectedPackage) {
      alert('Please select a package');
      return;
    }

    try {
      setBookingLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/user/bookings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          serviceId: service._id,
          packageName: selectedPackage,
          customerNotes: `Booking for ${service.serviceType} service by ${service.organizerName}`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      const data = await response.json();
      alert(`Service booked successfully! Amount: ₹${data.booking.totalAmount.toLocaleString()}`);
      navigate('/bookings');
      
    } catch (err: any) {
      alert('Error booking service: ' + err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">Error: {error || 'Service not found'}</div>
          <Button onClick={() => navigate('/services')}>
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  const selectedPackageData = service.packages.find(p => p.name === selectedPackage);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            {/* Service Header */}
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg p-8 text-white mb-6">
              <h1 className="text-4xl font-bold mb-2">{service.organizerName}</h1>
              <p className="text-xl opacity-90">{service.serviceType}</p>
              <div className="flex items-center mt-4">
                <span className="text-2xl font-bold mr-2">{service.rating} ★</span>
                <span className="text-lg">{service.location}</span>
              </div>
            </div>

            {/* Service Description */}
            <Card className="p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">About the Service</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{service.description}</p>
            </Card>

            {/* Packages */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Service Packages</h2>
              <div className="space-y-4">
                {service.packages.map((pkg, index) => (
                  <div 
                    key={index}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPackage === pkg.name 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPackage(pkg.name)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{pkg.name}</h3>
                      <span className="text-xl font-bold text-green-600">₹{pkg.price.toLocaleString()}</span>
                    </div>
                    <p className="text-gray-600 mb-3">{pkg.description}</p>
                    <div>
                      <h4 className="font-medium mb-2">Features:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-4">Book This Service</h2>
              
              {/* Organizer Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">Service Provider</h3>
                <p className="text-gray-600">{service.organizer?.businessName}</p>
                <p className="text-sm text-gray-500">{service.organizer?.email}</p>
                {service.organizer?.phone && (
                  <p className="text-sm text-gray-500">Phone: {service.organizer.phone}</p>
                )}
              </div>

              {/* Selected Package */}
              {selectedPackageData && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">Selected Package</h3>
                  <p className="text-blue-800 font-medium">{selectedPackageData.name}</p>
                  <p className="text-blue-700">₹{selectedPackageData.price.toLocaleString()}</p>
                </div>
              )}

              {/* Booking Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between items-center border-t pt-2">
                  <p className="text-xl font-bold">Total Amount</p>
                  <p className="text-xl font-bold text-indigo-600">
                    ₹{selectedPackageData?.price.toLocaleString() || '0'}
                  </p>
                </div>
              </div>

              <Button 
                className="w-full mt-6 text-lg py-3" 
                onClick={handleBookService}
                disabled={bookingLoading || !selectedPackage}
              >
                {bookingLoading ? 'Booking...' : 'Book Service'}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Secure booking • Professional service • Customer support
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;