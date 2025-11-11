require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);
let db;
let usersCollection;
let experienceCollection;

// Connect to MongoDB
async function connectToDatabase() {
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        db = client.db('stefanramac_cv');
        usersCollection = db.collection('user');
        experienceCollection = db.collection('experience');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Auth middleware
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
}

// Route for main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for admin login page
app.get('/adminlogin', (req, res) => {
    res.sendFile(path.join(__dirname, 'adminlogin.html'));
});

// Route for dashboard (protected)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// API: Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.userId = user._id.toString();
        req.session.email = user.email;

        res.json({ 
            success: true, 
            message: 'Login successful',
            user: { email: user.email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API: Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// API: Check auth status
app.get('/api/auth/check', (req, res) => {
    if (req.session.userId) {
        res.json({ authenticated: true, email: req.session.email });
    } else {
        res.json({ authenticated: false });
    }
});

// API: Change password
app.post('/api/change-password', isAuthenticated, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'New passwords do not match' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters long' });
        }

        // Get current user
        const user = await usersCollection.findOne({ 
            _id: new ObjectId(req.session.userId) 
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await usersCollection.updateOne(
            { _id: new ObjectId(req.session.userId) },
            { $set: { password: hashedPassword, updatedAt: new Date() } }
        );

        res.json({ 
            success: true, 
            message: 'Password changed successfully' 
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API: Get all experiences (public)
app.get('/api/experiences', async (req, res) => {
    try {
        const experiences = await experienceCollection
            .find({})
            .sort({ startDate: -1 })
            .toArray();
        res.json(experiences);
    } catch (error) {
        console.error('Error fetching experiences:', error);
        res.status(500).json({ error: 'Failed to fetch experiences' });
    }
});

// API: Get single experience (protected)
app.get('/api/experiences/:id', isAuthenticated, async (req, res) => {
    try {
        const experience = await experienceCollection.findOne({ 
            _id: new ObjectId(req.params.id) 
        });
        
        if (!experience) {
            return res.status(404).json({ error: 'Experience not found' });
        }
        
        res.json(experience);
    } catch (error) {
        console.error('Error fetching experience:', error);
        res.status(500).json({ error: 'Failed to fetch experience' });
    }
});

// API: Create experience (protected)
app.post('/api/experiences', isAuthenticated, async (req, res) => {
    try {
        const { position, company, startDate, endDate, isPresent, description, skills } = req.body;

        if (!position || !company || !startDate || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newExperience = {
            position,
            company,
            startDate,
            endDate: isPresent ? null : endDate,
            isPresent: isPresent || false,
            description,
            skills: skills || [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await experienceCollection.insertOne(newExperience);
        
        res.status(201).json({ 
            success: true, 
            message: 'Experience created successfully',
            id: result.insertedId 
        });
    } catch (error) {
        console.error('Error creating experience:', error);
        res.status(500).json({ error: 'Failed to create experience' });
    }
});

// API: Update experience (protected)
app.put('/api/experiences/:id', isAuthenticated, async (req, res) => {
    try {
        const { position, company, startDate, endDate, isPresent, description, skills } = req.body;

        if (!position || !company || !startDate || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const updateData = {
            position,
            company,
            startDate,
            endDate: isPresent ? null : endDate,
            isPresent: isPresent || false,
            description,
            skills: skills || [],
            updatedAt: new Date()
        };

        const result = await experienceCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Experience not found' });
        }

        res.json({ 
            success: true, 
            message: 'Experience updated successfully' 
        });
    } catch (error) {
        console.error('Error updating experience:', error);
        res.status(500).json({ error: 'Failed to update experience' });
    }
});

// API: Delete experience (protected)
app.delete('/api/experiences/:id', isAuthenticated, async (req, res) => {
    try {
        const result = await experienceCollection.deleteOne({ 
            _id: new ObjectId(req.params.id) 
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Experience not found' });
        }

        res.json({ 
            success: true, 
            message: 'Experience deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting experience:', error);
        res.status(500).json({ error: 'Failed to delete experience' });
    }
});

// Route for API endpoint (optional - you can add more API routes)
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Stefan Ramač',
        profession: 'Web Developer',
        message: 'Welcome to my portfolio website!'
    });
});

// Catch-all route for 404 errors
app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Start server
connectToDatabase().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔌 Listening on: 0.0.0.0:${PORT}`);
        console.log('Available routes:');
        console.log('  GET  /                    - Main page');
        console.log('  GET  /adminlogin          - Admin login page');
        console.log('  GET  /dashboard           - Admin dashboard (protected)');
        console.log('  POST /api/login           - Login endpoint');
        console.log('  POST /api/logout          - Logout endpoint');
        console.log('  GET  /api/auth/check      - Check auth status');
        console.log('  POST /api/change-password - Change password (protected)');
        console.log('  GET  /api/experiences     - Get all experiences (public)');
        console.log('  POST /api/experiences     - Create experience (protected)');
        console.log('  PUT  /api/experiences/:id - Update experience (protected)');
        console.log('  DELETE /api/experiences/:id - Delete experience (protected)');
        console.log('  GET  /*                   - 404 page for all other routes');
    });
}).catch((error) => {
    console.error('❌ Failed to start server:', error);
    console.error('💡 Possible causes:');
    console.error('   - MongoDB connection failed (check MONGODB_URI in .env)');
    console.error('   - Port already in use');
    console.error('   - Missing .env file');
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nClosing MongoDB connection...');
    await client.close();
    process.exit(0);
});
