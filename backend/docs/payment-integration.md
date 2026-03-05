# Payment integration & local E2E test

This document explains how to run DB migrations, start services, and test the PayHere integration locally, including simulating IPN callbacks.

Prereqs
- Node.js installed
- MySQL accessible and configured via `.env` (see backend/.env.example or existing env)

Environment variables (minimum)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`
- `PAYHERE_MERCHANT_ID` (optional sandbox id)
- `PAYHERE_SECRET` (HMAC secret used to verify IPN)
- `PAYHERE_HOST` (optional, defaults to sandbox URL)
- SMTP envs: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` (for email reminders)

Run migrations
1. From project root run:

```bash
cd backend
node tools/run_migrations.js
```

Start backend and frontend

Backend:
```bash
cd backend
npm install
node index.js
```

Frontend (Vite):
```bash
cd frontend
npm install
npm run dev
```

Testing card flow and IPN locally
1. In the student UI choose a course and select `Card`.
2. Frontend will call `POST /api/payments/create` and redirect to the `redirect_url`. For now that redirect_url is a scaffold pointing to `PAYHERE_HOST` with query params.
3. To simulate a successful payment, use the IPN test script to POST to your backend's IPN endpoint. Example:

```bash
# if backend running at http://localhost:4000
cd backend
PAYHERE_SECRET=yoursecret node tools/send_test_ipn.js http://localhost:4000 12 3 paid
```

This will POST a payload to `/api/payments/ipn` and include an HMAC signature if `PAYHERE_SECRET` is set in the environment.

Webhook exposure (ngrok)
- If you need PayHere to reach your local machine, run ngrok and forward the path `/api/payments/ipn`.

Example ngrok commands:

```bash
# install ngrok and run
ngrok http 4000

# ngrok will give you a public https URL, e.g. https://abcd-1234.ngrok.io
# configure PayHere return/ipn URL to: https://abcd-1234.ngrok.io/api/payments/ipn
```

Notes & next steps
- For production you should implement PayHere's official checkout/signing or server-side API (this repo currently provides a scaffold).
- Do not store raw card data — use tokenization or hosted checkout.
- Once you provide PayHere test credentials (merchant id + secret) I can implement the field signing and session creation to complete the integration.
