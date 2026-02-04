import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/dummyData';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EventCard from '../components/EventCard';

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

const HomePage: React.FC = () => {
  const [publicEvents, setPublicEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch public events from the database
  useEffect(() => {
    const fetchPublicEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/user/events');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        
        // Get the 3 most recent events (no date filtering)
        const recentEvents = (data.events || [])
          .sort((a: Event, b: Event) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3); // Show only 3 most recent events
        
        setPublicEvents(recentEvents);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicEvents();
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-indigo-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Plan. Book. Celebrate.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-indigo-200 max-w-2xl mx-auto">
            Find trusted organizers, book events, and make memories hassle-free. All in one place.
          </p>
          <div className="mt-8 space-x-4">
            <Button to="/services" variant="primary" className="text-lg">Explore Services</Button>
            <Button to="/events" variant="secondary" className="text-lg">Book Now</Button>
          </div>
        </div>
      </section>

      

      {/* Public Events */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Public Events</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading events: {error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : publicEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No events available at the moment.</p>
              <p className="text-gray-500 text-sm mt-2">Check back later for exciting events!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publicEvents.map(event => (
                  <EventCard 
                    key={event._id} 
                    event={{
                      id: event._id,
                      name: event.name,
                      date: event.date,
                      venue: event.venue,
                      description: event.description,
                      gallery: [],
                      tickets: {
                        general: event.packages.find(p => p.type === 'general')?.price || 0,
                        vip: event.packages.find(p => p.type === 'vip')?.price || 0
                      },
                      organizer: event.organizer?.businessName || 'Event Organizer'
                    }} 
                  />
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button to="/events" variant="outline">
                  View All Events
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

          {/* Popular Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map(category => (
              <Link to="/services" key={category.name}>
                <Card className="text-center p-4 hover:shadow-lg transition-shadow cursor-pointer">
                  <img src={category.image} alt={category.name} className="w-full h-32 object-cover rounded-md mb-4" />
                  <h3 className="font-semibold text-gray-800">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count}+ Available</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">{publicEvents.length}+</div>
              <p className="text-gray-600">Featured Events</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">100+</div>
              <p className="text-gray-600">Trusted Organizers</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
              <p className="text-gray-600">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <div className="bg-indigo-600 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto text-3xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Search & Discover</h3>
              <p className="text-gray-600">Find the perfect organizer or service for your event with our powerful search and filtering tools.</p>
            </div>
            <div className="p-4">
              <div className="bg-pink-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto text-3xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Book & Pay Securely</h3>
              <p className="text-gray-600">Select your package, customize your needs, and make a secure payment in just a few clicks.</p>
            </div>
            <div className="p-4">
              <div className="bg-green-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto text-3xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Enjoy & Celebrate</h3>
              <p className="text-gray-600">Relax while our trusted partners bring your event to life. Get real-time updates and support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Unforgettable Memories?</h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have made their events special with Eventify.
          </p>
          <div className="space-x-4">
            <Button to="/register" variant="secondary" className="text-lg">
              Get Started Today
            </Button>
            <Button to="/services" variant="outline" className="text-lg border-white text-white hover:bg-white hover:text-indigo-600">
              Browse Services
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;