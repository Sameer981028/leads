# Sales CRM - Hostinger Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Update Configuration Files

#### A. Update API Base URL
- Open `src/services/api.ts`
- Change line 4: `const API_BASE_URL = 'https://crm.yourdomain.com/api';`
- Replace `crm.yourdomain.com` with your actual Hostinger subdomain

#### B. Database Configuration (After Upload)
- Edit `api/config/database.php` on your server
- Update these variables with your Hostinger database credentials:
  ```php
  private $host = "localhost";
  private $db_name = "your_database_name";
  private $username = "your_database_username"; 
  private $password = "your_database_password";
  ```

### 2. Build the Frontend Application

Run this command in your project root directory:
```bash
npm run build
```

This creates a `dist` folder with production-ready files.

## 🚀 Hostinger Setup Steps

### Step 1: Create Subdomain
1. Log in to Hostinger hPanel
2. Go to **Domains** → **Subdomains**
3. Create subdomain (e.g., `crm.yourdomain.com`)
4. Note the document root path (e.g., `public_html/crm.yourdomain.com`)

### Step 2: Create MySQL Database
1. In hPanel, go to **Databases** → **MySQL Databases**
2. Create new database: `sales_crm`
3. Create database user with full privileges
4. Note down: database name, username, password

### Step 3: Import Database Schema
1. Open **phpMyAdmin** from hPanel
2. Select your `sales_crm` database
3. Go to **Import** tab
4. Upload and import `database/sales_crm.sql`
5. Verify tables are created successfully

### Step 4: Upload Files

#### Frontend Files:
1. Connect via FTP or use Hostinger File Manager
2. Navigate to your subdomain's root (e.g., `public_html/crm.yourdomain.com/`)
3. Upload **contents** of `dist` folder (not the folder itself)
4. Files should include: `index.html`, `assets/` folder, etc.

#### Backend API Files:
1. In the same subdomain root, create `api` folder
2. Upload entire `api` folder contents:
   - `config/database.php`
   - `leads/index.php`
   - `notifications/index.php`
   - `demos/index.php`
   - `integrations/index.php`
   - `payments/index.php`
   - `users/index.php`
   - `reports/dashboard.php`
   - `auth/login.php`
   - `.htaccess`

### Step 5: Configure Database Connection
1. Edit `api/config/database.php` on your server
2. Update with your actual Hostinger database credentials
3. Test database connection

### Step 6: Set File Permissions
Ensure proper permissions for PHP files:
- PHP files: 644
- Directories: 755
- `.htaccess`: 644

## 🧪 Testing Your Deployment

### Test Checklist:
- [ ] Website loads at your subdomain URL
- [ ] Dashboard displays metrics
- [ ] Lead upload functionality works
- [ ] Manual lead addition works
- [ ] Lead status updates work
- [ ] Demo panel functions correctly
- [ ] Integration panel works
- [ ] Notifications system works
- [ ] Reports generate properly

### Common Issues & Solutions:

#### 1. "API Error" or Network Issues
- Check `API_BASE_URL` in frontend matches your actual API location
- Verify `.htaccess` file is uploaded and CORS headers are set
- Check PHP error logs in hPanel

#### 2. Database Connection Errors
- Verify database credentials in `api/config/database.php`
- Ensure database user has proper privileges
- Check if database name is correct

#### 3. 404 Errors on API Calls
- Verify API folder structure is correct
- Check `.htaccess` file is present in `api` folder
- Ensure PHP files have correct permissions

## 📁 File Structure on Server

```
public_html/crm.yourdomain.com/
├── index.html                 (Frontend)
├── assets/                    (Frontend assets)
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── api/                       (Backend)
    ├── .htaccess
    ├── config/
    │   └── database.php
    ├── leads/
    │   └── index.php
    ├── notifications/
    │   └── index.php
    ├── demos/
    │   └── index.php
    ├── integrations/
    │   └── index.php
    ├── payments/
    │   └── index.php
    ├── users/
    │   └── index.php
    ├── reports/
    │   └── dashboard.php
    └── auth/
        └── login.php
```

## 🔐 Default Login Credentials

- **Email**: admin@salescrm.com
- **Password**: admin123

**⚠️ Important**: Change the default password after first login!

## 🗑️ Files Not Needed on Server

These development files should NOT be uploaded to your server:
- `node_modules/`
- `src/` folder
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.ts`
- `eslint.config.js`
- `postcss.config.js`
- `tailwind.config.js`
- `.gitignore`
- `README.md`

## 📞 Support

If you encounter issues:
1. Check Hostinger's error logs in hPanel
2. Verify all configuration steps
3. Test API endpoints directly in browser
4. Check browser console for JavaScript errors

Your Sales CRM is now ready for production use! 🎉