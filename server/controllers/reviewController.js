const Review = require('../models/Review');
const User = require('../models/User');

exports.createReview = async (req, res) => {
    try {
        const { resourceId, rating, comment } = req.body;
        const userId = req.user.userId;

        if (!resourceId || !rating) {
            return res.status(400).json({ message: 'Resource ID and rating are required' });
        }

        const review = await Review.create({
            resourceId,
            rating,
            comment,
            userId
        });

        console.log("REVIEW CREATED SUCCESSFULLY:", review.id);
        res.status(201).json({ message: 'Review submitted successfully', review });
    } catch (error) {
        console.error("--- CREATE REVIEW ERROR ---");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        if (error.errors) {
            console.error("Validation Errors:", error.errors.map(e => e.message));
        }
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

exports.getResourceReviews = async (req, res) => {
    try {
        const { resourceId } = req.params;
        const reviews = await Review.findAll({
            where: { resourceId },
            include: [{ model: User, attributes: ['id', 'name'] }],
            order: [['createdAt', 'DESC']]
        });

        res.json(reviews);
    } catch (error) {
        console.error("GET REVIEWS ERROR:", error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

exports.ping = async (req, res) => {
    res.json({ message: 'Review system online', user: req.user });
};

