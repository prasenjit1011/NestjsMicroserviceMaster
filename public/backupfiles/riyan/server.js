const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Simple in-memory user storage (for demo purposes)
const users = {};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'r.html'));
});

// Register user
app.post('/api/register', (req, res) => {
    const { email, password, name, address } = req.body;
    
    if (users[email]) {
        return res.json({ success: false, message: 'Email already registered' });
    }
    
    users[email] = { email, password, name, address };
    req.session.userId = email;
    req.session.userName = name;
    
    res.json({ success: true, message: 'Registration successful' });
});

// Login user
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!users[email] || users[email].password !== password) {
        return res.json({ success: false, message: 'Invalid email or password' });
    }
    
    req.session.userId = email;
    req.session.userName = users[email].name;
    
    res.json({ success: true, message: 'Login successful' });
});

// Check login status
app.get('/api/check-login', (req, res) => {
    if (req.session.userId) {
        res.json({ isLoggedIn: true, userName: req.session.userName });
    } else {
        res.json({ isLoggedIn: false });
    }
});

// Logout user
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Place order
app.post('/api/order', (req, res) => {
    if (!req.session.userId) {
        return res.json({ success: false, message: 'Please login to place order' });
    }
    
    const { product, quantity, paymentMethod } = req.body;
    
    // Store order (in-memory for demo)
    res.json({ 
        success: true, 
        message: `Order placed successfully! ${quantity} x ${product} via ${paymentMethod}`,
        orderId: Math.floor(Math.random() * 10000)
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
