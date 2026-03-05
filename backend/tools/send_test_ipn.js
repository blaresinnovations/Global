/**
 * Simple test script to POST an IPN-like payload to the local backend /api/payments/ipn
 * Usage: node send_test_ipn.js <backend_url> <studentId> <courseId> [status]
 * Example: node send_test_ipn.js http://localhost:4000 12 3 paid
 */
const https = require('https');
const http = require('http');
const crypto = require('crypto');

const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Usage: node send_test_ipn.js <backend_url> <studentId> <courseId> [status]');
  process.exit(2);
}

const [backendUrl, studentId, courseId, status = 'paid'] = args;
const secret = process.env.PAYHERE_SECRET || '';

const payload = {
  student_id: String(studentId),
  course_id: String(courseId),
  status: status,
  payment_status: status,
  payment_plan: 'full'
};

const body = JSON.stringify(payload);
const sig = secret ? crypto.createHmac('sha256', secret).update(body).digest('hex') : '';

const url = new URL('/api/payments/ipn', backendUrl);
const opts = {
  hostname: url.hostname,
  port: url.port || (url.protocol === 'https:' ? 443 : 80),
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  }
};
if (sig) opts.headers['x-payhere-signature'] = sig;

const client = url.protocol === 'https:' ? https : http;
const req = client.request(opts, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});
req.on('error', (e) => console.error('Request error', e));
req.write(body);
req.end();
