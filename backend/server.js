require('dotenv').config();
console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');

dotenv.config();

const app = express();

const User = require('./models/User');
const bcrypt = require('bcryptjs');




// ✅ Middlewares (must come first)
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use('/api/tickets', ticketRoutes);    // Handles /api/events and /api/tickets
app.use('/api/auth', authRoutes);    // Handles /api/auth/*
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    async function createDefaultAdmin() {
      try {
        const existingAdmin = await User.findOne({ email: 'admin@sifast.com' });
    
        if (!existingAdmin) {
          const hashedPassword = await bcrypt.hash('admin123', 10);
          await User.create({
            email: 'admin@sifast.com',
            password: hashedPassword,
            role: 'admin',
          });
          console.log('✅ Default admin created: admin@sifast.com / admin123');
        } else {
          console.log('ℹ️ Default admin already exists');
        }
      } catch (err) {
        console.error('❌ Failed to create default admin:', err.message);
      }
    }
    
    createDefaultAdmin(); // ← call it during startup
    
    app.listen(5005, () => {
      console.log('🚀 Server running on port 5005');
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
