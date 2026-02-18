const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Resource Hub API is running...');
});

const authRoutes = require('./routes/authRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/reviews', reviewRoutes);

// Sync Database and Start Server
// alter: true updates tables if they exist without dropping them
sequelize.sync({ alter: true })
    .then(() => {
        console.log('MySQL Database connected & synced');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
