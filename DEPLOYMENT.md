# Deployment Guide for Render.com

## 🚀 **Quick Fix for Current Issue**

The 500 errors on your Render deployment are caused by the database not being initialized. Here's how to fix it:

### **Step 1: Update Render Configuration**

1. Go to your Render dashboard
2. Select your "vehicle-detail-view" service
3. Go to "Settings" tab
4. Update the following:

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

**Environment Variables:**
- Add: `NODE_ENV` = `production`

### **Step 2: Redeploy**

1. Go to "Manual Deploy" tab
2. Click "Deploy latest commit"
3. Wait for deployment to complete

## 🔧 **What Was Fixed**

1. **Database Initialization**: Added `postinstall` script to initialize database during build
2. **Environment Handling**: Added proper environment variable handling
3. **Error Handling**: Improved error handling for database operations
4. **Build Process**: Database is now created during the build phase

## ✅ **Expected Results After Fix**

- ✅ Home page: `https://wdd-430-week03-vehicle-detail-view.onrender.com/`
- ✅ SUV classification: `https://wdd-430-week03-vehicle-detail-view.onrender.com/inventory/classification/1`
- ✅ Sedan classification: `https://wdd-430-week03-vehicle-detail-view.onrender.com/inventory/classification/2`
- ✅ Truck classification: `https://wdd-430-week03-vehicle-detail-view.onrender.com/inventory/classification/3`
- ✅ Coupe classification: `https://wdd-430-week03-vehicle-detail-view.onrender.com/inventory/classification/4`
- ✅ Vehicle details: `https://wdd-430-week03-vehicle-detail-view.onrender.com/inventory/detail/1`
- ✅ Error handling: `https://wdd-430-week03-vehicle-detail-view.onrender.com/error/trigger`

## 🐛 **Troubleshooting**

If you still get errors after redeployment:

1. **Check Render Logs**: Go to "Logs" tab to see error messages
2. **Verify Environment**: Ensure `NODE_ENV=production` is set
3. **Check Build**: Ensure build command completed successfully
4. **Database Path**: Verify database file is created in the correct location

## 📝 **Files Modified for Deployment**

- `package.json`: Added build and postinstall scripts
- `data/init-db.js`: Added environment handling
- `server.js`: Added database initialization on startup
- `render.yaml`: Added Render configuration
- `test-db.js`: Added database testing script

## 🎯 **Next Steps**

1. Update Render configuration as described above
2. Redeploy the application
3. Test all classification pages
4. Test vehicle detail pages
5. Test error handling
6. Submit both GitHub and Render URLs for grading
