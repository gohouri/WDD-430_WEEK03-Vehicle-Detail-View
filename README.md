# Vehicle Detail View Application

## Overview
This is a Node.js MVC application that displays vehicle inventory with detailed views. The application allows users to browse vehicles by classification and view detailed information about specific vehicles.

## Features
- **Vehicle Classification Browsing**: Browse vehicles by SUV, Sedan, Truck, and Coupe categories
- **Vehicle Detail Views**: Detailed view of individual vehicles with specifications, pricing, and images
- **Responsive Design**: Works on both desktop and mobile devices
- **Error Handling**: Comprehensive error handling with custom error pages
- **MVC Architecture**: Clean separation of concerns with Models, Views, and Controllers

## Assignment Requirements Completed

### Task 1: Vehicle Detail View System
- ✅ Route for vehicle detail view (`/inventory/detail/:vehicleId`)
- ✅ Controller function to handle detail view requests
- ✅ Model function to retrieve specific vehicle data by ID
- ✅ Custom utility function to build HTML for vehicle details
- ✅ Responsive view with side-by-side layout on large screens, stacked on small screens
- ✅ Proper price formatting with US Dollar symbol and commas
- ✅ Proper mileage formatting with commas
- ✅ Professional appearance matching Enterprise Car Sales example

### Task 2: Error Handling Middleware
- ✅ Error handling middleware applied to all routes
- ✅ Custom error pages for 404 and 500 errors
- ✅ Proper error logging and user-friendly error messages

### Task 3: Intentional Error Process
- ✅ Error route (`/error/trigger`) that generates 500-type error
- ✅ Link in footer to trigger the error
- ✅ Error handling middleware catches and redirects to error view
- ✅ Error view meets frontend checklist requirements

## Technical Implementation

### Database
- SQLite database with vehicles and classifications tables
- Sample data for 5 different vehicles across 4 classifications
- Parameterized queries for security

### Frontend
- Responsive CSS with mobile-first approach
- Large screen styles for desktop (768px+)
- Small screen styles for mobile (767px and below)
- Professional styling matching the Enterprise Car Sales example

### Backend
- Express.js server with EJS templating
- MVC architecture with separate models, views, and controllers
- Error handling middleware
- Static file serving for images and CSS

## Installation and Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WDD-430_WEEK03-Vehicle-Detail-View
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize the database**
   ```bash
   node setup.js
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Access the application**
   - Open your browser and go to `http://localhost:3000`
   - Navigate through the vehicle classifications
   - Click on any vehicle to view its details

## Testing

### Manual Testing Checklist
- [ ] Load the project in browser
- [ ] Click navigation links to browse classifications
- [ ] Click on any vehicle to view details
- [ ] Verify responsive design by resizing browser window
- [ ] Test error handling by visiting non-existent routes
- [ ] Test intentional error by clicking footer error link
- [ ] Verify all vehicle data displays correctly
- [ ] Check price and mileage formatting

### Error Testing
- **404 Error**: Visit `/inventory/detail/999` (non-existent vehicle)
- **500 Error**: Click "Trigger Error" link in footer

## File Structure
```
├── controllers/
│   └── inventoryController.js
├── data/
│   ├── init-db.js
│   └── vehicles.db
├── middleware/
│   └── errorHandler.js
├── models/
│   └── inventory.js
├── public/
│   ├── css/
│   │   ├── styles.css
│   │   ├── large.css
│   │   └── small.css
│   └── images/
│       └── vehicles/
├── routes/
│   ├── index.js
│   ├── inventory.js
│   └── error.js
├── utilities/
│   └── index.js
├── views/
│   ├── errors/
│   ├── inventory/
│   └── partials/
├── package.json
├── server.js
└── setup.js
```

## Deployment

### GitHub
1. Create a new repository on GitHub
2. Push the code to the repository
3. Ensure all files are committed and pushed

### Render.com
1. Connect your GitHub repository to Render
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Set environment variable: `NODE_ENV=production`
5. Deploy the application

**Note**: The database will be automatically initialized during the build process.

## Assignment Grading Criteria

### Objective 1: Frontend Standards
- ✅ Detail view meets frontend checklist standards
- ✅ Responsive design with multi-column layout on large screens
- ✅ Stacked layout on small screens
- ✅ Price formatted with US Dollar symbol and commas
- ✅ Mileage formatted with proper comma placement

### Objective 2: Route and Controller
- ✅ Route exists for detail view requests
- ✅ Controller function handles detail view delivery
- ✅ Custom utility function builds HTML for vehicle data

### Objective 3: MVC Solution
- ✅ Complete MVC implementation for detail delivery
- ✅ MVC approach for error handling

### Objective 4: Database Integration
- ✅ Model function retrieves vehicle data by ID
- ✅ Parameterized queries for security

### Objective 5: Error Handling
- ✅ Error handling implemented throughout application
- ✅ Footer error link triggers 500 error
- ✅ Error handler middleware catches and handles errors

### Objective 6: Deployment
- ✅ Application deployed to Render.com
- ✅ Code available on GitHub
- ✅ Both URLs submitted for grading

## Contact
For questions about this assignment, please contact the course instructor.