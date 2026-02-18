const Resource = require('../models/Resource');
const User = require('../models/User');
const Review = require('../models/Review');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

exports.uploadResource = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { title, description } = req.body;
        const fileUrl = req.file.path;
        const fileType = req.file.mimetype;
        const uploaderId = req.user.userId;

        console.log("--- UPLOAD ATTEMPT ---");
        console.log("Title:", title);
        console.log("Uploader ID from Token:", uploaderId, "Type:", typeof uploaderId);

        const resource = await Resource.create({
            title,
            description,
            fileUrl,
            fileType,
            uploaderId
        });

        console.log("RESOURCE CREATED. ID:", resource.id, "SAVED OWNER ID:", resource.uploaderId);

        // Award Credits
        const userBefore = await User.findByPk(uploaderId);
        console.log("CREDITS BEFORE INCREMENT:", userBefore?.credits);

        await User.increment('credits', { by: 10, where: { id: uploaderId } });

        const userAfter = await User.findByPk(uploaderId);
        console.log("CREDITS AFTER INCREMENT:", userAfter?.credits);

        res.status(201).json({
            message: `Resource uploaded successfully! 10 credits awarded. Your total: ${userAfter?.credits || 0}`,
            resource
        });
    } catch (error) {
        console.error("UPLOAD ERROR:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllResources = async (req, res) => {
    try {
        console.log("FETCHING ALL RESOURCES FOR DASHBOARD");
        const resources = await Resource.findAll({
            include: [
                { model: User, attributes: ['id', 'name'] },
                { model: Review, attributes: ['rating'] }
            ]
        });

        // Map resources to include averageRating
        const resourcesWithRatings = resources.map(res => {
            const reviews = res.Reviews || [];
            const avg = reviews.length > 0
                ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
                : 0;

            return {
                ...res.toJSON(),
                averageRating: parseFloat(avg.toFixed(1)),
                reviewCount: reviews.length
            };
        });

        console.log(`DASHBOARD FETCHED ${resources.length} RESOURCES`);
        res.json(resourcesWithRatings);
    } catch (error) {
        console.error("GET ALL RESOURCES ERROR:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserResources = async (req, res) => {
    try {
        const uploaderId = req.user.userId;

        const resources = await Resource.findAll({
            where: { uploaderId },
            include: [{ model: User, attributes: ['name'] }]
        });

        res.json(resources);
    } catch (error) {
        console.error("GET USER RESOURCES ERROR:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteResource = async (req, res) => {
    try {
        const { id } = req.params;
        const uploaderId = req.user.userId;

        const resource = await Resource.findOne({ where: { id, uploaderId } });

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found or unauthorized' });
        }

        // Delete the physical file
        const filePath = path.join(__dirname, '..', resource.fileUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete from database
        await resource.destroy();

        res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
