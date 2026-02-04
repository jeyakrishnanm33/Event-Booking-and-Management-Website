import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const PaymentPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { service, selectedPackage, totalEstimate } = location.state || {};
    const [paymentMethod, setPaymentMethod] = useState('card');

    if (!service) {
        return <div className="p-8 text-center">Invalid booking details. Please start again.</div>
    }

    const handlePayment = () => {
        // Simulate payment success
        const bookingId = `BK-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}-1234`;
        const transactionId = `TXN${Math.floor(100000 + Math.random() * 900000)}`;
        navigate('/confirmation', { state: { bookingId, transactionId, totalPaid: totalEstimate, organizer: service.organizerName, eventDate: '10 Dec 2025' } });
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold mb-8 text-center">Secure Payment</h1>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <Card className="p-6">
                        <h2 className="text-2xl font-semibold mb-4">Choose Payment Method</h2>
                        {/* Payment Options */}
                        <div className="space-y-3">
                            <div onClick={() => setPaymentMethod('card')} className={`border p-4 rounded-lg cursor-pointer ${paymentMethod === 'card' ? 'border-indigo-500 ring-2 ring-indigo-200' : ''}`}>Credit/Debit Card</div>
                            <div onClick={() => setPaymentMethod('upi')} className={`border p-4 rounded-lg cursor-pointer ${paymentMethod === 'upi' ? 'border-indigo-500 ring-2 ring-indigo-200' : ''}`}>UPI</div>
                            <div onClick={() => setPaymentMethod('netbanking')} className={`border p-4 rounded-lg cursor-pointer ${paymentMethod === 'netbanking' ? 'border-indigo-500 ring-2 ring-indigo-200' : ''}`}>Net Banking</div>
                        </div>

                        {paymentMethod === 'card' && (
                            <div className='mt-6 space-y-4'>
                                <Input label="Card Number" id="card-number" placeholder="0000 0000 0000 0000" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Expiry (MM/YY)" id="expiry" placeholder="MM/YY" />
                                    <Input label="CVV" id="cvv" placeholder="123" />
                                </div>
                            </div>
                        )}
                         {paymentMethod === 'upi' && (
                            <div className='mt-6'>
                                <Input label="UPI ID" id="upi-id" placeholder="yourname@bank" />
                            </div>
                        )}
                    </Card>
                </div>
                <div>
                    <Card className="p-6 sticky top-24">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-3">Order Summary</h2>
                        <div className="space-y-3 mt-4">
                            <p className="font-bold text-lg">{selectedPackage.name} Wedding Package</p>
                             <div className="flex justify-between items-center">
                                <p className="text-gray-600">Organizer</p>
                                <p className="font-medium">{service.organizerName}</p>
                            </div>
                            <div className="border-t pt-3 mt-3 flex justify-between items-center">
                                <p className="text-xl font-bold">Amount Payable</p>
                                <p className="text-xl font-bold text-indigo-600">₹{totalEstimate.toLocaleString()}</p>
                            </div>
                        </div>
                        <Button onClick={handlePayment} className="w-full mt-6">
                            Pay ₹{totalEstimate.toLocaleString()}
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
