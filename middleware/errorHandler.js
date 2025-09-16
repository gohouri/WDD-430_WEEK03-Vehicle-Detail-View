// Error handling middleware
function errorHandler(err, req, res, next) {
    console.error('Error occurred:', err);
    
    let status = err.status || 500;
    let message = err.message || 'Internal Server Error';
    let nav = [];

    // Get navigation for error pages
    const utilities = require('../utilities');
    utilities.getNav().then(navData => {
        nav = navData;
        
        // Set error message based on status
        if (status === 404) {
            message = 'Page Not Found';
        } else if (status === 500) {
            message = 'Internal Server Error';
        }

        // Render error page
        res.status(status).render('errors/error', {
            title: `${status} Error`,
            nav,
            message,
            status,
            error: process.env.NODE_ENV === 'development' ? err : {}
        });
    }).catch(error => {
        console.error('Error getting navigation:', error);
        // Fallback error page without navigation
        res.status(status).render('errors/error', {
            title: `${status} Error`,
            nav: [],
            message,
            status,
            error: process.env.NODE_ENV === 'development' ? err : {}
        });
    });
}

module.exports = errorHandler;
