const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Resource = require('./Resource');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    },
    comment: {
        type: DataTypes.TEXT,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    resourceId: {
        type: DataTypes.INTEGER,
        references: {
            model: Resource,
            key: 'id',
        },
    },
}, {
    timestamps: true,
});

// Relationships
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

Resource.hasMany(Review, { foreignKey: 'resourceId' });
Review.belongsTo(Resource, { foreignKey: 'resourceId' });

module.exports = Review;
