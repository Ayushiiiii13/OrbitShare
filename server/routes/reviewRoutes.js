const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, reviewController.createReview);
router.get('/ping', authMiddleware, reviewController.ping);
router.get('/:resourceId', reviewController.getResourceReviews);

module.exports = router;
