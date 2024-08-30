const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Adjust the path as needed
const router = express.Router();

const JWT_SECRET = 'your_jwt_secret'; // Replace with your secret key

// Route to render login page
router.get('/', (req, res) => {
    res.render('auth/login'); // Ensure this matches the view file name
});

// Handle POST request for login
router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Direct password comparison (no hashing)
        if (password !== user.password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1m' });

        // Wait for 1 minute and then try to verify the token again
        setTimeout(() => {
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    console.error('Token verification failed after expiration:', err.message);
                } else {
                    console.log('Decoded Token after expiration:', decoded);
                }
            });
        }, 60000); // Wait for 60 seconds (1 minute)

        // Set token in cookie
        res.cookie('token', token, { httpOnly: true });

        // Return success response
        res.status(200).json({ message: 'Login successful', redirectUrl: '/home' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
