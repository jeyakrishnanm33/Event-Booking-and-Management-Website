import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { services } from '../../data/dummyData';
import { Package } from '../../types';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const BookingPage: React.FC = () => {
  const { serviceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const service = services.find(s => s.id === serviceId);

  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [eventDate, setEventDate] = useState('2025-12-10');
  const [venue, setVenue] = useState('Leela Palace, Chennai');
  const [cateringAddon, setCateringAddon] = useState(false);

  useEffect(() => {
    if (location.state?.selectedPackage) {
      setSelectedPackage(location.state.selectedPackage);
    } else if (service?.packages.length) {
      setSelectedPackage(service.packages[0]);
    }
  }, [location.state, service]);
  
  if (!service) {
    return <div>Service not found</div>;
  }
  
  if (!selectedPackage) {
      return <div>Loading package...</div>
  }

  const cateringCost = 50000;
  const totalEstimate = selectedPackage.price + (cateringAddon ? cateringCost : 0);
  
  const handleProceedToPayment = () => {
      navigate('/payment', {state: { service, selectedPackage, totalEstimate }})
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Book Your Event</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Event Details</h2>
            <form className="space-y-6">
              <Input
                label="Event Date"
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
              <Input
                label="Venue Address"
                id="venue"
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
              />
              <div>
                <h3 className="text-lg font-medium mb-2">Extras</h3>
                <div className="flex items-center">
                    <input
                        id="catering"
                        type="checkbox"
                        checked={cateringAddon}
                        onChange={(e) => setCateringAddon(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="catering" className="ml-2 block text-sm text-gray-900">
                        Catering Add-on (+₹{cateringCost.toLocaleString()})
                    </label>
                </div>
              </div>
            </form>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-3">Order Summary</h2>
            <div className="space-y-3 mt-4">
              <p className="font-bold text-lg">{service.organizerName}</p>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">{selectedPackage.name} Package</p>
                <p className="font-medium">₹{selectedPackage.price.toLocaleString()}</p>
              </div>
              {cateringAddon && (
                 <div className="flex justify-between items-center">
                    <p className="text-gray-600">Catering Add-on</p>
                    <p className="font-medium">₹{cateringCost.toLocaleString()}</p>
                </div>
              )}
              <div className="border-t pt-3 mt-3 flex justify-between items-center">
                <p className="text-xl font-bold">Total Estimate</p>
                <p className="text-xl font-bold text-indigo-600">₹{totalEstimate.toLocaleString()}</p>
              </div>
            </div>
            <Button onClick={handleProceedToPayment} className="w-full mt-6">
              Proceed to Payment
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
