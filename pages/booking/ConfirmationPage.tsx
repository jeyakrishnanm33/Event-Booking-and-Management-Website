import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ConfirmationPage: React.FC = () => {
    const location = useLocation();
    const { bookingId, transactionId, totalPaid, organizer, eventDate } = location.state || {
        bookingId: 'BK-20250926-1234',
        transactionId: 'TXN789456',
        totalPaid: 200000,
        organizer: 'Star Weddings Co.',
        eventDate: '10 Dec 2025'
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-2xl mx-auto">
                <Card className="p-8 text-center">
                    <div className="mx-auto bg-green-100 rounded-full h-20 w-20 flex items-center justify-center">
                        <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h1 className="text-3xl font-bold mt-6">Booking Confirmed!</h1>
                    <p className="text-gray-600 mt-2">
                        Thank you for your payment. Your event is booked and confirmed.
                    </p>

                    <div className="text-left bg-gray-50 rounded-lg p-6 mt-8 space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Booking ID</span>
                            <span className="font-semibold">{bookingId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Transaction ID</span>
                            <span className="font-semibold">{transactionId}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-500">Event Date</span>
                            <span className="font-semibold">{eventDate}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-500">Organizer</span>
                            <span className="font-semibold">{organizer}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-500">Amount Paid</span>
                            <span className="font-semibold text-xl">₹{totalPaid.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button to="/dashboard">Go to My Dashboard</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ConfirmationPage;
