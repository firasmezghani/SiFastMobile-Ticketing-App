const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const QRCode = require('qrcode');

async function createTicket(req, res) {
  try {
    const { event, purchaserName } = req.body;
    const userId = req.user.id;

    if (!event || !purchaserName) {
      return res.status(400).json({ message: 'event and purchaserName are required' });
    }

    // 🔍 Find the event
    const eventData = await Event.findById(event);
    if (!eventData) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // 🔒 Check ticket limit
    const ticketCount = await Ticket.countDocuments({ event });
    if (ticketCount >= eventData.maxTickets) {
      return res.status(400).json({ message: 'Ticket limit reached for this event' });
    }

    // ✅ Create ticket
    const ticket = new Ticket({ event, purchaserName, userId });
    await ticket.save();

    // 🎫 Generate QR code
    const qrCodeImage = await QRCode.toDataURL(ticket._id.toString());
    ticket.qrCode = qrCodeImage;
    await ticket.save();

    res.status(201).json({ message: 'Ticket created successfully', ticket });
  } catch (error) {
    console.error('Ticket creation error:', error);
    res.status(500).json({ message: 'Ticket generation failed', error });
  }
}


async function validateTicket(req, res) {
  try {
    const { qrCodeData } = req.body;
    const ticket = await Ticket.findById(qrCodeData);

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.isValidated) return res.status(400).json({ message: 'Ticket already validated' });
ticket.isValidated = true;
await ticket.save();


    res.status(200).json({ message: 'Ticket validated', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Validation failed', error });
  }
}

async function getUserTickets(req, res) {
  try {
    const tickets = await Ticket.find({ userId: req.user.id }).populate('event');
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user tickets', error });
  }
}

async function createEvent(req, res) {
  try {
    const { title, description, date, location, maxTickets } = req.body;

    // 🔍 Debug the request body
    console.log('📦 Incoming request body:', req.body);

    if (!title || !description || !date || !location || !maxTickets) {
      return res.status(400).json({ message: 'All event fields are required' });
    }

    if (maxTickets <= 0) {
      return res.status(400).json({ message: 'maxTickets must be a positive number' });
    }

    const event = new Event({
      title,
      description,
      date,
      location,
      maxTickets,
    });

    await event.save();

    res.status(201).json({ message: 'Event created', event });
  } catch (error) {
    console.error('❌ Error creating event:', error);
    res.status(500).json({ message: 'Failed to create event' });
  }
}

async function getAllTickets(req, res) {
  try {
    const tickets = await Ticket.find().populate('event').populate('userId');
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all tickets', error });
  }
}

module.exports = {
  createTicket,
  validateTicket,
  getUserTickets,
  createEvent,
  getAllTickets,
};
