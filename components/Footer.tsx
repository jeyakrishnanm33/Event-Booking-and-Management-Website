import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-indigo-400">Eventify</h3>
            <p className="mt-2 text-gray-400 text-sm">Plan. Book. Celebrate – All in One Place.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-200">Quick Links</h4>
            <ul className="mt-2 space-y-2">
              <li><Link to="/services" className="text-gray-400 hover:text-white text-sm">Find Organizers</Link></li>
              <li><Link to="/events" className="text-gray-400 hover:text-white text-sm">Public Events</Link></li>
              <li><Link to="/register-organizer" className="text-gray-400 hover:text-white text-sm">Become an Organizer</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-200">Support</h4>
            <ul className="mt-2 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-200">Follow Us</h4>
            {/* Social media icons can be added here */}
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Eventify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
