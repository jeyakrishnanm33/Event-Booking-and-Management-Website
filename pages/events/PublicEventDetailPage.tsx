import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
    phone: string;
    serviceType: string;
  };
  createdAt: string;
  updatedAt: string;
}

const PublicEventDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticketType, setTicketType] = useState('general');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchEventDetails(id);
    }
  }, [id]);

  const fetchEventDetails = async (eventId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/user/events/${eventId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Event not found');
        }
        throw new Error('Failed to fetch event details');
      }
      
      const data = await response.json();
      setEvent(data.event);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching event details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookTickets = async () => {
    if (!event || !currentUser) {
      alert('Please log in to book tickets');
      navigate('/login');
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
          eventId: event._id,
          ticketType,
          quantity,
          customerNotes: `Booking for ${event.name}`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      const data = await response.json();
      alert(`Booking created successfully! Total amount: ₹${data.booking.totalAmount.toLocaleString()}`);
      navigate('/bookings');
      
    } catch (err: any) {
      alert('Error creating booking: ' + err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  // ... (rest of the component remains similar, but update the booking button)
  // Replace the existing Button in the booking card with:
  <Button 
    className="w-full mt-6 text-lg py-3" 
    onClick={handleBookTickets}
    disabled={bookingLoading}
  >
    {bookingLoading ? 'Booking...' : 'Book Now'}
  </Button>

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading event details...</div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The event you are looking for does not exist.'}</p>
            <Button onClick={() => navigate('/events')}>Back to Events</Button>
          </Card>
        </div>
      </div>
    );
  }

  const generalPrice = event.packages.find(p => p.type === 'general')?.price || 0;
  const vipPrice = event.packages.find(p => p.type === 'vip')?.price || 0;
  const ticketPrice = ticketType === 'general' ? generalPrice : vipPrice;
  const totalCost = ticketPrice * quantity;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            {/* Event Image Placeholder */}
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg shadow-lg w-full h-64 mb-4 flex items-center justify-center text-white text-2xl font-bold">
              {event.name}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900">{event.name}</h1>
            
            <div className="flex items-center mt-2 text-gray-600">
              <span className="text-lg">{event.date} • {event.venue}</span>
            </div>
            
            <div className="mt-4">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                Organized by: {event.organizer?.businessName || 'Unknown Organizer'}
              </span>
            </div>

            <div className="mt-6 border-t pt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">About the Event</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>

            <div className="mt-6 border-t pt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Ticket Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <div>
                    <h4 className="font-semibold">General Admission</h4>
                    <p className="text-sm text-gray-600">Standard access to the event</p>
                  </div>
                  <span className="text-lg font-bold text-green-600">₹{generalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <div>
                    <h4 className="font-semibold">VIP Pass</h4>
                    <p className="text-sm text-gray-600">Premium access with extra benefits</p>
                  </div>
                  <span className="text-lg font-bold text-purple-600">₹{vipPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Card className="p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-4">Book Tickets</h2>
              
              {/* Organizer Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">Organizer</h3>
                <p className="text-gray-600">{event.organizer?.businessName || 'Unknown Organizer'}</p>
              </div>

              {/* Ticket Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Type</label>
                <select 
                  value={ticketType} 
                  onChange={e => setTicketType(e.target.value)} 
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="general">General Admission - ₹{generalPrice.toLocaleString()}</option>
                  <option value="vip">VIP Pass - ₹{vipPrice.toLocaleString()}</option>
                </select>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input 
                  type="number" 
                  min="1" 
                  max="10"
                  value={quantity} 
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Price Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <p className="text-gray-600">Ticket Price</p>
                  <p className="text-gray-900">₹{ticketPrice.toLocaleString()} × {quantity}</p>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <p className="text-xl font-bold">Total</p>
                  <p className="text-xl font-bold text-indigo-600">₹{totalCost.toLocaleString()}</p>
                </div>
              </div>

              <Button className="w-full mt-6 text-lg py-3" onClick={handleBookTickets}>
                Book Now
              </Button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Secure booking • Instant confirmation • 24/7 support
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicEventDetailPage;