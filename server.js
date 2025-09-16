const express = require('express');
const path = require('path');

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

// Routes
app.use('/', require('./routes/index'));
app.use('/inventory', require('./routes/inventory'));
app.use('/error', require('./routes/error'));

// Error handling middleware (must be last)
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
