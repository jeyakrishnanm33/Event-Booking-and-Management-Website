const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Service = require('../models/Service');
const { verifyUser } = require('../middleware/auth');

// ===== PUBLIC ROUTES =====

// Get all events (for public browsing)
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'businessName email phone')
      .sort({ createdAt: -1 });

    res.json({ 
      message: 'Events fetched successfully',
      events: events.map(event => ({
        _id: event._id,
        name: event.name,
        date: event.date,
        venue: event.venue,
        description: event.description,
        packages: event.packages,
        organizer: event.organizer,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt
      }))
    });
  } catch (err) {
    console.error('Error fetching events for users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single event by ID
router.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'businessName email phone serviceType');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all services (for public browsing)
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .populate('organizer', 'businessName email phone')
      .sort({ createdAt: -1 });

    res.json({ 
      message: 'Services fetched successfully',
      services: services.map(service => ({
        _id: service._id,
        organizerName: service.organizerName,
        serviceType: service.serviceType,
        location: service.location,
        rating: service.rating,
        description: service.description,
        packages: service.packages,
        organizer: service.organizer,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      }))
    });
  } catch (err) {
    console.error('Error fetching services for users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single service by ID
router.get('/services/:id', async (req, res) => {
  try {
    const service = await Service.findOne({ 
      _id: req.params.id, 
      isActive: true 
    }).populate('organizer', 'businessName email phone serviceType');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ service });
  } catch (err) {
    console.error('Error fetching service:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== PROTECTED USER ROUTES =====

// Create booking (event or service)
router.post('/bookings', verifyUser, async (req, res) => {
  try {
    const { 
      eventId, 
      serviceId, 
      ticketType, 
      quantity, 
      packageName,
      customerNotes 
    } = req.body;

    let bookingData = {
      user: req.user._id,
      type: eventId ? 'event' : 'service',
      quantity: quantity || 1,
      customerNotes,
      status: 'pending',
      paymentStatus: 'pending'
    };

    let totalAmount = 0;

    if (eventId) {
      // Event booking
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      const ticketPackage = event.packages.find(p => p.type === ticketType);
      if (!ticketPackage) {
        return res.status(400).json({ message: 'Invalid ticket type' });
      }

      bookingData.event = eventId;
      bookingData.ticketType = ticketType;
      bookingData.package = {
        name: ticketPackage.name,
        price: ticketPackage.price
      };
      totalAmount = ticketPackage.price * (quantity || 1);
    } else if (serviceId) {
      // Service booking
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }

      const servicePackage = service.packages.find(p => p.name === packageName);
      if (!servicePackage) {
        return res.status(400).json({ message: 'Invalid service package' });
      }

      bookingData.service = serviceId;
      bookingData.package = {
        name: servicePackage.name,
        price: servicePackage.price
      };
      totalAmount = servicePackage.price;
    } else {
      return res.status(400).json({ message: 'Either eventId or serviceId is required' });
    }

    bookingData.totalAmount = totalAmount;

    const booking = new Booking(bookingData);
    await booking.save();

    // Populate the booking with event/service details
    await booking.populate('event service', 'name organizerName');

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        _id: booking._id,
        type: booking.type,
        event: booking.event,
        service: booking.service,
        package: booking.package,
        quantity: booking.quantity,
        totalAmount: booking.totalAmount,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        bookingDate: booking.bookingDate,
        createdAt: booking.createdAt
      }
    });

  } catch (err) {
    console.error('Error creating booking:', err);
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error while creating booking' });
  }
});

// Get user's bookings
router.get('/bookings', verifyUser, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'name date venue')
      .populate('service', 'organizerName serviceType location')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Bookings fetched successfully',
      bookings: bookings.map(booking => ({
        _id: booking._id,
        type: booking.type,
        event: booking.event,
        service: booking.service,
        package: booking.package,
        quantity: booking.quantity,
        totalAmount: booking.totalAmount,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        bookingDate: booking.bookingDate,
        createdAt: booking.createdAt
      }))
    });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single booking
router.get('/bookings/:id', verifyUser, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    })
    .populate('event', 'name date venue organizer')
    .populate('service', 'organizerName serviceType location organizer')
    .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ booking });
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.put('/bookings/:id/cancel', verifyUser, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (err) {
    console.error('Error cancelling booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
// User-specific routes
router.get('/profile', verifyUser, (req, res) => {
  res.json({ 
    message: 'User profile route',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
});

// Get all events (for public browsing)
router.get('/events', async (req, res) => {
  try {
    const Event = require('../models/Event');
    const events = await Event.find()
      .populate('organizer', 'businessName email')
      .sort({ createdAt: -1 });

    res.json({ 
      message: 'Events fetched successfully',
      events: events.map(event => ({
        _id: event._id,
        name: event.name,
        date: event.date,
        venue: event.venue,
        description: event.description,
        packages: event.packages,
        organizer: event.organizer,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt
      }))
    });
  } catch (err) {
    console.error('Error fetching events for users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single event by ID
router.get('/events/:id', async (req, res) => {
  try {
    const Event = require('../models/Event');
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'businessName email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all services (for public browsing)
router.get('/services', async (req, res) => {
  try {
    const Service = require('../models/Service');
    const services = await Service.find({ isActive: true })
      .populate('organizer', 'businessName email')
      .sort({ createdAt: -1 });

    res.json({ 
      message: 'Services fetched successfully',
      services: services.map(service => ({
        _id: service._id,
        organizerName: service.organizerName,
        serviceType: service.serviceType,
        location: service.location,
        rating: service.rating,
        description: service.description,
        packages: service.packages,
        organizer: service.organizer,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      }))
    });
  } catch (err) {
    console.error('Error fetching services for users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single service by ID
router.get('/services/:id', async (req, res) => {
  try {
    const Service = require('../models/Service');
    const service = await Service.findOne({ 
      _id: req.params.id, 
      isActive: true 
    }).populate('organizer', 'businessName email');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ service });
  } catch (err) {
    console.error('Error fetching service:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all events (for users to browse)
router.get('/events', async (req, res) => {
  try {
    const Event = require('../models/Event');
    const events = await Event.find()
      .populate('organizer', 'businessName email')
      .sort({ createdAt: -1 });

    res.json({ events });
  } catch (err) {
    console.error('Error fetching events for users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;