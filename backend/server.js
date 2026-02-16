const dotenv = require('dotenv');
const express = require('express');

const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); 
const taskRoutes = require('./routes/taskRoutes'); // Task routes imported correctly

// Load environment variables
dotenv.config();

// Temporary hardcoded values for testing
process.env.MONGO_URI = 'mongodb+srv://sayalitarle:kirtitarle@cluster0.9xnxuy5.mongodb.net/test?appName=TimeBank';
process.env.JWT_SECRET = 'any_random_secret_key_12345';
process.env.PORT = '5000';

// Debug: Check if environment variables are loaded
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Basic Route for Testing
app.get('/', (req, res) => {
  res.send('TimeBank API is running...');
});

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/reviews', reviewRoutes); 
app.use('/api/tasks', taskRoutes); // Task endpoint registered correctly

// Define Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});