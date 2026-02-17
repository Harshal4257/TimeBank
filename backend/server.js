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
const taskRoutes = require('./routes/taskRoutes');

// Connect to Database
connectDB();

const app = express();

// Middleware
// Replace app.use(cors()); with this:
app.use(cors({
  origin: 'http://localhost:3000', // Allow your React app
  credentials: true
}));
app.use(express.json()); 

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/reviews', reviewRoutes); 
app.use('/api/tasks', taskRoutes);

// Basic Route for Testing
app.get('/', (req, res) => {
  res.send('TimeBank API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});