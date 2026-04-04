require('dotenv').config();
const cloudinary = require('cloudinary').v2;

console.log('Environment variables:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY exists:', !!process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET exists:', !!process.env.CLOUDINARY_API_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Cloudinary configured with:', {
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key ? 'Set' : 'Not set',
  api_secret: cloudinary.config().api_secret ? 'Set' : 'Not set'
});
