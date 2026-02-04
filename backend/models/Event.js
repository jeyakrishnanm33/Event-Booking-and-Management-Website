const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  packages: [{
    type: {
      type: String,
      enum: ['general', 'vip'],
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    name: {
      type: String,
      required: true
    }
  }],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organizer',
    required: true
  },
  gallery: [{
    url: String,
    filename: String
  }]
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Event', EventSchema);