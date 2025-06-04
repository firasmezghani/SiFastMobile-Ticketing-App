const Event = require('../models/Event');
const Ticket = require('../models/Ticket');

async function deleteEvent(req, res) {
  try {
    const eventId = req.params.id;

    // Delete associated tickets
    await Ticket.deleteMany({ event: eventId });

    // Delete the event itself
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event and associated tickets deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Failed to delete event' });
  }
}

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
exports.createEvent = async (req, res) => {
  try {
    const { title, location, description, date, maxTickets } = req.body;

    if (!title || !location || !description || !date || !maxTickets) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newEvent = new Event({
      title,
      location,
      description,
      date,
      maxTickets
    });

    await newEvent.save();

    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error('Create Event Error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Export the deleteEvent as well
exports.deleteEvent = deleteEvent;
