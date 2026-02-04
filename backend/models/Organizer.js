const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const OrganizerSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  serviceType: { type: String },
  password: { type: String, required: true }
}, { timestamps: true });

OrganizerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Add password comparison method
OrganizerSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Organizer', OrganizerSchema);