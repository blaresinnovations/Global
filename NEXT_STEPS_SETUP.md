# Next Steps - Forgot Password Implementation

## ⚡ IMMEDIATE ACTIONS REQUIRED

### 1️⃣ Run Database Migration (5 minutes)
Execute this SQL in your database management tool (phpMyAdmin, MySQL Workbench, etc.):

```sql
ALTER TABLE admins ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS reset_token_expires DATETIME DEFAULT NULL;

ALTER TABLE lecturer_auth ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE lecturer_auth ADD COLUMN IF NOT EXISTS reset_token_expires DATETIME DEFAULT NULL;

ALTER TABLE students ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE students ADD COLUMN IF NOT EXISTS reset_token_expires DATETIME DEFAULT NULL;
```

**Verify in Database:**
- Open each table in your database tool
- Look for the new columns: `reset_token` and `reset_token_expires`
- Both should be present in all three tables

### 2️⃣ Update .env File (5 minutes)
Edit `backend/.env` and add these lines:

```env
# Email Configuration - REQUIRED for Forgot Password Feature
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL - Used in password reset email links
FRONTEND_URL=http://localhost:5173
```

#### ✉️ If Using Gmail:
1. Go to https://myaccount.google.com/apppasswords
2. Sign in to your Gmail account
3. If 2FA is not enabled, enable it first
4. Select "Mail" in the dropdown
5. Select "Windows Computer" 
6. Google will generate a 16-character password
7. Copy that password and paste as `EMAIL_PASS` value
8. Save your .env file

#### 📧 If Using Other Email Providers:
Replace EMAIL_HOST and EMAIL_PASS accordingly. Examples:
- **Outlook:** smtp-mail.outlook.com, use your Outlook password
- **SendGrid:** smtp.sendgrid.net, use your API key
- **Mailtrap:** smtp.mailtrap.io, use Mailtrap credentials

### 3️⃣ Restart Backend (1 minute)
In your terminal:
```bash
cd backend
npm run dev
```

You should see messages about the server starting. Don't stop this terminal.

### 4️⃣ Test It! (5 minutes)

1. Open http://localhost:5173/login
2. Click "Forgot password?" link
3. Enter an email from your database (e.g., admin email)
4. Click "Send Reset Link"
5. Check your email for reset link (check spam folder too!)
6. Click link in email - you should go to reset password page
7. Enter new password and confirm
8. Click "Reset Password"
9. You should see success message and redirect to login
10. Try logging in with new password

---

## 📋 Checklist Before Testing

- [ ] Database migration SQL executed successfully
- [ ] `reset_token` column exists in admins table
- [ ] `reset_token_expires` column exists in admins table
- [ ] `reset_token` column exists in lecturer_auth table
- [ ] `reset_token_expires` column exists in lecturer_auth table
- [ ] `reset_token` column exists in students table
- [ ] `reset_token_expires` column exists in students table
- [ ] EMAIL_HOST added to .env
- [ ] EMAIL_PORT added to .env
- [ ] EMAIL_USER added to .env
- [ ] EMAIL_PASS added to .env
- [ ] FRONTEND_URL added to .env
- [ ] Backend restarted with `npm run dev`
- [ ] No errors in backend console

---

## 🚀 Quick Test Steps

### Test 1: Forgot Password Modal
```
1. Go to http://localhost:5173/login
2. Look for "Forgot password?" link at bottom
3. Click it
4. Modal should appear with email input
5. Type email and click "Send Reset Link"
```

### Test 2: Email Receiving
```
1. Check your email inbox
2. Look for email from "Global Gate"
3. Subject: "Global Gate - Password Reset Request"
4. Contains a reset link button
5. Link should look like: https://localhost:5173/reset-password?token=xxxxx
```

### Test 3: Reset Password Page
```
1. Click link from email
2. You should see password reset form
3. Enter new password
4. Confirm password
5. Click "Reset Password" button
```

### Test 4: Login with New Password
```
1. After reset, you're redirected to login
2. Enter your email/username
3. Enter the NEW password you just set
4. Click "Sign in"
5. Should login successfully
```

---

## 🐛 Troubleshooting

### Email Not Received?
- Check spam/junk folder
- Verify EMAIL_USER is correct in .env
- For Gmail: Verify you used App Password, not regular password
- Check backend console for email errors
- Restart backend after .env changes

### "Invalid or expired reset token" Error
- Tokens expire after 1 hour
- Must click link within 1 hour of request
- Each email gives a unique token
- Token is cleared after successful reset

### Database Columns Not Found?
- Run SQL migration again
- Verify you executed against correct database
- Check in your database tool if columns exist
- Restart backend after database changes

### Backend Won't Start?
- Check for syntax errors in .env
- Verify nodemailer is installed: `npm list nodemailer`
- Check node version: `node --version` (should be 14+)
- Try: `npm install` to reinstall dependencies

### Passwords Don't Match Error
- Ensure both password fields are identical
- Check for spaces at beginning/end
- Password must be at least 6 characters
- Try a simple password like "test123"

---

## 📚 Documentation Files

For more detailed information, see:
- `PASSWORD_RESET_SETUP.md` - Complete setup guide
- `FORGOT_PASSWORD_QUICK_START.md` - Quick reference
- `FORGOT_PASSWORD_IMPLEMENTATION.md` - Technical details

---

## ⚠️ Important Notes

1. **Never commit .env to Git** - Keep credentials secure
2. **Use HTTPS in Production** - Passwords transmitted securely
3. **Token Expiration is 1 Hour** - Users must click link quickly
4. **Test with Real Email** - Localhost email won't send, use real account
5. **Verify Email Credentials** - Double-check EMAIL_USER and EMAIL_PASS

---

## 🎉 You're Done!

Once all 4 steps above are complete and tests pass, the forgot password feature is live!

**Users can now:**
- ✅ Click "Forgot password?" on login
- ✅ Enter email address
- ✅ Receive password reset link via email
- ✅ Click link and reset password
- ✅ Login with new password

Need help? Check the documentation files or review the error messages in browser console and backend terminal.
