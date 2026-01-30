# Password Reset & Forgot Password Setup Instructions

## What Was Implemented

### 1. **Database Updates**
A new SQL migration file has been created: `backend/sql/add_password_reset.sql`

This adds three columns to each user table:
- `reset_token` (VARCHAR(255)) - Stores the unique reset token
- `reset_token_expires` (DATETIME) - Stores token expiration time (1 hour)

Tables Updated:
- `admins`
- `lecturer_auth`
- `students`

### 2. **Backend API Endpoints**

#### POST `/api/auth/forgot-password`
**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "If an account exists with this email, a reset link has been sent."
}
```

**What it does:**
- Checks if email exists in admins, lecturers, or students tables
- Generates a cryptographic reset token
- Sets token expiration to 1 hour from now
- Sends an email with a reset link containing the token
- Returns generic message for security (doesn't reveal if email exists)

#### POST `/api/auth/reset-password`
**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "new_password_here"
}
```

**Response:**
```json
{
  "message": "Password has been reset successfully. Please login with your new password."
}
```

**What it does:**
- Validates the reset token and checks expiration
- Hashes the new password with bcrypt
- Updates the password in the appropriate table
- Clears the reset token and expiration
- Returns success message

### 3. **Frontend Pages**

#### Login.jsx (Updated)
- Added "Forgot Password" modal dialog
- Email input field for forgot password
- Submits to `/api/auth/forgot-password` endpoint
- Shows success/error messages
- Modal can be closed by clicking X button or Cancel

#### ResetPassword.jsx (New)
- Accessed via `/reset-password?token=<token_from_email>`
- Displays form to enter new password and confirm password
- Validates password matches and minimum length (6 characters)
- Submits to `/api/auth/reset-password` endpoint
- Redirects to login page on success
- Shows error if token is invalid or expired

#### App.jsx (Updated)
- Added route for `/reset-password` page
- Added reset-password to hideLayout routes to hide navbar/footer

### 4. **Email Configuration**

The email sending uses nodemailer with configuration from .env file:

**Required .env Variables:**
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

#### For Gmail:
1. Enable 2-Factor Authentication on Gmail
2. Create an "App Password" at: https://myaccount.google.com/apppasswords
3. Use the generated 16-character password as EMAIL_PASS

#### For Other Email Services:
Update EMAIL_HOST and EMAIL_PORT accordingly (e.g., SendGrid, Mailgun, etc.)

## Setup Instructions

### 1. **Update Database**
Run the migration SQL file:
```sql
-- Execute the SQL from backend/sql/add_password_reset.sql
ALTER TABLE admins ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS reset_token_expires DATETIME DEFAULT NULL;

ALTER TABLE lecturer_auth ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE lecturer_auth ADD COLUMN IF NOT EXISTS reset_token_expires DATETIME DEFAULT NULL;

ALTER TABLE students ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE students ADD COLUMN IF NOT EXISTS reset_token_expires DATETIME DEFAULT NULL;
```

### 2. **Update .env File**
Add these variables to your `.env` file in the backend directory:

```
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL (for reset link in emails)
FRONTEND_URL=http://localhost:5173
```

### 3. **Install Dependencies**
The backend already has nodemailer installed. If not, run:
```bash
cd backend
npm install nodemailer
```

### 4. **Restart Backend**
Restart the backend server to load the new auth endpoints:
```bash
npm run dev
# or
npm start
```

## User Flow

### Forgot Password Flow:
1. User clicks "Forgot password?" on login page
2. Modal appears asking for email
3. User enters email and clicks "Send Reset Link"
4. Email is sent with reset link (if account exists)
5. User receives email and clicks the reset link
6. User is taken to `/reset-password?token=<token>` page
7. User enters new password and confirms it
8. Password is updated in database
9. User is redirected to login page
10. User logs in with new password

## Security Features

✅ **Token Expiration** - Tokens expire after 1 hour
✅ **Cryptographic Tokens** - 32-byte random tokens generated with crypto.randomBytes
✅ **Password Hashing** - Passwords hashed with bcrypt (10 salt rounds)
✅ **Email Privacy** - Generic messages don't reveal if email exists
✅ **HTTPS Recommended** - Should use HTTPS in production for security
✅ **Input Validation** - Passwords validated for length and match

## Testing

### Test with Postman/curl:

**1. Forgot Password Request:**
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com"}'
```

**2. Reset Password Request:**
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"<token_from_email>","newPassword":"newpass123"}'
```

## Troubleshooting

### Email Not Sending?
1. Check EMAIL_USER and EMAIL_PASS in .env are correct
2. For Gmail, make sure you generated an App Password (not your regular password)
3. Check console for email errors
4. Verify EMAIL_HOST and EMAIL_PORT are correct

### Token Expired?
1. Default expiration is 1 hour - can be modified in auth.js line ~150
2. User must click the link within 1 hour

### Password Update Not Working?
1. Check that the reset token exists in the correct table
2. Verify token hasn't expired (check reset_token_expires column)
3. Check console for database errors

## Files Modified/Created

### Created:
- `backend/sql/add_password_reset.sql` - Database migration
- `frontend/src/pages/ResetPassword.jsx` - Reset password page

### Modified:
- `backend/routes/auth.js` - Added forgot-password and reset-password endpoints
- `frontend/src/pages/Login.jsx` - Added forgot password modal
- `frontend/src/App.jsx` - Added reset-password route

### Need to Update:
- `.env` file - Add email configuration variables
