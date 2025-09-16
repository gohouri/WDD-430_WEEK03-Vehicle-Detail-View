const { execSync } = require('child_process');
const path = require('path');

console.log('Setting up Vehicle Detail View Application...');

try {
    // Install dependencies
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    // Initialize database
    console.log('Initializing database...');
    require('./data/init-db.js');
    
    console.log('Setup complete!');
    console.log('Run "npm start" to start the server');
} catch (error) {
    console.error('Setup failed:', error.message);
    process.exit(1);
}
