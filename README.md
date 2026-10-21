# Keerthana Tours & Travels

A full-stack travel booking web application built for **Keerthana Tours & Travels**. The project provides a responsive website where visitors can explore predefined tour packages and initiate bookings, along with an admin dashboard for managing booking records.

The application uses React and TypeScript on the frontend, an Express REST API on the backend, MongoDB for data storage, and Razorpay for payment processing.

## Features

- **Travel Website**
  - Browse tour packages and itineraries.
  - View package details, duration, pricing, and inclusions.
  - Explore destinations and company information.
  - Access contact information and booking options.

- **Booking & Payments**
  - Initiate bookings for predefined tour packages.
  - Create Razorpay orders through the backend.
  - Verify payment details on the server.
  - Create booking records after successful payment verification.

- **Admin Authentication**
  - Admin login and logout.
  - JWT-based authentication using HTTP-only cookies.
  - Protected admin routes and API endpoints.
  - Password hashing with bcrypt.

- **Booking Management**
  - View bookings in the admin dashboard.
  - Filter bookings by read/unread status.
  - Paginate through booking records.
  - Mark bookings as read or unread.
  - Soft-delete bookings without permanently removing their database records.

## Tech Stack

### Frontend
- React 19
- TypeScript
- TanStack Router
- Vite
- Tailwind CSS 4
- shadcn/ui
- Razorpay JavaScript SDK
- Fetch API for HTTP requests

### Backend
- Node.js
- Express 5
- JavaScript ES Modules
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- Cookie Parser
- CORS
- Razorpay SDK

## Prerequisites

Before running the application, ensure you have the following:

1. **Node.js** — Version 18 or later.
2. **MongoDB** — A local MongoDB instance or a MongoDB Atlas database.
3. **Razorpay Account** — Required for configuring and testing payment functionality. Obtain your API key ID and API key secret from the [Razorpay Dashboard](https://dashboard.razorpay.com/).

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Keerthana_Tours_And_Travels-main
```

Replace `<your-repository-url>` with your Git repository URL.

### 2. Set up the backend

Navigate to the server directory and install the dependencies.

```bash
cd server
npm install
```

Create a `.env` file by copying the example configuration:

```bash
cp .env.example .env
```

On Windows Command Prompt, use:

```cmd
copy .env.example .env
```

Configure the environment variables in `server/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/keerthana_tours

# Authentication
JWT_SECRET=your_random_secret_at_least_32_characters_long
JWT_EXPIRES_IN_HOURS=24

# Frontend origin
CLIENT_ORIGIN=http://localhost:5173

# Cookie settings
COOKIE_SAME_SITE=lax

# Initial admin account
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password

# Razorpay
RAZORPAY_API_KEY=your_razorpay_key_id
RAZORPAY_API_SECRET=your_razorpay_key_secret
```

Generate a secure JWT secret using:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Update the MongoDB connection string, admin credentials, and Razorpay credentials before proceeding.

### 3. Create the admin account

From the `server` directory, run:

```bash
npm run seed:admin
```

This creates the initial admin account using the credentials configured in `.env`. The password is hashed before being stored in MongoDB.

### 4. Start the backend

Run the development server:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

Verify the server and database connection using:

```text
GET http://localhost:5000/api/health
```

### 5. Set up the frontend

Open a second terminal and navigate to the client directory from the project root:

```bash
cd client
npm install
```

Create a `client/.env` file containing:

```env
VITE_API_URL=http://localhost:5000
```

This variable specifies the backend base URL used by frontend API requests.

### 6. Start the frontend

From the `client` directory, run:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

The frontend and backend must both be running for API-dependent features to work.

## Environment Variables

### Backend — `server/.env`

| Variable | Description |
|---|---|
| `PORT` | Backend port; defaults to `5000`. |
| `NODE_ENV` | Application environment, such as `development` or `production`. |
| `MONGODB_URI` | MongoDB connection string. |
| `JWT_SECRET` | Secret used to sign and verify JWTs; at least 32 characters. |
| `JWT_EXPIRES_IN_HOURS` | Admin session lifetime in hours. |
| `CLIENT_ORIGIN` | Allowed frontend origin or comma-separated origins. |
| `COOKIE_SAME_SITE` | Cookie policy: `lax`, `strict`, or `none`. |
| `COOKIE_SECURE` | Optional setting for secure cookies. Defaults according to the environment. |
| `ADMIN_EMAIL` | Email for the initial admin account. |
| `ADMIN_PASSWORD` | Password for the initial admin account. |
| `RAZORPAY_API_KEY` | Razorpay API key ID. |
| `RAZORPAY_API_SECRET` | Razorpay API key secret. |

### Frontend — `client/.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API. |

**Security:** Never commit `.env` files or expose secret keys in frontend code. Variables prefixed with `VITE_` are exposed to the client bundle and must not contain secrets.

## API Overview

The backend exposes REST API endpoints for health checks, admin authentication, booking management, and payments.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Check server and database status. |
| `POST` | `/api/admin/auth/login` | Authenticate the admin. |
| `POST` | `/api/admin/auth/logout` | Log out the admin. |
| `GET` | `/api/admin/auth/me` | Retrieve the authenticated admin. |
| `GET` | `/api/admin/leads` | Retrieve bookings, with optional status filtering and pagination. |
| `GET` | `/api/admin/leads/:id` | Retrieve a booking by ID. |
| `PATCH` | `/api/admin/leads/:id/toggle-status` | Toggle a booking's read/unread status. |
| `DELETE` | `/api/admin/leads/:id` | Soft-delete a booking. |
| `POST` | `/api/payment/order` | Create a Razorpay order. |
| `POST` | `/api/payment/verify` | Verify payment details and process the booking. |

Admin authentication and booking-management endpoints require a valid admin session. The frontend includes credentials with API requests so the browser can send the HTTP-only authentication cookie.

## Project Structure

```text
Keerthana_Tours_And_Travels/
├── client/
│   ├── public/                  # Static public assets
│   └── src/
│       ├── assets/              # Images and other assets
│       ├── components/          # Shared UI and booking components
│       │   └── ui/              # shadcn/ui components
│       ├── features/            # Authentication, booking and payment APIs
│       ├── hooks/               # Custom React hooks
│       ├── lib/                 # Shared utilities and helpers
│       ├── routes/              # Website and admin routes
│       ├── types/               # TypeScript interfaces and types
│       ├── utils/               # API request utilities
│       ├── router.tsx           # Router configuration
│       └── routeTree.gen.ts     # Generated route tree
│
├── server/
│   ├── src/
│   │   ├── config/              # Environment, database and Razorpay setup
│   │   ├── controllers/         # Request handlers
│   │   ├── middleware/          # Authentication and error handling
│   │   ├── models/              # Mongoose models
│   │   ├── routes/              # Express API routes
│   │   ├── scripts/             # Admin seeding script
│   │   ├── utils/               # Shared backend utilities
│   │   ├── app.js               # Express application configuration
│   │   └── server.js             # Server startup
│   ├── .env.example             # Backend environment template
│   └── package.json
│
└── README.md
```

## Available Scripts

### Frontend (`client/`)

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Build the frontend for production. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |
| `npm run format` | Format frontend files using Prettier. |

### Backend (`server/`)

| Command | Description |
|---|---|
| `npm run dev` | Start the backend with automatic restarts. |
| `npm start` | Start the backend normally. |
| `npm run seed:admin` | Create the initial admin account. |

## Security Considerations

- Admin authentication uses JWTs stored in HTTP-only cookies.
- Admin passwords are hashed with bcrypt.
- CORS allows configured frontend origins and supports credentialed requests.
- Payment verification is handled by the backend rather than trusting a client-side success message.
- Deleted bookings are soft-deleted, preserving their database records.
- Razorpay secrets and JWT secrets must remain on the backend.

For deployment, configure HTTPS, the correct frontend origin, production cookie settings, and environment variables in your hosting provider. Test payment flows using Razorpay's supported test mode before enabling live payments.

## Notes

- Tour packages are predefined in the frontend; this project does not include a package-management interface.
- The admin dashboard is intended for managing booking records.
- This project was developed as a college project to demonstrate full-stack web development, authentication, database integration, and payment processing.
