export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  type: 'user';
}

export interface Organizer {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  serviceType: string;
  type: 'organizer';
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

export interface Service {
  id: string;
  organizerId: string;
  organizerName: string;
  serviceType: string;
  location: string;
  priceRange: string;
  rating: number;
  availability: 'Available' | 'Booked';
  portfolioImages: string[];
  packages: Package[];
  reviews: Review[];
  calendar: Record<string, 'available' | 'booked'>;
}

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  organizerName: string;
  eventDate: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  totalCost: number;
  package: Package;
  venue: string;
}

export interface Payment {
  transactionId: string;
  bookingId: string;
  amount: number;
  date: string;
  status: 'Success' | 'Failed';
}

export interface PublicEvent {
  id: string;
  name:string;
  date: string;
  venue: string;
  ticketPrice: number;
  description: string;
  gallery: string[];
  tickets: {
    general: number;
    vip: number;
  };
}

export interface Category {
  name: string;
  count: number;
  image: string;
}
