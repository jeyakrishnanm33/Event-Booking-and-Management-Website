import { User, Organizer, Service, Booking, Payment, PublicEvent, Category } from '../types';

export const dummyUser: User = {
  id: 'user1',
  name: 'Ariya Kumar',
  email: 'ariya@example.com',
  phone: '123-456-7890',
  address: '123 Main St, Anytown, USA',
  type: 'user',
};

export const dummyOrganizer: Organizer = {
  id: 'org1',
  businessName: 'Happy Events Pvt. Ltd.',
  ownerName: 'Raj Sharma',
  email: 'happyevents@example.com',
  phone: '987-654-3210',
  serviceType: 'Wedding Planner',
  type: 'organizer',
};

export const categories: Category[] = [
    { name: 'Wedding Planners', count: 150, image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800' },
    { name: 'Birthday Planners', count: 200, image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800' },
    { name: 'Caterers', count: 300, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800' },
    { name: 'DJs', count: 250, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800' },
    { name: 'Decorators', count: 180, image: 'https://images.unsplash.com/photo-1522158637959-30385a09e0da?q=80&w=800' },
];

export const services: Service[] = [
  {
    id: 'swc001',
    organizerId: 'org1',
    organizerName: 'Star Weddings Co.',
    serviceType: 'Wedding Planner',
    location: 'Chennai',
    priceRange: '₹50k–₹5L',
    rating: 4.8,
    availability: 'Available',
    portfolioImages: [
      'https://images.unsplash.com/photo-1597157639073-6928494f669f?q=80&w=800',
      'https://images.unsplash.com/photo-1519225421980-715cb02cf659?q=80&w=800',
      'https://images.unsplash.com/photo-1523438885239-a29341584344?q=80&w=800',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd51622?q=80&w=800',
      'https://images.unsplash.com/photo-1606305244342-a3c0a5df587c?q=80&w=800',
    ],
    packages: [
      { id: 'p1', name: 'Basic', price: 50000, description: 'Venue Décor + Music', features: ['Venue Decoration', 'DJ & Music System'] },
      { id: 'p2', name: 'Premium', price: 150000, description: 'Décor + Music + Photography', features: ['Elaborate Venue Decoration', 'Live Band & DJ', 'Professional Photography (8 hours)'] },
    ],
    reviews: [
      { id: 'r1', userId: 'user1', userName: 'Ariya', rating: 5, comment: 'Amazing service, very professional!' },
      { id: 'r2', userId: 'user2', userName: 'Ben', rating: 4, comment: 'Decorations were beautiful.' },
    ],
    calendar: { '2025-12-10': 'booked', '2025-12-15': 'available' }
  },
  {
    id: 'jm002',
    organizerId: 'org2',
    organizerName: 'Joyful Moments',
    serviceType: 'Birthday Planner',
    location: 'Bengaluru',
    priceRange: '₹20k–₹1L',
    rating: 4.6,
    availability: 'Booked',
    portfolioImages: ['https://images.unsplash.com/photo-1504196657333-aed3a63b05a5?q=80&w=800'],
    packages: [{ id: 'p3', name: 'Standard Birthday', price: 30000, description: 'Themed Decor + Cake + Games', features: ['Themed Decoration', 'Custom Cake', 'Fun Activities'] }],
    reviews: [{ id: 'r3', userId: 'user3', userName: 'Chloe', rating: 5, comment: 'Kids had a blast!' }],
    calendar: { '2025-09-28': 'booked' }
  },
  {
    id: 'sd003',
    organizerId: 'org3',
    organizerName: 'Spice Delight',
    serviceType: 'Catering',
    location: 'Hyderabad',
    priceRange: '₹300/plate',
    rating: 4.9,
    availability: 'Available',
    portfolioImages: ['https://images.unsplash.com/photo-1623354313797-9b5962b1a822?q=80&w=800'],
    packages: [{ id: 'p4', name: 'Standard Menu', price: 300, description: 'Per plate cost for standard menu', features: ['3 Main Courses', '2 Desserts', 'Welcome Drink'] }],
    reviews: [{ id: 'r4', userId: 'user4', userName: 'David', rating: 5, comment: 'Food was delicious and service was impeccable.' }],
    calendar: { '2025-10-05': 'available' }
  },
];

export const publicEvents: PublicEvent[] = [
  {
    id: 'ev1',
    name: 'Fun Street Fest',
    date: '15 Oct 2025',
    venue: 'Marina Beach, Chennai',
    ticketPrice: 299,
    description: 'Join us for a day of fun, food, and music at the beautiful Marina Beach. Featuring live bands, food stalls, and games for all ages.',
    gallery: ['https://images.unsplash.com/photo-1513364773122-50604c5457a6?q=80&w=800', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad720c3?q=80&w=800'],
    tickets: { general: 299, vip: 599 },
  },
  {
    id: 'ev2',
    name: 'Holi Bash 2025',
    date: '18 Mar 2025',
    venue: 'Delhi Grounds',
    ticketPrice: 499,
    description: 'Celebrate the festival of colors with live DJs, organic colors, and delicious food. An event not to be missed!',
    gallery: ['https://images.unsplash.com/photo-1616422899109-810795355655?q=80&w=800'],
    tickets: { general: 499, vip: 999 },
  },
  {
    id: 'ev3',
    name: 'Jazz Night Live',
    date: '22 Nov 2025',
    venue: 'Bengaluru Club',
    ticketPrice: 799,
    description: 'An evening of smooth jazz with international artists. Enjoy a classy night out with great music and fine dining options.',
    gallery: ['https://images.unsplash.com/photo-1524234103236-a89fe783c306?q=80&w=800'],
    tickets: { general: 799, vip: 1499 },
  },
];

export const userBookings: Booking[] = [
  {
    id: 'BK-20251210-001',
    userId: 'user1',
    serviceId: 'swc001',
    serviceName: 'Wedding Planner',
    organizerName: 'Star Weddings Co.',
    eventDate: '10 Dec 2025',
    status: 'Confirmed',
    totalCost: 75000,
    package: services[0].packages[0],
    venue: 'Leela Palace, Chennai'
  },
  {
    id: 'BK-20250815-002',
    userId: 'user1',
    serviceId: 'jm002',
    serviceName: 'Birthday Planner',
    organizerName: 'Joyful Moments',
    eventDate: '15 Aug 2025',
    status: 'Completed',
    totalCost: 30000,
    package: services[1].packages[0],
    venue: 'Home Event'
  },
];

export const paymentHistory: Payment[] = [
    { transactionId: 'TXN123456', bookingId: 'BK-20251210-001', amount: 10000, date: '22 Sep 2025', status: 'Success' },
    { transactionId: 'TXN123457', bookingId: 'BK-20250815-002', amount: 30000, date: '01 Aug 2025', status: 'Success' },
];

export const organizerBookings: Booking[] = [
    {
        id: 'BK-20251210-001',
        userId: 'user1',
        serviceId: 'swc001',
        serviceName: 'Wedding Planner',
        organizerName: 'Star Weddings Co.',
        eventDate: '10 Dec 2025',
        status: 'Pending',
        totalCost: 75000,
        package: services[0].packages[0],
        venue: 'Leela Palace, Chennai'
    }
];
