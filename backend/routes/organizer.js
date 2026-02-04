const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Service = require('../models/Service');
const Booking = require('../models/Booking'); // ADD THIS LINE
const { verifyOrganizer } = require('../middleware/auth');

// ... rest of your code remains the same

// ===== EVENT ROUTES =====
// ... (keep all existing event routes)

// ===== SERVICE ROUTES =====

// Create service
router.post('/services', verifyOrganizer, async (req, res) => {
  try {
    const { 
      organizerName, 
      serviceType, 
      location, 
      rating, 
      description, 
      packages 
    } = req.body;

    console.log('Creating service for organizer:', req.organizer._id);
    console.log('Service data:', { organizerName, serviceType, location, rating, description, packages });

    // Validate required fields
    if (!organizerName || !serviceType || !location || !description || !packages) {
      return res.status(400).json({ 
        message: 'All fields are required: organizerName, serviceType, location, description, packages' 
      });
    }

    const service = new Service({
      organizerName,
      serviceType,
      location,
      rating: rating || 0,
      description,
      packages,
      organizer: req.organizer._id
    });

    await service.save();
    
    console.log('Service created successfully:', service._id);
    
    res.status(201).json({ 
      message: 'Service created successfully', 
      service: {
        _id: service._id,
        organizerName: service.organizerName,
        serviceType: service.serviceType,
        location: service.location,
        rating: service.rating,
        description: service.description,
        packages: service.packages,
        organizer: service.organizer
      }
    });
  } catch (err) {
    console.error('Error creating service:', err);
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error while creating service' });
  }
});

// Get organizer's services
router.get('/services', verifyOrganizer, async (req, res) => {
  try {
    console.log('Fetching services for organizer:', req.organizer._id);
    
    const services = await Service.find({ organizer: req.organizer._id })
      .sort({ createdAt: -1 })
      .select('-__v');

    console.log(`Found ${services.length} services for organizer`);
    
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
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      }))
    });
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ message: 'Server error while fetching services' });
  }
});

// Get single service
router.get('/services/:id', verifyOrganizer, async (req, res) => {
  try {
    const service = await Service.findOne({ 
      _id: req.params.id, 
      organizer: req.organizer._id 
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ service });
  } catch (err) {
    console.error('Error fetching service:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update service
router.put('/services/:id', verifyOrganizer, async (req, res) => {
  try {
    const { 
      organizerName, 
      serviceType, 
      location, 
      rating, 
      description, 
      packages 
    } = req.body;

    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, organizer: req.organizer._id },
      { organizerName, serviceType, location, rating, description, packages },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service updated successfully', service });
  } catch (err) {
    console.error('Error updating service:', err);
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete service
router.delete('/services/:id', verifyOrganizer, async (req, res) => {
  try {
    const service = await Service.findOne({ 
      _id: req.params.id, 
      organizer: req.organizer._id 
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// Create event
router.post('/events', verifyOrganizer, async (req, res) => {
  try {
    const { name, date, venue, description, packages } = req.body;

    console.log('Creating event for organizer:', req.organizer._id);
    console.log('Event data:', { name, date, venue, description, packages });

    // Validate required fields
    if (!name || !date || !venue || !description || !packages) {
      return res.status(400).json({ 
        message: 'All fields are required: name, date, venue, description, packages' 
      });
    }

    const event = new Event({
      name,
      date,
      venue,
      description,
      packages,
      organizer: req.organizer._id
    });

    await event.save();
    
    console.log('Event created successfully:', event._id);
    
    res.status(201).json({ 
      message: 'Event created successfully', 
      event: {
        _id: event._id,
        name: event.name,
        date: event.date,
        venue: event.venue,
        description: event.description,
        packages: event.packages,
        organizer: event.organizer
      }
    });
  } catch (err) {
    console.error('Error creating event:', err);
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error while creating event' });
  }
});

// Get organizer's events
router.get('/events', verifyOrganizer, async (req, res) => {
  try {
    console.log('Fetching events for organizer:', req.organizer._id);
    
    const events = await Event.find({ organizer: req.organizer._id })
      .sort({ createdAt: -1 })
      .select('-__v');

    console.log(`Found ${events.length} events for organizer`);
    
    res.json({ 
      message: 'Events fetched successfully',
      events: events.map(event => ({
        _id: event._id,
        name: event.name,
        date: event.date,
        venue: event.venue,
        description: event.description,
        packages: event.packages,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt
      }))
    });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Server error while fetching events' });
  }
});

// Get single event
router.get('/events/:id', verifyOrganizer, async (req, res) => {
  try {
    const event = await Event.findOne({ 
      _id: req.params.id, 
      organizer: req.organizer._id 
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event
router.put('/events/:id', verifyOrganizer, async (req, res) => {
  try {
    const { name, date, venue, description, packages } = req.body;

    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, organizer: req.organizer._id },
      { name, date, venue, description, packages },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event updated successfully', event });
  } catch (err) {
    console.error('Error updating event:', err);
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Get organizer's bookings (both events and services)
router.get('/bookings', verifyOrganizer, async (req, res) => {
  try {
    console.log('Fetching bookings for organizer:', req.organizer._id);
    
    // Get events created by this organizer
    const organizerEvents = await Event.find({ organizer: req.organizer._id });
    const eventIds = organizerEvents.map(event => event._id);
    
    // Get services created by this organizer
    const organizerServices = await Service.find({ organizer: req.organizer._id });
    const serviceIds = organizerServices.map(service => service._id);
    
    // Get bookings for organizer's events and services
    const bookings = await Booking.find({
      $or: [
        { event: { $in: eventIds } },
        { service: { $in: serviceIds } }
      ]
    })
    .populate('user', 'name email phone')
    .populate('event', 'name date venue')
    .populate('service', 'organizerName serviceType location')
    .sort({ createdAt: -1 });

    console.log(`Found ${bookings.length} bookings for organizer`);
    
    res.json({ 
      message: 'Bookings fetched successfully',
      bookings: bookings.map(booking => ({
        _id: booking._id,
        type: booking.type,
        user: booking.user,
        event: booking.event,
        service: booking.service,
        package: booking.package,
        quantity: booking.quantity,
        totalAmount: booking.totalAmount,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        bookingDate: booking.bookingDate,
        customerNotes: booking.customerNotes,
        createdAt: booking.createdAt
      }))
    });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
});

// Update booking status (accept/reject)
router.put('/bookings/:id/status', verifyOrganizer, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('event')
      .populate('service');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the organizer owns this event/service
    let isOwner = false;
    if (booking.event) {
      isOwner = booking.event.organizer.toString() === req.organizer._id.toString();
    } else if (booking.service) {
      isOwner = booking.service.organizer.toString() === req.organizer._id.toString();
    }

    if (!isOwner) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: `Booking ${status} successfully`, booking });
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete event
router.delete('/events/:id', verifyOrganizer, async (req, res) => {
  try {
    const event = await Event.findOne({ 
      _id: req.params.id, 
      organizer: req.organizer._id 
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;