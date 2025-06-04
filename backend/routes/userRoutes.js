const express = require('express');
const router = express.Router();

const {
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser
  } = require('../controllers/userController');
  

const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const { promoteToAdmin } = require('../controllers/userController');

// ✅ Admin: Get all users
router.get('/', authenticateToken, requireAdmin, getAllUsers);

// ✅ Authenticated users: Get own user info
router.get('/:id', authenticateToken, getUserById);

// ✅ Authenticated users: Delete account (or Admin deletes someone)
router.delete('/:id', authenticateToken, deleteUser);

// ✅ Authenticated users: Update profile (or Admin updates someone)
router.put('/:id', authenticateToken, updateUser);


router.put('/promote/:id', authenticateToken, requireAdmin, promoteToAdmin);

module.exports = router;
