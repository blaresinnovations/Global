# Email Configuration Verification

## Why Email Not Sending?

The email will not send unless **both** of these are set in your `.env` file:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## ✅ How to Configure Gmail Email

### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/
2. Click "Security" in left menu
3. Scroll to "2-Step Verification"
4. Follow the steps to enable

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or your device)
3. Click "Generate"
4. You'll get a 16-character password (copy it)

### Step 3: Update .env File
Open `backend/.env` and add:

```env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
FRONTEND_URL=http://localhost:5173
```

✅ Keep the spaces in the password - that's how Gmail generates it

### Step 4: Restart Backend
```bash
cd backend
npm start
```

## 🧪 Test Email Sending

### In Backend Console
When you create a new admin:
- ✅ If email configured: You'll see `📧 Attempting to send...` then `✓ Email sent successfully`
- ❌ If email NOT configured: You'll see `⚠️ Email not configured` with TEST MODE credentials in console

### Check Console Output
```
📧 Attempting to send email to john@example.com...
✓ Email sent successfully to john@example.com
```

Or in TEST MODE:
```
⚠️ Email not configured. Skipping email send.
[TEST MODE] Credentials for John Doe:
  Username: john_abc123
  Password: SecurePass123
  Email: john@example.com
```

## 🐛 Common Email Issues

### Issue: "Email not configured" in logs
**Solution**: Add EMAIL_USER and EMAIL_PASS to `.env` file

### Issue: "Invalid login" error
**Solution**: 
- Use app-specific password (not main Gmail password)
- Get from: https://myaccount.google.com/apppasswords
- Ensure 2FA is enabled first

### Issue: "SMTP connection timeout"
**Solution**:
- Check internet connection
- Try different SMTP settings
- Check firewall/antivirus blocking port 587

### Issue: Email goes to spam
**Solution**:
- Check spam folder
- Mark as "Not spam"
- Simplify email HTML (less formatting)

## 📧 Email Template

When admin is created, email includes:
- Welcome message
- **Username**: Auto-generated (e.g., john_abc123)
- **Password**: What was entered in form
- **Login URL**: Link to admin login page
- Security reminder to change password

## Verify It's Working

1. ✅ .env has EMAIL_USER and EMAIL_PASS
2. ✅ Backend restarted (`npm start`)
3. ✅ Create new admin in Admin Panel
4. ✅ Check console for `✓ Email sent successfully`
5. ✅ Check email inbox for credentials

## If Still Not Working

1. **Check .env syntax**:
   ```bash
   cat .env | grep EMAIL
   ```

2. **Verify file saved**:
   - Close and reopen .env file
   - Ensure no extra quotes around values

3. **Test credentials manually**:
   ```bash
   telnet smtp.gmail.com 587
   ```

4. **Check Gmail settings**:
   - https://myaccount.google.com/security - see if app was granted access
   - Remove and regenerate app password

5. **Restart everything**:
   ```bash
   # Stop backend (Ctrl+C)
   # Stop frontend (Ctrl+C)
   cd backend
   npm start
   # In another terminal
   cd frontend
   npm run dev
   ```

## Support Emails

For debugging, all admin credentials are logged to console when admin is created:
- If configured: Email sent + logged
- If not configured: Full credentials printed to console

---

**Quick Check Command**:
```bash
grep EMAIL_ backend/.env
```

Should output:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

If empty or showing error, .env is not configured.
