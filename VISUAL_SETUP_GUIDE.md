# Forgot Password Feature - Visual Setup Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER BROWSER                            │
├─────────────────────────────────────────────────────────────┤
│  Login Page (/login)                                         │
│  ├─ Email/Username input                                    │
│  ├─ Password input                                          │
│  └─ "Forgot password?" button → Opens Modal                 │
│                                                              │
│  Forgot Password Modal                                       │
│  ├─ Email input field                                       │
│  ├─ "Send Reset Link" button → POST /api/auth/forgot-pwd    │
│  └─ Success message                                         │
│                                                              │
│  Reset Password Page (/reset-password?token=XXX)            │
│  ├─ New Password input                                      │
│  ├─ Confirm Password input                                  │
│  ├─ "Reset Password" button → POST /api/auth/reset-pwd      │
│  └─ Success message + Redirect to login                     │
└─────────────────────────────────────────────────────────────┘
                          ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API SERVER                        │
├─────────────────────────────────────────────────────────────┤
│  POST /api/auth/forgot-password                              │
│  ├─ Receive: email                                          │
│  ├─ Validate: Email exists in DB                            │
│  ├─ Generate: Secure random token                           │
│  ├─ Store: Token + Expiration in DB                         │
│  ├─ Send: Email with reset link                             │
│  └─ Return: Success message                                 │
│                                                              │
│  POST /api/auth/reset-password                               │
│  ├─ Receive: token + newPassword                            │
│  ├─ Validate: Token exists & not expired                    │
│  ├─ Hash: New password with bcrypt                          │
│  ├─ Update: Password in DB                                  │
│  ├─ Clear: Reset token from DB                              │
│  └─ Return: Success message                                 │
│                                                              │
│  Email Transporter (Nodemailer)                              │
│  └─ Sends: HTML email with reset link                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE (MySQL)                        │
├─────────────────────────────────────────────────────────────┤
│  admins table                                                │
│  ├─ id, name, email, password_hash                          │
│  ├─ reset_token (NEW) ← Token stored here                   │
│  └─ reset_token_expires (NEW) ← Expiration time             │
│                                                              │
│  lecturer_auth table                                         │
│  ├─ lecturer_id, username, password_hash                    │
│  ├─ reset_token (NEW)                                       │
│  └─ reset_token_expires (NEW)                               │
│                                                              │
│  students table                                              │
│  ├─ id, email, name, nic                                    │
│  ├─ reset_token (NEW)                                       │
│  └─ reset_token_expires (NEW)                               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              EMAIL SERVICE (Gmail/Outlook/etc)              │
├─────────────────────────────────────────────────────────────┤
│  Nodemailer sends email with reset link                      │
│  └─ User receives email and clicks link                     │
└─────────────────────────────────────────────────────────────┘
```

## Setup Timeline

```
START
  ↓
[1] Run Database Migration (5 min)
  └─ Add reset_token columns to 3 tables
  ↓
[2] Update .env File (5 min)
  └─ Add EMAIL_HOST, EMAIL_USER, EMAIL_PASS, etc.
  ↓
[3] Restart Backend (1 min)
  └─ npm run dev
  ↓
[4] Test Feature (5 min)
  └─ Go to /login → Forgot password? → Check email
  ↓
DONE - Feature is Live!
```

## Data Flow - Forgot Password

```
User Action              Frontend                Backend              Database
═════════════════════════════════════════════════════════════════════════════

Click "Forgot Pwd"
  ↓                   Show Modal
  │
Enter Email            [Email Input]
  │
Click Send             POST /forgot-pwd ───→ Validate Email
  │                                           ↓
  │                                     Check admins table
  │                                     Check lecturer_auth
  │                                     Check students
  │                                           ↓
  │                                     Generate Token ───→ UPDATE reset_token
  │                                           ↓             UPDATE reset_token_expires
  │                                     Send Email
  │                                           ↓
  │                   ← Success Message      SMTP Server → User Email
  │
Show Success Msg
  ↓
User Receives Email with Reset Link

User Clicks Link → Redirected to:
/reset-password?token=abc123def456...
```

## Data Flow - Reset Password

```
User Action              Frontend                Backend              Database
═════════════════════════════════════════════════════════════════════════════

User at Reset Page
  ↓
Enter New Password     [Password Input]
Confirm Password       [Confirm Input]
  │
Click Reset            POST /reset-pwd ───→ Validate Token
  │                    (token from URL)      Check if exists
  │                                          Check if not expired
  │                                                 ↓
  │                                           Hash Password
  │                                                 ↓
  │                                           UPDATE password_hash ───→ UPDATE
  │                                           UPDATE reset_token = NULL ───→ UPDATE
  │                                           UPDATE reset_token_expires ───→ UPDATE
  │                                                 ↓
  │                   ← Success Message    
  │
Show Success & Redirect to /login (2 sec)
  ↓
User logs in with new password
```

## File Structure

```
GlobalWeb/
├── backend/
│   ├── routes/
│   │   └── auth.js (MODIFIED)
│   │       ├─ POST /forgot-password (NEW)
│   │       └─ POST /reset-password (NEW)
│   ├── sql/
│   │   └── add_password_reset.sql (NEW)
│   ├── .env.example (MODIFIED)
│   └── package.json (already has nodemailer)
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx (MODIFIED)
│       │   │   └─ Added forgot password modal
│       │   └── ResetPassword.jsx (NEW)
│       │       └─ Password reset form page
│       ├── App.jsx (MODIFIED)
│       │   └─ Added /reset-password route
│       └── ...
│
├── Documentation Files:
├── NEXT_STEPS_SETUP.md ............. START HERE
├── FORGOT_PASSWORD_QUICK_START.md .. Quick reference
├── PASSWORD_RESET_SETUP.md ......... Detailed setup
├── FORGOT_PASSWORD_IMPLEMENTATION.md Technical details
└── SETUP_SUMMARY.md ............... This summary
```

## Configuration Overview

```
.env File Requirements:
═══════════════════════════════════════════════════════════

EMAIL_HOST
├─ What: SMTP server hostname
├─ Example: smtp.gmail.com
└─ Other: smtp-mail.outlook.com, smtp.sendgrid.net

EMAIL_PORT
├─ What: SMTP server port
├─ Example: 587
└─ Other: 465 (SSL), 25 (unencrypted)

EMAIL_SECURE
├─ What: Use SSL/TLS encryption
├─ Value: true or false
└─ Usually: false for port 587, true for 465

EMAIL_USER
├─ What: Email account username
├─ Example: yourname@gmail.com
└─ Format: Usually your email address

EMAIL_PASS
├─ What: Email account password
├─ Example: abcd efgh ijkl mnop (Gmail App Password)
└─ Warning: NEVER use your actual Gmail password!

FRONTEND_URL
├─ What: URL for password reset links in emails
├─ Example: http://localhost:5173
└─ Production: https://yourdomain.com

Database Columns:
═══════════════════════════════════════════════════════════

reset_token
├─ Type: VARCHAR(255)
├─ Purpose: Stores the unique reset token
├─ Value: 64 hex characters (32 bytes encoded)
└─ Cleared: After successful password reset

reset_token_expires
├─ Type: DATETIME
├─ Purpose: Stores token expiration time
├─ Value: Current time + 1 hour
└─ Checked: Before allowing password reset
```

## Security Model

```
┌──────────────────────────────────────┐
│   User Initiates Password Reset      │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│ 1. Verify Email Exists               │
│    - Prevents email enumeration      │
│    - Generic response returned       │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│ 2. Generate Secure Token             │
│    - crypto.randomBytes(32)          │
│    - 64 hex characters               │
│    - Cryptographically secure        │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│ 3. Store Token with Expiration       │
│    - Token in reset_token column     │
│    - Expires in 1 hour               │
│    - Stored in database              │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│ 4. Send Email with Reset Link        │
│    - HTTPS link in email             │
│    - Unique token in URL             │
│    - Expiration warning              │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│ 5. User Receives & Clicks Link       │
│    - Must click within 1 hour        │
│    - Token passed in URL             │
│    - Redirects to reset page         │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│ 6. Validate Token                    │
│    - Check if exists                 │
│    - Check if not expired            │
│    - One-time use (cleared after)    │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│ 7. Hash New Password                 │
│    - bcrypt with 10 salt rounds      │
│    - Irreversible hashing            │
│    - 60 character hash               │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│ 8. Update Database                   │
│    - Replace old password hash       │
│    - Clear reset token               │
│    - Clear expiration time           │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│ 9. Confirm Success to User           │
│    - Redirect to login               │
│    - User logs in with new password  │
└──────────────────────────────────────┘
```

## Testing Checklist (Visual)

```
✓ Step 1: Database Setup
  ├─ Execute SQL migration
  ├─ Check admins table for new columns
  ├─ Check lecturer_auth table for new columns
  └─ Check students table for new columns

✓ Step 2: Configuration
  ├─ Add EMAIL_HOST to .env
  ├─ Add EMAIL_PORT to .env
  ├─ Add EMAIL_USER to .env
  ├─ Add EMAIL_PASS to .env
  └─ Add FRONTEND_URL to .env

✓ Step 3: Backend
  ├─ Restart with npm run dev
  ├─ No errors in console
  └─ Server listening on port

✓ Step 4: Frontend - Forgot Password
  ├─ Go to http://localhost:5173/login
  ├─ See "Forgot password?" link
  ├─ Click it
  ├─ Modal appears
  ├─ Enter email
  ├─ Click "Send Reset Link"
  └─ See success message

✓ Step 5: Email
  ├─ Check inbox
  ├─ See email from Global Gate
  ├─ Email has reset link button
  └─ Email has plain text link

✓ Step 6: Reset Password
  ├─ Click link in email
  ├─ Go to /reset-password page
  ├─ Form appears
  ├─ Enter new password
  ├─ Confirm password
  ├─ Click "Reset Password"
  └─ See success and redirect

✓ Step 7: Login
  ├─ Redirected to /login
  ├─ Enter email/username
  ├─ Enter NEW password
  ├─ Click "Sign in"
  └─ Successfully logged in

✓ Step 8: Verification
  ├─ Old password doesn't work
  ├─ New password works
  └─ Feature complete!
```

---

**Ready to deploy the Forgot Password feature!**

Follow the setup instructions in `NEXT_STEPS_SETUP.md`
