const express = require('express');
const router = express.Router();

const { getEvents, deleteEvent } = require('../controllers/eventController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

console.log('DELETE EVENT DEBUG:', typeof deleteEvent);

router.get('/', getEvents); // GET /api/events
router.delete('/:id', protect, requireAdmin, deleteEvent); // DELETE /api/events/:id

module.exports = router;
