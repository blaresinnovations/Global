# 🚀 DO THIS RIGHT NOW - 4 Simple Steps

## ⏱️ Total Time: 15 minutes

---

## Step 1️⃣: Database Update (5 minutes)

### Open your database tool (phpMyAdmin, MySQL Workbench, etc.)

### Copy and paste THIS into a new SQL query:

```sql
ALTER TABLE admins ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS reset_token_expires DATETIME DEFAULT NULL;

ALTER TABLE lecturer_auth ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE lecturer_auth ADD COLUMN IF NOT EXISTS reset_token_expires DATETIME DEFAULT NULL;

ALTER TABLE students ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE students ADD COLUMN IF NOT EXISTS reset_token_expires DATETIME DEFAULT NULL;
```

### Execute it (click Run/Execute button)

### ✅ Verify: Look at your tables and see the 2 new columns


---

## Step 2️⃣: Update .env File (5 minutes)

### Open file: `backend/.env`

### Add these lines at the end:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

### ⚠️ IMPORTANT - Get Your Password:

**If using Gmail:**
1. Go to https://myaccount.google.com/apppasswords
2. Sign in if needed
3. Select **"Mail"** from first dropdown
4. Select **"Windows Computer"** from second dropdown
5. Click **Create**
6. Google shows a 16-character password
7. Copy it → Paste as `EMAIL_PASS` value
8. Done!

**If using Outlook:**
- Use your Outlook email as EMAIL_USER
- Use your Outlook password as EMAIL_PASS
- Change EMAIL_HOST to: `smtp-mail.outlook.com`

### ✅ Verify: Save file, no errors

---

## Step 3️⃣: Restart Backend (1 minute)

### Open terminal/command prompt in `backend` folder

### Stop any running backend (press Ctrl+C if running)

### Type:
```bash
npm run dev
```

### ✅ Verify: See "Server running on port 3000" or similar message

**Keep this terminal open!**

---

## Step 4️⃣: Test It (5 minutes)

### Open browser and go to: `http://localhost:5173/login`

### You should see login page with "Forgot password?" link

### Do this:
1. Click **"Forgot password?"** link
2. A modal dialog appears
3. Type your email address (use one from your database)
4. Click **"Send Reset Link"** button
5. Check your email inbox (wait 30 seconds, may be slow)
6. You should receive an email from "Global Gate"
7. Click the **"Reset Password"** link in the email
8. A form appears with password fields
9. Enter a new password (e.g., "newpass123")
10. Confirm it in the second field
11. Click **"Reset Password"**
12. You see "Password reset successfully!" message
13. You're redirected to login page
14. Try logging in with your NEW password
15. ✅ Should work!

---

## ✅ You're Done!

The feature is now live. Users can:
- Click "Forgot password?"
- Get an email with reset link
- Set a new password
- Login with new password

---

## 🐛 If Something Goes Wrong

### Email not arriving?
- Check spam folder
- Make sure EMAIL_USER and EMAIL_PASS are correct in .env
- Restart backend after editing .env
- For Gmail, must use App Password, not regular password

### "Invalid token" error on reset page?
- Token expires after 1 hour
- You must click link within 1 hour
- Try requesting a new reset link

### Backend won't start?
- Check for typos in .env file
- Verify file is saved
- Try: `npm install` then `npm run dev`

### Database columns not found?
- Make sure you ran the SQL against correct database
- In database tool, refresh and check the table again
- Restart backend after adding columns

### Test didn't work at all?
- Go back and check all 4 steps were done
- Verify email was actually sent to spam folder
- Check backend terminal for error messages
- Check browser console (F12) for errors

---

## 📚 Need More Details?

Read these files:
- `NEXT_STEPS_SETUP.md` - Detailed setup with troubleshooting
- `VISUAL_SETUP_GUIDE.md` - Diagrams and architecture
- `FORGOT_PASSWORD_QUICK_START.md` - Quick reference
- `PASSWORD_RESET_SETUP.md` - Complete documentation

---

## 🎯 Summary

| Step | Action | Time | Status |
|------|--------|------|--------|
| 1 | Run SQL migration | 5 min | [ ] |
| 2 | Update .env file | 5 min | [ ] |
| 3 | Restart backend | 1 min | [ ] |
| 4 | Test feature | 5 min | [ ] |
| | **TOTAL** | **15 min** | |

**Estimated completion: 15 minutes from now**

---

## 🎉 When You're Done

Celebrate! Your users can now:
✅ Reset forgotten passwords
✅ Receive email with reset link
✅ Change their password securely
✅ Login with new password

Questions? Check the documentation files or review error messages in terminal/browser console.

---

**Let's go! Start with Step 1 right now! 🚀**
