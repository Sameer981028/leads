# Sales CRM API Documentation

## Setup Instructions

### 1. Database Configuration
1. Import the SQL file: `database/sales_crm.sql`
2. Update database credentials in `config/database.php`:
   - `$host` - Your database host (usually "localhost")
   - `$db_name` - Database name ("sales_crm")
   - `$username` - Your database username
   - `$password` - Your database password

### 2. Server Setup
1. Upload the entire `api` folder to your Hostinger server
2. Ensure PHP 7.4+ is enabled
3. Make sure PDO MySQL extension is enabled

### 3. API Endpoints

#### Authentication
- `POST /api/auth/login.php` - User login

#### Leads Management
- `GET /api/leads/` - Get all leads
- `POST /api/leads/` - Create new lead
- `PUT /api/leads/` - Update lead
- `DELETE /api/leads/` - Delete lead

#### Demos Management
- `GET /api/demos/` - Get all demos
- `POST /api/demos/` - Create new demo
- `PUT /api/demos/` - Update demo
- `DELETE /api/demos/` - Delete demo

#### Integrations Management
- `GET /api/integrations/` - Get all integrations
- `POST /api/integrations/` - Create new integration
- `PUT /api/integrations/` - Update integration
- `DELETE /api/integrations/` - Delete integration

#### Payments Management
- `GET /api/payments/` - Get all payments
- `POST /api/payments/` - Create new payment
- `PUT /api/payments/` - Update payment
- `DELETE /api/payments/` - Delete payment

#### Notifications Management
- `GET /api/notifications/` - Get all notifications
- `POST /api/notifications/` - Create new notification
- `PUT /api/notifications/` - Update notification
- `DELETE /api/notifications/` - Delete notification

#### Users Management
- `GET /api/users/` - Get all users
- `POST /api/users/` - Create new user
- `PUT /api/users/` - Update user
- `DELETE /api/users/` - Delete user

#### Reports
- `GET /api/reports/dashboard.php` - Get dashboard statistics

### 4. Request/Response Format

All requests should be sent as JSON with `Content-Type: application/json` header.

Example request:
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "source": "Website",
    "campaign": "Summer Sale"
}
```

Example response:
```json
{
    "success": true,
    "message": "Lead created successfully",
    "data": {
        "id": 123
    }
}
```

### 5. Error Handling

All errors return JSON with the following format:
```json
{
    "success": false,
    "message": "Error description"
}
```

### 6. Security Notes

- All passwords are hashed using PHP's `password_hash()` function
- CORS headers are included for cross-origin requests
- Input validation is performed on all endpoints
- SQL injection protection using prepared statements

### 7. Default Admin User

- Email: admin@salescrm.com
- Password: admin123

**Important: Change the default admin password after setup!**