const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for static files
app.use(express.static(path.join(__dirname)));

// Route for main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for API endpoint (optional - you can add more API routes)
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Stefan Ramač',
        profession: 'Web Developer',
        message: 'Welcome to my portfolio website!'
    });
});

// Route for contact form (POST)
app.post('/api/contact', express.json(), (req, res) => {
    const { name, message } = req.body;
    
    // Here you can add logic for sending emails or saving to database
    console.log('New message:', { name, message, timestamp: new Date() });
    
    res.json({
        success: true,
        message: 'Message sent successfully!'
    });
});

// Catch-all route for 404 errors
app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Available routes:');
    console.log('  GET  /           - Main page');
    console.log('  GET  /api/info   - API information');
    console.log('  POST /api/contact - Contact form');
    console.log('  GET  /*          - 404 page for all other routes');
});
