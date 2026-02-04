import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get the display name based on user type
  const getDisplayName = () => {
    if (!currentUser) return '';
    
    if (currentUser.type === 'user') {
      return currentUser.name.split(' ')[0]; // First name for regular users
    } else {
      return currentUser.name; // Business name for organizers
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              Eventify
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link to="/services" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Find Services</Link>
              <Link to="/events" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Public Events</Link>
              
              {/* Add My Bookings link for logged-in users */}
              {currentUser && (
                <Link to="/bookings" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  My Bookings
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {currentUser ? (
              <div className="ml-4 flex items-center md:ml-6">
                <span className="mr-4 text-sm text-gray-700">Welcome, {getDisplayName()}!</span>
                <Link to={currentUser.type === 'user' ? '/dashboard' : '/organizer/dashboard'} className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                <Button onClick={handleLogout} variant="outline" className="ml-2 !py-1 !px-3">Logout</Button>
              </div>
            ) : (
              <div className="hidden md:block">
                 <Button to="/login" variant="outline" className="mr-2">Login</Button>
                 <Button to="/register">Sign Up</Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;