import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userBookings, paymentHistory } from '../../data/dummyData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const UserDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  if (!currentUser || currentUser.type !== 'user') {
    return <div className="container mx-auto p-8 text-center">Please log in to view your dashboard.</div>;
  }
  
  const upcomingBookings = userBookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending');
  const pastBookings = userBookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* My Bookings */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
            
            <h3 className="font-bold text-lg text-gray-700 mb-2">Upcoming</h3>
            {upcomingBookings.length > 0 ? upcomingBookings.map(booking => (
              <div key={booking.id} className="border rounded-lg p-4 mb-4 flex justify-between items-center">
                <div>
                  <p className="font-bold">{booking.serviceName} - {booking.organizerName}</p>
                  <p className="text-sm text-gray-600">Date: {booking.eventDate}</p>
                  <p className="text-sm text-gray-600">Status: <span className="font-semibold text-green-600">{booking.status}</span></p>
                </div>
                <p className="font-bold text-lg">₹{booking.totalCost.toLocaleString()}</p>
              </div>
            )) : <p className="text-gray-500">No upcoming bookings.</p>}
            
            <h3 className="font-bold text-lg text-gray-700 mt-6 mb-2">Past</h3>
            {pastBookings.length > 0 ? pastBookings.map(booking => (
              <div key={booking.id} className="border rounded-lg p-4 mb-4 flex justify-between items-center bg-gray-50">
                <div>
                  <p className="font-bold text-gray-700">{booking.serviceName} - {booking.organizerName}</p>
                  <p className="text-sm text-gray-500">Date: {booking.eventDate}</p>
                   <p className="text-sm text-gray-500">Status: {booking.status}</p>
                </div>
                {booking.status === 'Completed' && (
                  <Button to={`/feedback/${booking.id}`} variant="outline">Leave Feedback</Button>
                )}
              </div>
            )) : <p className="text-gray-500">No past bookings.</p>}
          </Card>

          {/* Payment History */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">Transaction ID</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">Amount</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map(payment => (
                    <tr key={payment.transactionId} className="border-b">
                      <td className="py-2 px-3">{payment.transactionId}</td>
                      <td className="py-2 px-3">₹{payment.amount.toLocaleString()}</td>
                      <td className="py-2 px-3">{payment.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{currentUser.name}</p>
              </div>
               <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{currentUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{currentUser.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{currentUser.address || 'Not specified'}</p>
              </div>
               <Button variant="outline" className="w-full mt-4">Edit Profile</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
