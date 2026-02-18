const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { name, email, password, college, branch, semester } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            college,
            branch,
            semester
        });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                college: user.college,
                branch: user.branch,
                semester: user.semester,
                credits: user.credits
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        console.log("UPDATE PROFILE REQUEST RECEIVED");
        console.log("BODY:", req.body);
        console.log("USER FROM TOKEN:", req.user);

        const { name, college, branch, semester } = req.body;
        const user = await User.findByPk(req.user.userId);

        if (!user) {
            console.log("USER NOT FOUND IN DB FOR ID:", req.user.userId);
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        user.name = name || user.name;
        user.college = college !== undefined ? college : user.college;
        user.branch = branch !== undefined ? branch : user.branch;
        user.semester = semester !== undefined ? semester : user.semester;

        await user.save();
        console.log("USER UPDATED SUCCESSFULLY IN DB");

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                college: user.college,
                branch: user.branch,
                semester: user.semester,
                credits: user.credits
            }
        });
    } catch (error) {
        console.error("DATABASE UPDATE ERROR DETAIL:");
        console.error("- Message:", error.message);
        console.error("- Name:", error.name);
        if (error.errors) {
            console.error("- Validation Errors:", error.errors.map(e => e.message));
        }
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        console.error("GET PROFILE ERROR:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
