// controllers/userController.js

const User = require('../models/User');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Get single user
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

// Update user (name, email, role, etc.)
exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true, select: '-password' });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};
exports.promoteToAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = 'admin';
    await user.save();

    res.status(200).json({ message: 'User promoted to admin' });
  } catch (err) {
    console.error('Promotion error:', err);
    res.status(500).json({ message: 'Failed to promote user' });
  }
};
