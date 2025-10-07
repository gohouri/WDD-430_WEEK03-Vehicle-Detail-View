const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');

// Initialize database on startup
try {
    require('./data/init-db.js');
    console.log('Database initialization completed');
} catch (error) {
    console.error('Database initialization failed:', error);
}

const app = express();

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Disable caching for development
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// Session and flash message middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
}));
app.use(flash());

// Authentication middleware (check login status for all routes)
const auth = require('./middleware/auth');
app.use(auth.checkLoginStatus);

// Routes
app.use('/', require('./routes/index'));
app.use('/inventory', require('./routes/inventory'));
app.use('/account', require('./routes/account'));
app.use('/search', require('./routes/search'));
app.use('/error', require('./routes/error'));

// Error handling middleware (must be last)
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
