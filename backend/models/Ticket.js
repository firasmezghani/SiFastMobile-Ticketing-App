// models/Ticket.js

const mongoose = require('mongoose');
const QRCode = require('qrcode');

const ticketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  purchaserName: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  qrCode: {
    type: String,
  },
  isValidated: {
    type: Boolean,
    default: false,
  },
  

  createdAt: {
    type: Date,
    default: Date.now,
  },
});



module.exports = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);
