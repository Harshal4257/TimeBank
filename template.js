const fs = require('fs');
const path = require('path');

// 1. Define the project's file structure
const list_of_files = [
    // Backend Structure
    "backend/config/db.js",
    "backend/controllers/jobController.js",
    "backend/controllers/userController.js",
    "backend/middleware/authMiddleware.js",
    "backend/models/User.js",
    "backend/models/Job.js",
    "backend/models/Application.js",
    "backend/models/Transaction.js",
    "backend/routes/jobRoutes.js",
    "backend/routes/userRoutes.js",
    "backend/utils/matchingAlgorithm.js",
    "backend/server.js",
    "backend/.env",

    // Frontend Structure
    "frontend/src/components/Navbar.js",
    "frontend/src/pages/Dashboard.js",
    "frontend/src/pages/Home.js",
    "frontend/src/services/api.js",
    "frontend/src/context/AuthContext.js",
    "frontend/src/App.js",
    "frontend/src/index.js",

    // Root files
    ".gitignore",
    "README.md"
];

// 2. Logic to create directories and files
list_of_files.forEach((filepath) => {
    const dirname = path.dirname(filepath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
        console.log(`Creating directory: ${dirname}`);
    }

    // Create file if it doesn't exist or is empty
    if (!fs.existsSync(filepath) || fs.statSync(filepath).size === 0) {
        fs.writeFileSync(filepath, ""); // Creates an empty file
        console.log(`Creating empty file: ${filepath}`);
    } else {
        console.log(`File already exists: ${filepath}`);
    }
});

console.log("\nProject structure initialized successfully!");