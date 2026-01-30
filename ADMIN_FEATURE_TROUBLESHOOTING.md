# Admin Creation Feature - Troubleshooting Guide

## Common Issues & Solutions

### 🔴 Issue: "Email already in use" Error

**Problem**: Getting error when trying to create admin with a new email

**Causes**:
1. Email already exists in database
2. Email was used in a previous test

**Solutions**:
1. Use a different email address
2. Check existing admins: 
   ```sql
   SELECT email FROM admins WHERE email = 'your-email@example.com';
   ```
3. Delete old test admin:
   ```sql
   DELETE FROM admins WHERE email = 'old-test@example.com';
   ```
4. Or use email alias (Gmail: email+tag@gmail.com)

---

### 🔴 Issue: Migration Script Fails

**Problem**: `node tools/migrate_admins.js` shows error

**Causes**:
1. Database connection not working
2. Wrong .env credentials
3. Database doesn't exist
4. MySQL not running

**Solutions**:
1. Verify .env settings:
   ```
   DB_HOST=localhost (or your host)
   DB_USER=root (or your username)
   DB_PASS= (or your password)
   DB_NAME=global_gate
   ```

2. Test database connection manually:
   ```bash
   mysql -h localhost -u root -p global_gate -e "SELECT 1;"
   ```

3. Ensure MySQL is running:
   ```bash
   # Linux/Mac
   mysql.server status
   
   # Windows
   mysql -u root -p
   ```

4. Create database if missing:
   ```sql
   CREATE DATABASE IF NOT EXISTS global_gate;
   ```

5. Run migration again:
   ```bash
   cd backend
   node tools/migrate_admins.js
   ```

---

### 🔴 Issue: Email Not Sending

**Problem**: Admin created but no email received

**Causes**:
1. EMAIL_USER not set in .env
2. EMAIL_PASS incorrect
3. Gmail security settings blocking
4. SMTP connection timeout
5. Email address invalid

**Solutions**:

1. **Check .env Configuration**:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password-16-chars
   ```
   ✅ Remove spaces in password
   ✅ Use app-specific password (not main password)
   ✅ Restart backend after editing

2. **Gmail Configuration**:
   - Enable 2-Factor Authentication
   - Create App Password: https://myaccount.google.com/apppasswords
   - Copy 16-character password (remove spaces)
   - Paste into EMAIL_PASS

3. **Check Server Logs**:
   ```bash
   tail -f backend.log
   # Look for "Email send error" messages
   ```

4. **Test Email Function**:
   - Create test file `test-email.js`:
   ```javascript
   const nodemailer = require('nodemailer');
   
   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASS
     }
   });
   
   transporter.sendMail({
     from: process.env.EMAIL_USER,
     to: 'test@example.com',
     subject: 'Test Email',
     text: 'This is a test email'
   }).then(() => console.log('✓ Email sent'))
     .catch(err => console.error('✗ Error:', err.message));
   ```
   - Run: `node test-email.js`

5. **Use Test Email Service**:
   ```javascript
   // In your test file
   const testAccount = await nodemailer.createTestAccount();
   // Credentials will be shown in console
   // Check email preview URL provided
   ```

---

### 🔴 Issue: "Missing required fields" Error

**Problem**: Form shows error even though all fields filled

**Causes**:
1. Fields have leading/trailing whitespace
2. Fields contain invalid characters
3. Email format invalid
4. Password too short

**Solutions**:
1. Clear form completely (don't copy-paste)
2. Re-enter data carefully
3. Use valid email format: `name@domain.com`
4. Password should be at least 8 characters
5. Check browser console for specific validation errors

**Browser Console Check**:
```javascript
// Open DevTools (F12)
// Go to Console tab
// Try creating admin again
// Look for validation messages
```

---

### 🔴 Issue: Admin Created But Not in List

**Problem**: Form says success, but admin not showing in "All Admins" tab

**Causes**:
1. Page not refreshed
2. Authentication expired
3. Admin in database but list not fetching
4. Filters applied

**Solutions**:
1. Refresh page (F5 or Cmd+R)
2. Log out and log back in
3. Clear filters in the list
4. Check database directly:
   ```sql
   SELECT * FROM admins ORDER BY id DESC LIMIT 5;
   ```
5. Check browser console for fetch errors (F12 → Console)

---

### 🔴 Issue: Cannot Edit Admin

**Problem**: Edit button clicked but form doesn't load admin data

**Causes**:
1. Authentication issue
2. Admin ID not passing correctly
3. API error

**Solutions**:
1. Log out and log back in
2. Check browser console for errors (F12)
3. Verify API is running (backend server running)
4. Check network tab for failed requests
5. Try with different admin

**Network Debug**:
```
1. Open DevTools (F12)
2. Go to Network tab
3. Click Edit button
4. Look for API call to /api/admins/:id
5. Check Status code (should be 200)
6. Check Response tab for data
```

---

### 🔴 Issue: "Database error" on Submit

**Problem**: Form shows "Database error" after submission

**Causes**:
1. Database connection lost
2. Invalid data format
3. Username already exists
4. Role value not valid

**Solutions**:
1. Check database is running:
   ```bash
   mysql -u root -p global_gate
   ```

2. Verify admins table structure:
   ```sql
   DESCRIBE admins;
   ```
   Should show columns: id, name, email, username, password_hash, role, is_active, created_at

3. Check role value is valid:
   ```sql
   SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_NAME='admins' AND COLUMN_NAME='role';
   ```
   Should show: `enum('Super Admin','Admin','Staff')`

4. Check server logs:
   ```bash
   # In backend directory
   tail -f backend.log
   # Or start server with: npm start 2>&1 | tee backend.log
   ```

---

### 🔴 Issue: Backend Server Won't Start

**Problem**: `npm start` shows error

**Causes**:
1. Port 5000 already in use
2. Missing dependencies
3. Node version issue
4. Environment variable error

**Solutions**:
1. Kill process on port 5000:
   ```bash
   # Linux/Mac
   lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
   
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

2. Check dependencies installed:
   ```bash
   cd backend
   npm install
   ```

3. Check Node version:
   ```bash
   node -v  # Should be v14 or higher
   ```

4. Verify .env file exists:
   ```bash
   ls -la .env  # or check backend folder
   ```

5. Try starting with debug:
   ```bash
   DEBUG=* npm start
   ```

---

### 🔴 Issue: 500 Error When Visiting Admin Page

**Problem**: "500 Internal Server Error" on /admin page

**Causes**:
1. AddAdmin component import error
2. Dashboard component missing
3. JavaScript syntax error
4. Backend API error

**Solutions**:
1. Check browser console (F12 → Console)
2. Check network tab for specific error
3. Check server logs for backend errors
4. Verify imports in AdminPanel.jsx are correct
5. Restart backend server

**Browser Console Check**:
```
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Note the error and search in code
```

---

### 🔴 Issue: Email Received But Credentials Incorrect

**Problem**: Email sent but wrong username or password

**Causes**:
1. Username generation failed
2. Password not matching what was entered
3. Email template issue

**Solutions**:
1. Check database for actual stored values:
   ```sql
   SELECT id, email, username FROM admins 
   WHERE email = 'your-email@example.com';
   ```

2. Verify password hash created:
   ```sql
   SELECT password_hash FROM admins 
   WHERE email = 'your-email@example.com';
   ```
   Should be long hash (60+ characters)

3. Check email template in admins.js
   ```javascript
   // Should show: ${username} and ${password}
   // Not: ${generated_username} or placeholders
   ```

4. If username missing, manually set it:
   ```sql
   UPDATE admins SET username = 'email_abc123' 
   WHERE email = 'your-email@example.com';
   ```

---

### 🟡 Issue: Email Marked as Spam

**Problem**: Email goes to spam folder

**Causes**:
1. Gmail authentication issues
2. Email template HTML issues
3. SPF/DKIM not configured

**Solutions**:
1. Check spam folder first
2. Mark as "Not Spam"
3. Verify sender address matches EMAIL_USER
4. Simplify email template (less HTML)
5. Use plain text option:
   ```javascript
   mailOptions = {
     to: email,
     subject: '...',
     text: 'Username: ' + username + '\nPassword: ' + password,
     // Remove html property for testing
   };
   ```

---

## 🔍 Diagnostic Commands

### Check Database Connection
```bash
mysql -h localhost -u root -p global_gate -e "SELECT 1;"
```

### View Admins Table
```sql
SELECT id, name, email, username, role, is_active FROM admins;
```

### Check Columns in Admins Table
```sql
DESCRIBE admins;
```

### View Recent Admins
```sql
SELECT * FROM admins ORDER BY created_at DESC LIMIT 10;
```

### Test Node/npm
```bash
node -v
npm -v
npm list nodemailer
```

### Check .env File
```bash
cat .env  # or: type .env (Windows)
# Should have: EMAIL_USER, EMAIL_PASS, DB_HOST, etc.
```

### View Backend Logs
```bash
tail -f backend.log
# Or start with logging: npm start 2>&1 | tee backend.log
```

### Test API Endpoint
```bash
curl http://localhost:5000/api/admins \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📞 Getting More Help

1. **Check Logs First**:
   - Browser console (F12)
   - Backend console output
   - Server log files

2. **Verify Configuration**:
   - .env variables set correctly
   - Database running and accessible
   - Backend server running
   - Port 5000 available

3. **Test Components**:
   - Database: `mysql -u root -p`
   - Email: test email service
   - API: curl or Postman
   - Frontend: browser DevTools

4. **Reset for Fresh Start**:
   ```bash
   # Delete test admins
   mysql -u root global_gate -e "DELETE FROM admins WHERE id > 1;"
   
   # Restart backend
   npm start
   
   # Clear browser cache (Ctrl+Shift+Del)
   ```

---

**Troubleshooting Guide Version**: 1.0
**Last Updated**: January 23, 2026
