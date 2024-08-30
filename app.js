const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logInRouter = require('./routes/logIn'); // Adjust the path as needed
const authenticateToken = require('./middleware/auth.js'); // Import your middleware

// Initialize Express application
const app = express();

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Routes
app.use('/', logInRouter);

// Test route for checking token validity
app.get('/test', authenticateToken, (req, res) => {
    res.send('Token is valid and has not expired.');
});

// Home route
app.get('/home', authenticateToken, (req, res) => {
    res.render('index'); // Render your home page
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
