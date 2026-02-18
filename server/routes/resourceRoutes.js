const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const resourceController = require('../controllers/resourceController');
const authMiddleware = require('../middleware/auth'); // We need to create this!

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc|docx|ppt|pptx/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: File upload only supports ' + filetypes));
    }
});

router.get('/user', authMiddleware, resourceController.getUserResources);
router.get('/', resourceController.getAllResources);
router.post('/upload', authMiddleware, upload.single('file'), resourceController.uploadResource);
router.delete('/:id', authMiddleware, resourceController.deleteResource);

module.exports = router;
