const path = require('path');
// This line tells the server exactly where to find the .env file
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
// REMOVED: taskRoutes import

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",  // ← fallback port when 3000 is occupied
    "https://timebank-frontend-nu.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// Serve uploaded profile photos
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes); // Now handles all Job and Task data
app.use('/api/applications', applicationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
// REMOVED: app.use('/api/tasks', taskRoutes);

// Basic Route for Testing
app.get('/', (req, res) => {
  res.send('TimeBank API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});