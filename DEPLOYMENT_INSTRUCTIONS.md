# 🚀 Deployment Instructions for cPanel

## 📦 Files in deployment.zip

This zip contains everything needed to run the application on cPanel:
- Server files (server.js, package.json)
- Frontend files (index.html, dashboard.html, adminlogin.html, 404.html)
- Styles and scripts (styles.css, script.js)
- Images (img folder with profile-pic.jpeg)
- Database initialization script (init-db.js)

## ⚙️ Step-by-Step Deployment Guide

### 1. Upload Files to cPanel
1. Extract `deployment.zip` to your cPanel public_html or application directory
2. Navigate to the uploaded directory

### 2. Create .env File (CRITICAL!)
Create a new file called `.env` in the root directory with this content:

```env
MONGODB_URI=mongodb+srv://stefanramac_cv:$t3f4nR4m4ch!98@clusterfortesting.pp3jsjt.mongodb.net/?retryWrites=true&w=majority&appName=ClusterForTesting
PORT=3003
SESSION_SECRET=change-this-to-random-string-for-security
```

**IMPORTANT:** 
- Change the PORT if cPanel requires a different one (check Node.js setup in cPanel)
- Generate a random string for SESSION_SECRET

### 3. Configure MongoDB Atlas (CRITICAL!)
This is the #1 cause of 503 errors!

1. Go to https://cloud.mongodb.com
2. Select your cluster: **ClusterForTesting**
3. Click **Network Access** in the left menu
4. Click **Add IP Address**
5. Either:
   - Add your cPanel server's IP address (ask your hosting provider)
   - OR add `0.0.0.0/0` to allow all IPs (less secure but easier)
6. Click **Confirm**

Without this step, your application WILL NOT WORK!

### 4. Install Dependencies
In cPanel Node.js application setup or via terminal:

```bash
npm install
```

This will install all required packages from package.json.

### 5. Initialize Database (First Time Only)
Run this command once to create the admin user and sample data:

```bash
node init-db.js
```

Default admin credentials:
- Email: admin@stefanramac.com
- Password: admin123

**IMPORTANT:** Change the password immediately after first login via the dashboard!

### 6. Configure cPanel Node.js Application
In cPanel → Setup Node.js App:
- **Application mode:** Production
- **Application root:** (your upload directory)
- **Application URL:** stefanramac.com
- **Application startup file:** server.js
- **Node.js version:** 18.x or higher (recommended)

### 7. Start the Application
Click **Restart** in cPanel Node.js setup.

### 8. Check Application Logs
If you see 503 error:
1. Go to cPanel → Node.js → Your App → **View Log**
2. Look for error messages:
   - "MongoDB connection failed" → Check step 3 (IP whitelist)
   - "Missing .env file" → Check step 2
   - "Port already in use" → Change PORT in .env

## 🔍 Troubleshooting

### 503 Service Unavailable
**Most common causes:**
1. ❌ MongoDB IP not whitelisted (Step 3)
2. ❌ Missing .env file (Step 2)
3. ❌ Wrong PORT number (Step 2)
4. ❌ npm install not completed (Step 4)

### How to Debug
1. Check application logs in cPanel
2. Verify .env file exists and has correct MongoDB URI
3. Test MongoDB connection from MongoDB Atlas console
4. Ensure all dependencies are installed

## 📝 Important URLs

After successful deployment:
- **Main site:** https://stefanramac.com
- **Admin login:** https://stefanramac.com/adminlogin
- **Dashboard:** https://stefanramac.com/dashboard (requires login)

## 🔐 Security Notes

1. Change the default admin password immediately!
2. Use a strong SESSION_SECRET in .env
3. Consider restricting MongoDB IP to only your server's IP
4. Keep your MongoDB password secure

## 📞 Need Help?

If you encounter issues:
1. Check the application logs in cPanel
2. Verify MongoDB connection in Atlas
3. Ensure .env file is properly configured
4. Contact your hosting provider for server-specific issues

---

Good luck with your deployment! 🚀

