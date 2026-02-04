import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userBookings } from '../../data/dummyData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const StarRatingInput: React.FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            className={`text-4xl transition-colors ${ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            onClick={() => setRating(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};


const FeedbackPage: React.FC = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const booking = userBookings.find(b => b.id === bookingId);
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('Flawless execution, highly recommend!');

  if (!booking) {
    return <div className="container mx-auto p-8 text-center">Booking not found.</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    console.log({ bookingId, rating, comment });
    alert('Thank you for your feedback!');
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Leave Feedback</h1>
        <Card className="p-8">
          <p className="mb-2">You are reviewing your booking with:</p>
          <h2 className="text-2xl font-semibold mb-6">{booking.organizerName}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Your Rating</label>
              <StarRatingInput rating={rating} setRating={setRating} />
            </div>
            <div>
              <label htmlFor="comment" className="block text-lg font-medium text-gray-700 mb-2">Your Comment</label>
              <textarea
                id="comment"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">Submit Feedback</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackPage;
