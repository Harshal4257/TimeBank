const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for job files (poster uploads)
const jobFileStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'timebank/job-files',
        resource_type: 'raw', // allows all file types (zip, pdf, docx, etc.)
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'zip', 'rar', 'txt', 'xlsx', 'pptx'],
    },
});

// Storage for submission files (seeker uploads)
const submissionFileStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'timebank/submissions',
        resource_type: 'raw',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'zip', 'rar', 'txt', 'xlsx', 'pptx'],
    },
});

const uploadJobFiles = multer({ storage: jobFileStorage });
const uploadSubmissionFiles = multer({ storage: submissionFileStorage });

module.exports = { cloudinary, uploadJobFiles, uploadSubmissionFiles };