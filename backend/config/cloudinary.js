const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for job files (poster uploads)
const jobFileStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const ext = path.extname(file.originalname).replace('.', '').toLowerCase();
        const baseName = path.basename(file.originalname, path.extname(file.originalname))
            .replace(/[^a-zA-Z0-9_-]/g, '_');
        return {
            folder: 'timebank/job-files',
            resource_type: 'raw',
            type: 'upload',
            access_mode: 'public',
            overwrite: true,
            unique_filename: false,
            public_id: `${baseName}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`,
        };
    },
});

// Submission files also go to job-files folder so Cloudinary delivery is not blocked
const submissionFileStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const ext = path.extname(file.originalname).replace('.', '').toLowerCase();
        const baseName = path.basename(file.originalname, path.extname(file.originalname))
            .replace(/[^a-zA-Z0-9_-]/g, '_');
        return {
            folder: 'timebank/job-files',
            resource_type: 'raw',
            type: 'upload',
            access_mode: 'public',
            overwrite: true,
            unique_filename: false,
            public_id: `${baseName}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`,
        };
    },
});

const uploadJobFiles = multer({ storage: jobFileStorage });
const uploadSubmissionFiles = multer({ storage: submissionFileStorage });

module.exports = { cloudinary, uploadJobFiles, uploadSubmissionFiles };