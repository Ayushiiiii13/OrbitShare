const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Resource = sequelize.define('Resource', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fileType: {
        type: DataTypes.STRING,
    },
    // Foreign Key relationship
    uploaderId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
}, {
    timestamps: true,
});

// Relationships
User.hasMany(Resource, { foreignKey: 'uploaderId' });
Resource.belongsTo(User, { foreignKey: 'uploaderId' });

module.exports = Resource;
