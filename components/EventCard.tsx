import React from 'react';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: {
    id: string;
    name: string;
    date: string;
    venue: string;
    description: string;
    gallery: string[];
    tickets: {
      general: number;
      vip: number;
    };
    organizer: string;
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Generate a beautiful gradient based on event name
  const generateGradient = (text: string) => {
    const colors = [
      'from-blue-400 to-purple-500',
      'from-green-400 to-blue-500',
      'from-pink-400 to-red-500',
      'from-yellow-400 to-orange-500',
      'from-purple-400 to-pink-500',
      'from-teal-400 to-blue-500'
    ];
    
    // Simple hash function to get consistent color for same event name
    const hash = text.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  const gradientClass = generateGradient(event.name);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Event Image with Gradient Placeholder */}
      <div className={`h-48 bg-gradient-to-r ${gradientClass} flex items-center justify-center text-white p-4 relative`}>
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">🎉</div>
          <h3 className="text-xl font-bold leading-tight">{event.name}</h3>
        </div>
        
        {/* Event Date Badge */}
        <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-medium">
          {formatDate(event.date)}
        </div>
        
        {/* Organizer Badge */}
        <div className="absolute top-3 right-3 bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded text-xs">
          By {event.organizer}
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-2 mb-3">
          <p className="text-gray-600 text-sm flex items-center">
            📍 {event.venue}
          </p>
          <p className="text-gray-500 text-xs">
            🗓️ {formatDate(event.date)}
          </p>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-2 h-10">
          {event.description}
        </p>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-center">
            <span className="text-green-600 font-bold text-lg block">₹{event.tickets.general.toLocaleString()}</span>
            <span className="text-gray-500 text-xs">General</span>
          </div>
          <div className="text-center">
            <span className="text-purple-600 font-bold text-lg block">₹{event.tickets.vip.toLocaleString()}</span>
            <span className="text-gray-500 text-xs">VIP</span>
          </div>
        </div>
        
        <Link 
          to={`/events/${event.id}`} 
          className="block w-full bg-indigo-600 text-white text-center py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;