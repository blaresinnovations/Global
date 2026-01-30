# Admin Creation Feature Setup Guide

## Overview
This feature allows Super Admins to create new admin accounts with different roles (Super Admin, Admin, Staff). When an admin is created, their credentials are automatically sent to their email address.

## Features
✅ Create admins with Full Name, Email, and Role
✅ Three role levels: Super Admin, Admin, Staff
✅ Auto-generated unique username (based on email)
✅ Secure password generation and hashing
✅ Automated credential email sending
✅ Database updates with admin information
✅ Edit and manage existing admins
✅ Active/Inactive admin status

## Setup Instructions

### 1. Database Migration
Run the migration script to update the admins table:

```bash
cd backend
node tools/migrate_admins.js
```

This will:
- Add `username` column to admins table
- Update role ENUM values to: 'Super Admin', 'Admin', 'Staff'
- Create an index for faster username lookups

### 2. Environment Configuration
Update your `.env` file in the backend directory:

```env
# Email Configuration (Gmail recommended)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173

# Other existing variables
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=global_gate
```

### 3. Gmail Setup (if using Gmail)
If using Gmail for email sending:
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the generated 16-character password in `EMAIL_PASS`

## API Endpoint Details

### Create Admin
**POST** `/api/admins`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@globalgate.edu",
  "password": "secure_password",
  "role": "Admin"
}
```

Response:
```json
{
  "ok": true,
  "id": 5,
  "message": "Admin created and credentials sent to email"
}
```

### List Admins
**GET** `/api/admins`

Response:
```json
[
  {
    "id": 1,
    "name": "Admin User",
    "email": "admin@globalgate.edu",
    "username": "admin_abc123",
    "role": "Super Admin",
    "is_active": 1,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### Update Admin
**PUT** `/api/admins/:id`

Request body:
```json
{
  "name": "John Doe Updated",
  "role": "Staff"
}
```

### Delete Admin
**DELETE** `/api/admins/:id`

## Admin Roles

### Super Admin
- Full access to all features
- Can create, edit, and delete other admins
- Can manage all courses, lecturers, students
- Can approve payments and inquiries

### Admin
- Can manage courses and lecturers
- Can view students
- Can approve student registrations
- Cannot manage other admins

### Staff
- Limited access
- Can view data only
- Cannot create or modify records
- Can view inquiries and payments

## Email Template
When an admin is created, they receive an email with:
- Welcome message
- Generated username
- Their password
- Login URL
- Security reminder to change password after first login

## Frontend Interface

### Add Admin Form
Located in: Admin Panel → Admins → Add Admin Tab

Fields:
- **Full Name** (required): Admin's full name
- **Email** (required, unique): Admin's email address
- **Password** (required): Initial password
- **Role** (required): Select from Super Admin, Admin, Staff

### Admin List
View all created admins with:
- Name, Email, Role
- Active/Inactive status
- Edit button (edit name and role)
- Toggle activation status
- Delete button

## Troubleshooting

### Email Not Sending
1. Check `.env` file has correct EMAIL_USER and EMAIL_PASS
2. Verify Gmail App Password is correct (16 characters, no spaces)
3. Check network connectivity
4. Review server logs for error messages

### Database Error
1. Ensure migration script ran successfully
2. Check database connection settings in `.env`
3. Verify admins table structure with migration

### Username Not Generated
- Username is auto-generated from email (email_prefix + random code)
- If username already exists, a new one is generated

## Security Notes
⚠️ Passwords are hashed using bcryptjs (10 salt rounds)
⚠️ Never log or display plaintext passwords in response
⚠️ Passwords are sent via email only once during creation
⚠️ Admins should change password after first login
⚠️ Email credentials should be app-specific passwords, not main account password

## Support
For issues or questions, check the server logs:
```bash
tail -f backend.log
```

Or review the database:
```sql
SELECT * FROM admins;
DESCRIBE admins;
```
