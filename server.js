// ============================================================
//  Naomi Mbewe Portfolio — Contact Form Backend
//  Stack: Express · MySQL2 · Nodemailer (Gmail)
// ============================================================
require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const mysql      = require('mysql2/promise');
const nodemailer = require('nodemailer');

const app  = express();
app.use(express.static(__dirname));
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// ─── MySQL Connection Pool ────────────────────────────────────
const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               process.env.DB_PORT     || 3306,
  database:           process.env.DB_NAME     || 'naomi_portfolio',
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           '+00:00',
});

// ─── Nodemailer Transporter (Gmail) ───────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,,   // 16-char App Password
  },
});

// ─── Helper: send notification email ─────────────────────────
async function sendNotificationEmail({ firstName, lastName, email, subject, message }) {
  const fullName    = [firstName, lastName].filter(Boolean).join(' ');
  const displaySub  = subject || '(no subject)';
  const receivedAt  = new Date().toLocaleString('en-ZM', {
    timeZone: 'Africa/Lusaka',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#08090a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#08090a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#0e0f11;border:1px solid rgba(201,168,76,0.25);border-radius:12px;overflow:hidden;max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#141518 0%,#1a1b1e 100%);padding:32px 40px;border-bottom:1px solid rgba(201,168,76,0.2);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:600;color:#f5f0e8;letter-spacing:0.02em;">
                      NM<span style="color:#c9a84c;">.</span>
                    </p>
                    <p style="margin:4px 0 0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6b6760;">
                      Portfolio Contact Notification
                    </p>
                  </td>
                  <td align="right">
                    <span style="background:rgba(201,168,76,0.12);color:#c9a84c;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;padding:6px 14px;border-radius:20px;border:1px solid rgba(201,168,76,0.25);">
                      New Message
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 24px;font-size:15px;color:#d4cfc6;line-height:1.6;">
                You received a new message from your portfolio contact form.
              </p>

              <!-- Sender info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#141518;border:1px solid rgba(255,255,255,0.07);border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                          <span style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#6b6760;">From</span><br>
                          <span style="font-size:15px;color:#f5f0e8;font-weight:500;">${fullName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                          <span style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#6b6760;">Email</span><br>
                          <a href="mailto:${email}" style="font-size:15px;color:#c9a84c;text-decoration:none;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#6b6760;">Subject</span><br>
                          <span style="font-size:15px;color:#f5f0e8;">${displaySub}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#6b6760;">Message</p>
              <div style="background:#141518;border:1px solid rgba(255,255,255,0.07);border-left:3px solid #c9a84c;border-radius:0 8px 8px 0;padding:20px 24px;margin-bottom:28px;">
                <p style="margin:0;font-size:15px;color:#d4cfc6;line-height:1.75;white-space:pre-wrap;">${message}</p>
              </div>

              <!-- Reply CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:4px;overflow:hidden;">
                    <a href="mailto:${email}?subject=Re: ${displaySub}" style="display:inline-block;padding:13px 28px;background:#c9a84c;color:#000;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;text-decoration:none;border-radius:4px;">
                      Reply to ${firstName} →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.07);">
              <p style="margin:0;font-size:12px;color:#6b6760;line-height:1.6;">
                Received: ${receivedAt} (CAT)<br>
                This notification was sent automatically from naomimbewe.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from:    `"Naomi Portfolio" <${process.env.GMAIL_USER}>`,
    to:      process.env.NOTIFY_EMAIL,
    replyTo: email,
    subject: `📬 New Contact: ${displaySub} — from ${fullName}`,
    html,
    text: `New message from ${fullName} (${email})\n\nSubject: ${displaySub}\n\n${message}\n\nReceived: ${receivedAt}`,
  });
}

// ─── Input sanitisation helper ────────────────────────────────
function sanitize(str = '', maxLen = 500) {
  return String(str).trim().slice(0, maxLen);
}

// ─── Route: POST /api/contact ─────────────────────────────────
app.post('/api/contact', async (req, res) => {
  try {
    const firstName = sanitize(req.body.firstName || req.body.fname, 100);
    const lastName  = sanitize(req.body.lastName  || req.body.lname, 100);
    const email     = sanitize(req.body.email,   255);
    const subject   = sanitize(req.body.subject,  255);
    const message   = sanitize(req.body.message, 5000);
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || null;

    // ── Validation ──────────────────────────────────────────
    const errors = [];
    if (!firstName)                         errors.push('First name is required.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email is required.');
    if (!message)                           errors.push('Message is required.');

    if (errors.length) {
      return res.status(400).json({ success: false, errors });
    }

    // ── Save to MySQL ────────────────────────────────────────
    const [result] = await pool.execute(
      `INSERT INTO contact_submissions
         (first_name, last_name, email, subject, message, ip_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, subject, message, ipAddress]
    );

    console.log(`✅  Saved submission #${result.insertId} from ${email}`);

    // ── Send email notification ──────────────────────────────
    await sendNotificationEmail({ firstName, lastName, email, subject, message });
    console.log(`📧  Email notification sent to ${process.env.NOTIFY_EMAIL}`);

    return res.status(200).json({
      success: true,
      message: "Message received! I'll be in touch soon.",
      id: result.insertId,
    });

  } catch (err) {
    console.error('❌  Contact form error:', err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
});

// ─── Route: GET /api/health ───────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', time: new Date().toISOString() });
  } catch {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

// ─── 404 fallback ─────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// ─── Start ────────────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🚀  Server running at http://localhost:${PORT}`);
  console.log(`📋  Health check → http://localhost:${PORT}/api/health`);
  console.log(`📬  Contact endpoint → POST http://localhost:${PORT}/api/contact\n`);
});
