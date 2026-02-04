import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface Booking {
  _id: string;
  type: 'event' | 'service';
  event?: {
    _id: string;
    name: string;
    date: string;
    venue: string;
  };
  service?: {
    _id: string;
    organizerName: string;
    serviceType: string;
    location: string;
  };
  package: {
    name: string;
    price: number;
  };
  quantity: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  bookingDate: string;
  createdAt: string;
}

const UserBookingsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchUserBookings();
    }
  }, [currentUser]);

  const fetchUserBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/user/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      // Refresh bookings list
      fetchUserBookings();
      alert('Booking cancelled successfully!');
    } catch (err: any) {
      alert('Error cancelling booking: ' + err.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentUser) {
    return <div className="container mx-auto p-8 text-center">Please log in to view your bookings.</div>;
  }

  if (loading) {
    return <div className="container mx-auto p-8 text-center">Loading your bookings...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <Card className="text-center py-12">
          <h3 className="text-xl font-semibold mb-4">No Bookings Yet</h3>
          <p className="text-gray-600 mb-6">Start by exploring events and services!</p>
          <Button onClick={() => window.location.href = '/events'}>
            Browse Events & Services
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <Card key={booking._id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold">
                      {booking.type === 'event' ? booking.event?.name : booking.service?.organizerName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-2">
                    {booking.type === 'event' ? (
                      <>
                        {booking.event?.date} • {booking.event?.venue}
                      </>
                    ) : (
                      <>
                        {booking.service?.serviceType} • {booking.service?.location}
                      </>
                    )}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Package:</span>
                      <p>{booking.package.name}</p>
                    </div>
                    <div>
                      <span className="font-medium">Quantity:</span>
                      <p>{booking.quantity}</p>
                    </div>
                    <div>
                      <span className="font-medium">Total Amount:</span>
                      <p className="text-lg font-bold text-green-600">₹{booking.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-500 text-sm mt-3">
                    Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-2">
                  {booking.status === 'pending' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCancelBooking(booking._id)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = booking.type === 'event' 
                      ? `/events/${booking.event?._id}` 
                      : `/services/${booking.service?._id}`
                    }
                  >
                    View Details
                  </Button>
                </div>
              </div>
              
              {booking.paymentStatus === 'pending' && booking.status === 'pending' && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ Payment pending. Complete payment to confirm your booking.
                  </p>
                  <Button size="sm" className="mt-2">
                    Complete Payment
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookingsPage;