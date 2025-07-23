# Sales CRM - Complete Installation Guide

## 🚀 Quick Start Installation

### Step 1: Import Database
1. Open **phpMyAdmin** in your Hostinger control panel
2. Create a new database named `sales_crm` (or any name you prefer)
3. Select the database and click **Import**
4. Upload the `database/sales_crm_complete.sql` file
5. Click **Go** to import

### Step 2: Configure Database Connection
1. Open `api/config/database.php` on your server
2. Update the database credentials:
```php
private $host = "localhost";
private $db_name = "sales_crm"; // Your database name
private $username = "your_db_username"; // Your database username
private $password = "your_db_password"; // Your database password
```

### Step 3: Upload Files
1. Upload contents of `dist/` folder to your domain root
2. Upload `api/` folder to your domain root
3. Ensure proper file permissions (644 for files, 755 for folders)

### Step 4: Test Your Installation
1. Visit your domain URL
2. Test all features: leads, demos, integrations, payments
3. Default admin login: `admin@salescrm.com` / `admin123`

## 📊 Database Features

### ✅ Complete Schema
- **Users**: Admin, managers, telecallers with role-based access
- **Leads**: Complete lead lifecycle tracking
- **Demos**: Demo scheduling and management
- **Integrations**: Integration process tracking
- **Payments**: Payment processing and records
- **Notifications**: System alerts and reminders

### ✅ Sample Data Included
- 3 users (admin, manager, telecaller)
- 6 sample leads with different statuses
- 2 demo records (active and scheduled)
- 2 integration records (completed and in-progress)
- 2 payment records (paid and pending)
- 6 notifications covering all types

### ✅ Advanced Features
- **Views**: Pre-built reporting views for dashboard metrics
- **Stored Procedures**: Automated workflow procedures
- **Triggers**: Automatic status updates and notifications
- **Indexes**: Optimized for fast queries and reporting

### ✅ Workflow Automation
- Auto-create notifications for new leads
- Auto-update lead status based on demo/integration/payment changes
- Auto-generate expiring demo alerts
- Complete audit trail with timestamps

## 🔧 Database Tables Structure

### Users Table
- User management with roles (Admin, Manager, Telecaller, Sales Rep)
- Secure password hashing
- Created/updated timestamps

### Leads Table
- Complete lead information (name, email, phone, source, campaign)
- Status tracking (New → Contacted → Demo → Integrated → Paid)
- Assignment to users
- Remarks and feedback fields

### Demos Table
- Demo scheduling (Video, Live, Trial)
- Start/end dates with status tracking
- Linked to leads with cascade delete

### Integrations Table
- Integration process management
- Progress tracking with completion percentage
- Technical notes and feedback

### Payments Table
- Payment records with amount and currency
- Multiple payment methods support
- Transaction and invoice ID tracking

### Notifications Table
- System-wide notification system
- Priority levels and read status
- Linked to leads and users

## 📈 Built-in Reports

### Dashboard Metrics View
Provides real-time statistics:
- Total leads count
- Integration started/completed counts
- Payments received/pending counts
- Active demos count
- Total revenue calculation

### Lead Summary View
Complete lead overview with:
- Lead basic information
- Assigned user details
- Demo information and status
- Integration progress
- Payment status and amounts

## 🔄 Automated Workflows

### Status Updates
- New lead → Auto-assign notification
- Demo created → Lead status becomes "Demo"
- Integration started → Lead status becomes "Integrated"
- Payment received → Lead status becomes "Paid"

### Notifications
- Automatic demo expiry alerts (2 days before)
- Payment confirmation notifications
- Lead assignment notifications
- Status change notifications

## 🛠️ Maintenance

### Regular Tasks
- Run `CALL CheckExpiringDemos();` daily to check for expiring demos
- Monitor notification table size and archive old notifications
- Backup database regularly

### Performance
- All tables are indexed for optimal performance
- Foreign key constraints ensure data integrity
- Views provide fast access to common queries

## 🔐 Security Features

- Password hashing using PHP's `PASSWORD_DEFAULT`
- Foreign key constraints prevent orphaned records
- Input validation in PHP API files
- Role-based access control ready

## 📞 Support

Your Sales CRM database is now fully configured and ready for production use!

**Default Login Credentials:**
- Email: `admin@salescrm.com`
- Password: `admin123`

**⚠️ Important:** Change the default admin password after first login!