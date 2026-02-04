const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  type: {
    type: String,
    enum: ['event', 'service'],
    required: true
  },
  ticketType: {
    type: String,
    enum: ['general', 'vip']
  },
  quantity: {
    type: Number,
    min: 1,
    default: 1
  },
  package: {
    name: String,
    price: Number
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: String,
  customerNotes: String
}, { 
  timestamps: true 
});

// Add index for better query performance
BookingSchema.index({ user: 1, createdAt: -1 });
BookingSchema.index({ event: 1 });
BookingSchema.index({ service: 1 });

module.exports = mongoose.model('Booking', BookingSchema);