const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile, uploadProfilePhoto } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Ensure this path is correct

// Configure storage for profile photos
const uploadsDir = path.join(__dirname, '..', 'uploads', 'profile-photos');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private/Protected Route - This is what the Dashboard needs!
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Upload profile photo
router.post('/profile/photo', protect, upload.single('photo'), uploadProfilePhoto);

module.exports = router;