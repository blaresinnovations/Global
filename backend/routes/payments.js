const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const crypto = require('crypto');
require('dotenv').config();

// Helper functions
const generateOrderId = () => `GG-${Date.now()}-${Math.floor(Math.random()*10000)}`;

const getMerchantIdAndSecret = () => {
  return {
    merchantId: process.env.PAYHERE_MERCHANT_ID || process.env.PAYHERE_MERCHANT || '',
    secret: process.env.PAYHERE_SECRET || ''
  };
};

const createPayHereChecksum = (orderId, amount, currency, merchantId, secret) => {
  let amountFormatted = parseFloat(amount).toFixed(2);
  const hashString = `${merchantId}.${orderId}.${amountFormatted}.${currency}`;
  return crypto.createHmac('md5', secret).update(hashString).digest('hex');
};

// POST /api/payments/create
// Creates a PayHere payment session (scaffold). Returns { redirect_url }
router.post('/create', async (req, res) => {
  try {
    const { studentId, courseId, amount, payment_plan, return_url } = req.body;
    const { merchantId } = getMerchantIdAndSecret();
    const host = process.env.PAYHERE_HOST || 'https://sandbox.payhere.lk/pay';
    const orderId = generateOrderId();

    // Build a minimal redirect URL the frontend can use to open the PayHere checkout.
    // Real integration should use PayHere fields and signing as per their docs.
    const qs = new URLSearchParams({
      merchant_id: merchantId,
      order_id: orderId,
      amount: String(amount || 0),
      return_url: return_url || '',
      student_id: String(studentId || ''),
      course_id: String(courseId || ''),
      payment_plan: payment_plan || 'full'
    });

    const redirect_url = `${host}?${qs.toString()}`;
    return res.json({ redirect_url, order_id: orderId });
  } catch (err) {
    console.error('payments.create error', err);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
});

// POST /api/payments/create-card
// Creates a card payment session through PayHere with card data validation
router.post('/create-card', express.json(), async (req, res) => {
  try {
    const {
      studentId,
      courseId,
      amount,
      payment_plan,
      card,
      return_url
    } = req.body;

    // Validate required fields
    if (!studentId || !courseId || !amount || !card) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { merchantId, secret } = getMerchantIdAndSecret();
    if (!merchantId) {
      return res.status(500).json({ error: 'Payment gateway not configured' });
    }

    // Validate card details
    if (!card.number || !card.name || !card.expiry || !card.cvv || !card.email) {
      return res.status(400).json({ error: 'Invalid card details' });
    }

    // Basic card validation (similar to frontend)
    const cardNumber = card.number.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cardNumber)) {
      return res.status(400).json({ error: 'Invalid card number format' });
    }

    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
      return res.status(400).json({ error: 'Invalid expiry date format' });
    }

    if (!/^\d{3,4}$/.test(card.cvv)) {
      return res.status(400).json({ error: 'Invalid CVV format' });
    }

    const orderId = generateOrderId();
    const currency = 'LKR';

    // Create PayHere hosted checkout URL with card details
    // PayHere will handle the card processing in their hosted environment
    const checksum = createPayHereChecksum(orderId, amount, currency, merchantId, secret);
    
    const payHereCheckoutUrl = new URL('https://sandbox.payhere.lk/pay/checkout');
    payHereCheckoutUrl.searchParams.append('merchant_id', merchantId);
    payHereCheckoutUrl.searchParams.append('order_id', orderId);
    payHereCheckoutUrl.searchParams.append('items', `Course Payment - ${courseId}`);
    payHereCheckoutUrl.searchParams.append('amount', String(amount));
    payHereCheckoutUrl.searchParams.append('currency', currency);
    payHereCheckoutUrl.searchParams.append('return_url', return_url || `${process.env.BACKEND_URL || 'http://localhost:5000'}/`);
    payHereCheckoutUrl.searchParams.append('cancel_url', return_url || `${process.env.BACKEND_URL || 'http://localhost:5000'}/`);
    payHereCheckoutUrl.searchParams.append('notify_url', `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/ipn`);
    payHereCheckoutUrl.searchParams.append('first_name', card.name.split(' ')[0] || 'Student');
    payHereCheckoutUrl.searchParams.append('last_name', card.name.split(' ').slice(1).join(' ') || '');
    payHereCheckoutUrl.searchParams.append('email', card.email);
    payHereCheckoutUrl.searchParams.append('phone', '');
    payHereCheckoutUrl.searchParams.append('address', '');
    payHereCheckoutUrl.searchParams.append('city', '');
    payHereCheckoutUrl.searchParams.append('country', 'LK');
    payHereCheckoutUrl.searchParams.append('custom_1', JSON.stringify({ student_id: studentId, course_id: courseId, payment_plan }));
    payHereCheckoutUrl.searchParams.append('hash', checksum);

    // Store pending enrollment in database
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });

    try {
      // Check if already enrolled
      const [existing] = await conn.execute(
        'SELECT id FROM student_courses WHERE student_id = ? AND course_id = ? LIMIT 1',
        [studentId, courseId]
      );

      if (existing && existing[0]) {
        await conn.end();
        return res.status(400).json({ error: 'Already enrolled in this course' });
      }

      // Insert pending enrollment
      await conn.execute(
        `INSERT INTO student_courses (student_id, course_id, payment_status, payment_method, payment_plan, order_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [studentId, courseId, 'pending', 'card', payment_plan || 'full', orderId]
      );

      await conn.end();
      
      return res.json({
        status: 'pending',
        redirect_url: payHereCheckoutUrl.toString(),
        order_id: orderId,
        message: 'Redirecting to payment gateway'
      });
    } catch (dbErr) {
      await conn.end();
      console.error('Database error in create-card:', dbErr);
      return res.status(500).json({ error: 'Failed to process payment' });
    }
  } catch (err) {
    console.error('payments.create-card error', err);
    res.status(500).json({ error: 'Failed to create card payment session' });
  }
});

// POST /api/payments/ipn
// PayHere (or other gateway) can POST payment notifications here. We verify with HMAC if configured.
router.post('/ipn', express.json(), async (req, res) => {
  try {
    const body = req.body || {};
    const sig = (req.headers['x-payhere-signature'] || req.headers['x-signature'] || '').toString();
    const secret = process.env.PAYHERE_SECRET || '';

    if (secret && sig) {
      const computed = crypto.createHmac('sha256', secret).update(JSON.stringify(body)).digest('hex');
      if (computed !== sig) {
        console.warn('IPN signature mismatch');
        return res.status(400).send('invalid signature');
      }
    }

    // Expect body to contain student_id, course_id, status/payment_status
    const studentId = body.student_id || body.studentId || body.student || null;
    const courseId = body.course_id || body.courseId || body.course || null;
    const status = (body.status || body.payment_status || body.paymentStatus || '').toString().toLowerCase();

    if (!studentId || !courseId) {
      console.warn('IPN missing student/course');
      return res.status(400).send('missing data');
    }

    if (status !== 'paid' && status !== 'completed' && status !== 'success') {
      // ignore non-paid notifications
      return res.status(200).send('ignored');
    }

    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });

    // Update the matching pending student_course to approved and set payment_method=card
    try {
      const [rows] = await conn.execute('SELECT * FROM student_courses WHERE student_id = ? AND course_id = ? ORDER BY id DESC LIMIT 1', [studentId, courseId]);
      const sc = Array.isArray(rows) && rows[0] ? rows[0] : null;
      if (!sc) {
        await conn.end();
        return res.status(404).send('enrollment not found');
      }

      // compute start_date/end_date based on course and payment_plan (if stored in sc or body)
      const plan = sc.payment_plan || body.payment_plan || body.paymentPlan || 'full';
      const [crows] = await conn.execute('SELECT * FROM courses WHERE id = ?', [courseId]);
      const course = Array.isArray(crows) && crows[0] ? crows[0] : null;

      const parseMonths = (dur) => {
        try {
          const m = String(dur || '').trim().match(/(\d+)/);
          return m ? parseInt(m[1], 10) : 0;
        } catch (e) { return 0; }
      };

      const addMonths = (d, m) => {
        const dt = new Date(d);
        dt.setMonth(dt.getMonth() + m);
        return dt.toISOString().slice(0,10);
      };

      const courseMonths = parseMonths(course ? course.duration : null) || 0;
      const start = course && course.start_date ? new Date(course.start_date) : new Date();
      let start_date = start.toISOString().slice(0,10);
      let end_date = null;

      if (plan === 'monthly' || plan === 'month') {
        end_date = addMonths(start, 1);
      } else if (plan === '3-month' || plan === '3-months') {
        end_date = addMonths(start, 3);
      } else {
        if (course && course.end_date) end_date = new Date(course.end_date).toISOString().slice(0,10);
        else if (courseMonths > 0) end_date = addMonths(start, courseMonths);
        else end_date = addMonths(start, 1);
      }

      await conn.execute('UPDATE student_courses SET payment_status = ?, payment_method = ?, start_date = ?, end_date = ? WHERE id = ?', ['approved', 'card', start_date, end_date, sc.id]);

      // recompute enrollment ranges for student
      const [r] = await conn.execute(
        `SELECT MIN(start_date) as mn, MAX(end_date) as mx FROM student_courses
         WHERE student_id = ? AND payment_status = 'approved' AND start_date IS NOT NULL AND end_date IS NOT NULL AND end_date >= CURDATE()`
        , [studentId]
      );
      const mn = r && r[0] ? r[0].mn : null;
      const mx = r && r[0] ? r[0].mx : null;
      if (mn && mx) {
        const [tbls2] = await conn.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'student_enrollment_ranges'", [process.env.DB_NAME]);
        if (Array.isArray(tbls2) && tbls2.length) {
          const [exist] = await conn.execute('SELECT id FROM student_enrollment_ranges WHERE student_id = ?', [studentId]);
          if (exist && exist[0]) {
            await conn.execute('UPDATE student_enrollment_ranges SET start_date = ?, end_date = ? WHERE student_id = ?', [mn, mx, studentId]);
          } else {
            await conn.execute('INSERT INTO student_enrollment_ranges (student_id, start_date, end_date) VALUES (?, ?, ?)', [studentId, mn, mx]);
          }
        }
      }

      await conn.end();
      return res.status(200).send('ok');
    } catch (uerr) {
      console.error('IPN processing error', uerr);
      await conn.end();
      return res.status(500).send('error');
    }
  } catch (err) {
    console.error('payments.ipn error', err);
    return res.status(500).send('error');
  }
});

module.exports = router;
