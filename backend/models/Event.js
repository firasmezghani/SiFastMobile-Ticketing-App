const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  location: String,
  maxTickets: {
    type: Number,
    required: true,
    default: 100,
  },
});

module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema);
