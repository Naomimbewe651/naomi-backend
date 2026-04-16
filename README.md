# Naomi Mbewe — Portfolio Contact Form Backend

Node.js + Express backend that saves contact form submissions to **MySQL (phpMyAdmin)**
and sends **Gmail email notifications** via Nodemailer.

---

## Folder Structure

```
naomi-backend/
├── server.js        ← Main Express server
├── database.sql     ← Run this in phpMyAdmin first
├── .env             ← Your secrets (never commit this!)
├── package.json     ← Dependencies
├── index.html       ← Your updated portfolio (copy to your web root)
└── README.md
```

---

## Step 1 — Set up the MySQL Database in phpMyAdmin

1. Open **phpMyAdmin** (usually at `http://localhost/phpmyadmin`)
2. Click the **SQL** tab at the top
3. Paste the entire contents of **`database.sql`** and click **Go**
4. You should see a new database called `naomi_portfolio` with a `contact_submissions` table

---

## Step 2 — Get a Gmail App Password

> You need this so Nodemailer can send emails on your behalf.  
> **Do NOT use your real Gmail password.**

1. Go to your Google Account → [myaccount.google.com](https://myaccount.google.com)
2. Click **Security** → enable **2-Step Verification** (if not already on)
3. Search for **"App Passwords"** in the search bar
4. Select **Mail** + **Other** → name it `Portfolio`
5. Copy the **16-character code** shown (e.g. `abcd efgh ijkl mnop`)

---

## Step 3 — Configure your `.env` file

Open `.env` and fill in your real values:

```env
PORT=3000

# MySQL — match your phpMyAdmin settings
DB_HOST=localhost
DB_PORT=3306
DB_NAME=naomi_portfolio
DB_USER=root
DB_PASSWORD=your_mysql_root_password

# Gmail
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop   ← paste the 16-char code here

# Where to send notifications (your email or phone's email-to-SMS gateway)
NOTIFY_EMAIL=naomimbewe651@email.com

# Your website domain (change * to https://yoursite.com in production)
ALLOWED_ORIGIN=*
```

### 📱 Get notifications on your phone
Set `NOTIFY_EMAIL` to your phone's email-to-SMS address:
| Network | Address |
|---------|---------|
| Airtel (ZM) | `your_number@airtel.com` |
| MTN (ZM) | `your_number@mtn.com` |
| Or just use your Gmail — Google has a mobile app |

---

## Step 4 — Install & Run

```bash
# Install dependencies
npm install

# Start the server
npm start

# For development (auto-restarts on file changes)
npm run dev
```

You should see:
```
🚀  Server running at http://localhost:3000
📋  Health check → http://localhost:3000/api/health
📬  Contact endpoint → POST http://localhost:3000/api/contact
```

---

## Step 5 — Test it

Visit `http://localhost:3000/api/health` in your browser.  
You should see: `{ "status": "ok", "db": "connected" }`

Then fill in your contact form and submit — check phpMyAdmin and your email!

---

## Step 6 — Deploy to Production

When hosting your site online:

1. Deploy the `naomi-backend/` folder to your server (e.g. VPS, Railway, Render)
2. Update `API_URL` in `index.html`:
   ```js
   const API_URL = 'https://your-server-domain.com/api/contact';
   ```
3. Update `ALLOWED_ORIGIN` in `.env`:
   ```env
   ALLOWED_ORIGIN=https://your-website.com
   ```

---

## View Submissions in phpMyAdmin

```sql
SELECT * FROM contact_submissions ORDER BY created_at DESC;
```

You can also mark messages as read or replied by updating the `status` column.

---

## API Reference

### `POST /api/contact`
**Body (JSON):**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "subject": "Project Enquiry",
  "message": "Hello Naomi, I'd love to work with you!"
}
```
**Success response:**
```json
{ "success": true, "message": "Message received! I'll be in touch soon.", "id": 1 }
```

### `GET /api/health`
Returns DB connection status.
