# Forgot Password & Password Reset - Quick Setup Guide

## Quick Start (5 Minutes)

### Step 1: Run Database Migration
Execute this SQL in your database:

```sql
ALTER TABLE admins ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS reset_token_expires DATETIME DEFAULT NULL;

ALTER TABLE lecturer_auth ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE lecturer_auth ADD COLUMN IF NOT EXISTS reset_token_expires DATETIME DEFAULT NULL;

ALTER TABLE students ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE students ADD COLUMN IF NOT EXISTS reset_token_expires DATETIME DEFAULT NULL;
```

### Step 2: Update .env File
Add these to your `.env` file (in backend directory):

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

**For Gmail Users:**
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Copy the 16-character password
4. Paste as EMAIL_PASS in .env

### Step 3: Restart Backend
```bash
cd backend
npm run dev
```

## What Was Built

### Frontend Features:
✅ Forgot Password modal on Login page
✅ Reset Password page with validation
✅ Email input validation
✅ Password confirmation matching
✅ Success/error messages

### Backend Features:
✅ POST `/api/auth/forgot-password` - Email verification & token generation
✅ POST `/api/auth/reset-password` - Token validation & password update
✅ Email sending with reset link
✅ Token expiration (1 hour)
✅ Password hashing with bcrypt
✅ Database columns for reset tokens

### Database Updates:
✅ Added reset_token column (stores token)
✅ Added reset_token_expires column (stores expiration time)
✅ Applied to: admins, lecturer_auth, students tables

## How It Works

1. User clicks "Forgot password?" on login
2. Modal appears for email input
3. Backend checks email in database
4. If exists, sends reset email with secure link
5. User clicks link in email
6. Taken to reset password page with token
7. User enters new password
8. Backend validates token & updates password
9. User redirected to login
10. User logs in with new password

## Files Added/Modified

**New Files:**
- `backend/sql/add_password_reset.sql` - Database migration
- `frontend/src/pages/ResetPassword.jsx` - Password reset form page
- `PASSWORD_RESET_SETUP.md` - Full setup documentation

**Modified Files:**
- `backend/routes/auth.js` - New endpoints
- `frontend/src/pages/Login.jsx` - Forgot password modal
- `frontend/src/App.jsx` - New route for reset password

## Testing

After setup, test the full flow:
1. Go to http://localhost:5173/login
2. Click "Forgot password?"
3. Enter your email
4. Check your email for reset link
5. Click link and set new password
6. Login with new password

## Email Configuration Help

### Gmail:
- EMAIL_HOST: `smtp.gmail.com`
- EMAIL_PORT: `587`
- EMAIL_USER: Your Gmail email
- EMAIL_PASS: App password from https://myaccount.google.com/apppasswords

### Outlook:
- EMAIL_HOST: `smtp-mail.outlook.com`
- EMAIL_PORT: `587`
- EMAIL_USER: Your Outlook email
- EMAIL_PASS: Your Outlook password

### SendGrid:
- EMAIL_HOST: `smtp.sendgrid.net`
- EMAIL_PORT: `587`
- EMAIL_USER: `apikey`
- EMAIL_PASS: Your SendGrid API key

## Customization

### Change Token Expiration:
In `backend/routes/auth.js` line ~150:
```javascript
const resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // Change 1 to your hours
```

### Change Password Requirements:
In `frontend/src/pages/ResetPassword.jsx`:
```javascript
if (newPassword.length < 6) { // Change 6 to minimum length you want
```

### Customize Email Template:
In `backend/routes/auth.js` search for `sendMail` and modify the HTML template

## Security Notes

⚠️ Always use HTTPS in production
⚠️ Don't commit .env file to git
⚠️ Use strong EMAIL_PASS (app passwords for Gmail)
⚠️ Tokens are one-time use and expire after 1 hour
⚠️ Passwords are hashed with bcrypt

## Support

If you have issues:
1. Check browser console for frontend errors
2. Check terminal for backend errors
3. Verify email credentials in .env
4. Check database columns were added correctly
5. Verify frontend URL in .env matches your app URL
