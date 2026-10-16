# Keerthana Tours and Travels – Backend

REST API for the admin dashboard of the Keerthana Tours and Travels website.
Built with **Node.js, Express 5, MongoDB (Mongoose), JWT in an HTTP-only cookie, and bcrypt**, using ES Modules throughout.

The backend has two jobs for now:

1. Authenticate the single admin.
2. Let the admin view, mark read/unread, and delete leads.

There is no customer login, no package management, and **no lead-creation endpoint** – leads will be created later by the payment integration, only after a payment has been verified.

## Project structure

```
src/
  app.js                    Express app: CORS, cookies, routes, error handling
  server.js                 Connects to MongoDB and starts the server
  config/env.js             Loads and validates environment variables
  config/db.js              MongoDB connection
  models/Admin.js           Admin model
  models/Lead.js            Lead model
  middleware/auth.js        requireAdmin: verifies the JWT cookie
  middleware/validateObjectId.js
  middleware/errorHandler.js  404 handler + centralized error handler
  controllers/              authController.js, leadController.js
  routes/                   authRoutes.js, leadRoutes.js
  utils/                    ApiError.js, cookies.js
  scripts/seedAdmin.js      Creates the single admin account
```

## Installation

Requirements: Node.js 18+ and a MongoDB database (local MongoDB or a free MongoDB Atlas cluster).

```bash
npm install
cp .env.example .env      # on Windows: copy .env.example .env
```

Then edit `.env` (see below).

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | no | Server port (default `5000`) |
| `NODE_ENV` | no | `development` or `production` |
| `MONGODB_URI` | yes | MongoDB connection string |
| `JWT_SECRET` | yes | Random string, at least 32 characters |
| `JWT_EXPIRES_IN_HOURS` | no | Session length in hours (default `24`). The cookie lifetime uses the same value. |
| `CLIENT_ORIGIN` | yes | Origin of the React app, e.g. `http://localhost:5173`. Comma-separate for several. |
| `COOKIE_SAME_SITE` | no | `lax` (default), `strict` or `none` |
| `COOKIE_SECURE` | no | Defaults to `true` in production, `false` otherwise |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | seed only | Credentials used by `npm run seed:admin` (password min. 8 characters) |

Generate a `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Database setup

No manual setup is needed. MongoDB creates the database and the `admins` and `leads` collections (and their indexes) automatically the first time they are used. Just make sure `MONGODB_URI` points to a running MongoDB.

## Seeding the admin account

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`, then run:

```bash
npm run seed:admin
```

- The password is hashed with bcrypt before it is stored.
- Only one admin is allowed. If an admin already exists the script does nothing, so it is safe to run repeatedly.
- To change the admin email or password, delete the document in the `admins` collection (MongoDB Compass or `mongosh`) and run the script again.
- You can remove `ADMIN_PASSWORD` from `.env` after seeding.

## Running the server

```bash
npm run dev     # auto-restarts on file changes (Node 18.11+)
npm start       # normal start
```

Check it works: `GET http://localhost:5000/api/health`

## API endpoints

All responses are JSON. Success: `{ "success": true, ... }`. Errors: `{ "success": false, "message": "..." }`.

### Health
`GET /api/health` – public. `200 { "success": true, "message": "OK" }` (503 if the database is disconnected).

### Admin auth – `/api/admin/auth`

**`POST /api/admin/auth/login`** (public)

Request:
```json
{ "email": "admin@example.com", "password": "your-password" }
```
Response `200` (also sets the `admin_token` HTTP-only cookie):
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": { "id": "64b7f0c2a1b2c3d4e5f60718", "email": "admin@example.com" }
}
```
Errors: `400` missing/invalid input, `401 { "message": "Invalid email or password" }` (same message for a wrong email or a wrong password).

**`POST /api/admin/auth/logout`** (protected) – clears the cookie.
```json
{ "success": true, "message": "Logged out successfully" }
```

**`GET /api/admin/auth/me`** (protected)
```json
{ "success": true, "data": { "id": "64b7f0c2a1b2c3d4e5f60718", "email": "admin@example.com" } }
```
`401` if the cookie is missing, invalid, or expired.

### Leads – `/api/admin/leads` (all protected)

**`GET /api/admin/leads`** – all leads, newest first. Optional `?status=unread` or `?status=read`. Any other status value returns `400`. No pagination.
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "66f1a2b3c4d5e6f708192a3b",
      "customer": { "email": "customer@example.com", "phone": "9876543210" },
      "package": { "name": "Coorg Weekend Getaway", "price": 7500 },
      "leadStatus": "unread",
      "createdAt": "2026-10-16T09:30:00.000Z",
      "updatedAt": "2026-10-16T09:30:00.000Z"
    }
  ]
}
```

**`GET /api/admin/leads/:id`** – one lead: `{ "success": true, "data": { ...lead } }`. `400` for a malformed ID, `404` if not found.

**`PATCH /api/admin/leads/:id/toggle-status`** – no body. Flips `unread` ⇄ `read`.
```json
{ "success": true, "message": "Lead marked as read", "data": { ...updated lead } }
```

**`DELETE /api/admin/leads/:id`** – permanently deletes the document.
```json
{ "success": true, "message": "Lead deleted permanently" }
```

## Testing with Postman

1. Run `npm run seed:admin`, then `npm run dev`.
2. `POST http://localhost:5000/api/admin/auth/login` with body type **raw → JSON** and the admin email/password. Postman stores the `admin_token` cookie automatically and sends it on later requests to `localhost:5000` (check under **Cookies**).
3. Call `GET /api/admin/auth/me` – it should return the admin.
4. Try any `/api/admin/leads` endpoint without logging in first – you should get `401`.

**There is no endpoint to create leads**, so to test the lead endpoints insert a few documents manually, using MongoDB Compass (Add Data → Insert Document into the `leads` collection) or `mongosh`:

```js
use keerthana_tours
db.leads.insertOne({
  customer: { email: "customer@example.com", phone: "9876543210" },
  package: { name: "Coorg Weekend Getaway", price: 7500 },
  leadStatus: "unread",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Then try: list leads, `?status=unread`, `?status=bogus` (400), open a lead by `_id`, toggle it, delete it, and an invalid ID such as `/api/admin/leads/123` (400).

## Connecting the React frontend

Requests must include the cookie:

```js
// fetch
fetch(`${API_URL}/api/admin/auth/login`, {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

// Axios
axios.defaults.withCredentials = true;   // or { withCredentials: true } per request
```

The frontend cannot read the cookie (it is HTTP-only). To know whether the admin is logged in, call `GET /api/admin/auth/me` when the dashboard loads – a `401` means show the login page.

## Cookies and CORS when frontend and backend are on different domains

Set these on the **backend** (`.env` / hosting dashboard):

- `CLIENT_ORIGIN` must exactly equal the frontend's origin (scheme + host, no path, no trailing slash), e.g. `https://keerthana-tours.netlify.app`. CORS is configured with `credentials: true`, so a wildcard origin is never used.
- `NODE_ENV=production` (turns on `Secure` cookies and proxy trust).
- Both sites must use **HTTPS**.

Which `COOKIE_SAME_SITE` to use depends on the setup:

| Setup | Example | `COOKIE_SAME_SITE` |
|---|---|---|
| Local development | `localhost:5173` → `localhost:5000` | `lax` (same site, ports don't matter) |
| Same site, different subdomains | `app.example.com` → `api.example.com` | `lax` |
| Completely different sites | `my-site.netlify.app` → `my-api.onrender.com` | `none` (requires HTTPS; `Secure` is enforced) |

Notes for the cross-site (`none`) case:
- Some browsers (Safari, and Chrome/Firefox with strict privacy settings) block third-party cookies, so login may not persist. The most reliable fix is hosting the frontend and API under subdomains of one domain you own and using `lax`.
- The frontend must send credentialed requests (`credentials: "include"` / `withCredentials: true`).
- Don't forget to set `CLIENT_ORIGIN` to the deployed frontend URL, not `localhost`.

## Notes for adding payments later

When the payment gateway is added, the lead-creation code should run only after the backend has verified the payment with the provider (not from a client-side "payment succeeded" message). It can then call `Lead.create({ customer, package })` with the package name and price snapshotted at purchase time. The `Lead` model already has the fields it needs.

## Security notes

- Passwords are bcrypt-hashed (12 rounds); the `password` field is excluded from queries by default.
- The JWT is only ever stored in an HTTP-only cookie, and the admin identity is taken from the verified token, never from client input.
- Error responses never include stack traces; details are logged on the server only.
- For a public deployment, consider adding `helmet` and login rate limiting (e.g. `express-rate-limit`). They were left out to keep this project simple.
