const express = require('express');
const router = express.Router();

const {
  createTicket,
  validateTicket,
  getUserTickets,
  createEvent,
  getAllTickets, 
} = require('../controllers/ticketController.js');

// ✅ FIXED HERE: import with correct names
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware.js');

console.log("ROUTE DEBUG:", typeof authenticateToken, typeof requireAdmin, typeof createTicket);

// ✅ Use correct function name: authenticateToken instead of protect
router.post('/', authenticateToken, createTicket);
router.post('/validate', validateTicket);
router.post('/events', authenticateToken, requireAdmin, createEvent);

router.get('/', authenticateToken, getUserTickets);
router.get('/my-tickets', authenticateToken, getUserTickets);
router.get('/all', authenticateToken, requireAdmin, getAllTickets);
router.get('/user', authenticateToken, getUserTickets);

module.exports = router;
