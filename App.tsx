// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // Change this line
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import OrganizerRegisterPage from './pages/auth/OrganizerRegisterPage';
import UserDashboardPage from './pages/user/DashboardPage';
import SearchPage from './pages/services/SearchPage';
import ServiceDetailPage from './pages/services/ServiceDetailPage';
import BookingPage from './pages/booking/BookingPage';
import PaymentPage from './pages/booking/PaymentPage';
import ConfirmationPage from './pages/booking/ConfirmationPage';
import FeedbackPage from './pages/user/FeedbackPage';
import OrganizerDashboardPage from './pages/organizer/DashboardPage';
import OrganizerServicesPage from './pages/organizer/ServicesPage';
import PublicEventsPage from './pages/events/PublicEventsPage';
import PublicEventDetailPage from './pages/events/PublicEventDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import UserBookingsPage from './pages/user/UserBookingsPage';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router> {/* Change from HashRouter to Router (which is BrowserRouter) */}
                <MainLayout />
            </Router>
        </AuthProvider>
    );
};

const MainLayout: React.FC = () => {
    const location = useLocation();
    const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/register') || location.pathname.startsWith('/forgot-password');
    
    return (
        <div className="flex flex-col min-h-screen">
            {!isAuthPage && <Header />}
            <main className="flex-grow">
                <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
  <Route path="/register-organizer" element={<OrganizerRegisterPage />} />

  {/* User Routes */}
  <Route path="/dashboard" element={<UserDashboardPage />} />
  <Route path="/bookings" element={<UserBookingsPage />} />
  <Route path="/feedback/:bookingId" element={<FeedbackPage />} />

  {/* Organizer Routes */}
  <Route path="/organizer/dashboard" element={<OrganizerDashboardPage />} />
  <Route path="/organizer/services" element={<OrganizerServicesPage />} />

  {/* Services */}
  <Route path="/services" element={<SearchPage />} />
  <Route path="/services/:id" element={<ServiceDetailPage />} />  {/* Keep ONLY this */}

  {/* Events */}
  <Route path="/events" element={<PublicEventsPage />} />
  <Route path="/events/:id" element={<PublicEventDetailPage />} /> {/* Prefer this over /event/:id */}

  {/* Booking Flow */}
  <Route path="/book/:serviceId" element={<BookingPage />} />
  <Route path="/payment" element={<PaymentPage />} />
  <Route path="/confirmation" element={<ConfirmationPage />} />

  {/* Catch-all */}
  <Route path="*" element={<NotFoundPage />} />
</Routes>

            </main>
            {!isAuthPage && <Footer />}
        </div>
    );
}

export default App;