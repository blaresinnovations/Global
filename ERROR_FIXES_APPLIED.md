# React Key Error & API 500 Error - Fixed

## Issues Fixed

### 1. ✅ React Key Duplicate Error
**Problem**: `Encountered two children with the same key, '27'`

**Fixed by**:
- Deduplicating courses array in frontend to remove duplicate course IDs
- Changed key from `key={c.id}` to `key={`course-${c.id}-${idx}`}` for guaranteed uniqueness
- Improved error logging for enrollments endpoint failures

**Files Modified**:
- `frontend/src/pages/AdminST/StudentPanel.jsx`

---

### 2. ✅ API 500 Error on `/api/students/:id/enrollments`
**Problem**: `Failed to load resource: the server responded with a status of 500`

**Root Cause**: The `student_courses` table was missing required columns:
- `payment_plan` - for storing payment plan type (full, monthly, 3-month)
- `order_id` - for storing PayHere order IDs

**Fixed by**:
- Created migration: `backend/sql/add_payment_columns.sql`
- Updated migration runner to detect and add missing columns
- Improved error handling with detailed error messages

**Files Modified**:
- `backend/routes/students.js` - Better error reporting
- `backend/tools/run_migrations.js` - Added payment columns handler
- **Created**: `backend/sql/add_payment_columns.sql`

---

## How to Deploy the Fix

### Option 1: Automatic (Recommended)
1. **Run migrations**:
```bash
cd backend
node tools/run_migrations.js
```

This will automatically:
- Detect missing columns in `student_courses` table
- Add `payment_plan` column
- Add `order_id` column
- Create index for faster lookups

### Option 2: Manual
Run this SQL directly on your database:

```sql
ALTER TABLE student_courses 
ADD COLUMN IF NOT EXISTS payment_plan VARCHAR(50) DEFAULT 'full' AFTER payment_status,
ADD COLUMN IF NOT EXISTS order_id VARCHAR(100) AFTER payment_plan;

ALTER TABLE student_courses 
ADD INDEX IF NOT EXISTS idx_order_id (order_id);
```

---

## Verification Steps

After applying the fix:

### 1. Verify Database
```bash
mysql -u root -p global_gate
```

```sql
DESCRIBE student_courses;
```

You should see:
- `payment_plan` column
- `order_id` column
- `idx_order_id` index

### 2. Restart Backend
```bash
cd backend
npm run dev
# or
node index.js
```

### 3. Test Frontend
1. Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
2. Refresh page (F5)
3. Go to "All Courses" section
4. Click "Buy" on a course
5. Errors should be resolved ✅

### 4. Check Console
- [ ] No React key warnings in console
- [ ] No 500 errors in Network tab
- [ ] Enrollments load successfully

---

## What Changed in the Code

### Frontend Changes (`StudentPanel.jsx`)

**Before**:
```jsx
return courses.filter(c => !approvedIds.includes(Number(c.id))).map(c => (
  <motion.div key={c.id}>
```

**After**:
```jsx
const filteredCourses = courses.filter(c => !approvedIds.includes(Number(c.id)));
return filteredCourses.map((c, idx) => (
  <motion.div key={`course-${c.id}-${idx}`}>
```

**Also**:
- Courses array is now deduplicated on fetch
- Better error logging for enrollments endpoint failures

### Backend Changes (`students.js`)

**Before**:
```javascript
const [rows] = await conn.execute(`
  SELECT sc.id, sc.course_id, sc.payment_status, sc.payment_method, 
         sc.bank_slip_path, sc.start_date, sc.end_date, 
         sc.payment_plan, sc.created_at,
         c.name as course_name, ...
```

**After**:
```javascript
const [rows] = await conn.execute(`
  SELECT sc.id, sc.course_id, sc.payment_status, sc.payment_method, 
         sc.bank_slip_path, sc.start_date, sc.end_date, 
         sc.payment_plan, sc.created_at, sc.order_id,
         c.name as course_name, c.is_free, c.early_bird_price, ...
```

- Added `order_id` to SELECT
- Added table existence check
- Improved error reporting with error.code and error.message
- Proper connection cleanup in catch block

---

## Troubleshooting

### Issue: Still getting 500 error after running migrations

**Check**:
1. Are migrations table columns added?
```sql
SHOW COLUMNS FROM student_courses;
```

2. Check backend error logs:
```bash
# Look for detailed error message
```

3. Verify database user has ALTER TABLE permissions:
```sql
GRANT ALL PRIVILEGES ON global_gate.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

### Issue: React key warning still shows

**Fix**:
1. Hard refresh browser (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)
2. Clear browser cache completely
3. Close and reopen dev tools
4. Refresh page

### Issue: Course list shows duplicate courses

**Check**:
1. Are there duplicate course IDs in your `courses` table?
```sql
SELECT id, COUNT(*) FROM courses GROUP BY id HAVING COUNT(*) > 1;
```

2. Remove duplicates:
```sql
DELETE FROM courses WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY id ORDER BY id) as rn 
    FROM courses
  ) t WHERE rn > 1
);
```

---

## Testing Checklist

After applying fixes:

- [ ] No React key warnings in console
- [ ] No 500 errors on `/api/students/:id/enrollments`
- [ ] Enrollments load successfully
- [ ] Course list displays without duplicates
- [ ] All Courses section loads
- [ ] My Courses section works
- [ ] Card payment modal opens
- [ ] Bank transfer method works
- [ ] Payment submission works

---

## Database Changes Summary

### New Table Columns

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| `payment_plan` | VARCHAR(50) | 'full' | Stores payment plan: full, monthly, or 3-month |
| `order_id` | VARCHAR(100) | NULL | Stores PayHere order ID for tracking |

### New Index

| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_order_id` | (order_id) | Faster lookups by order ID |

---

## Next Steps

1. **Apply migrations**: `node tools/run_migrations.js`
2. **Restart backend**: `npm run dev`
3. **Refresh frontend**: F5 or Ctrl+Shift+R
4. **Test payment flow**: Follow Testing Checklist

---

**Status**: ✅ All fixes applied and ready for testing
**Date**: February 24, 2026
