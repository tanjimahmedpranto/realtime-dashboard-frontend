# Realtime Product Dashboard – Frontend (Next.js + Firebase)

## Overview
This is the **frontend** for the Realtime Product Management Dashboard.

It provides:
- Login page connected to the backend (JWT cookie auth)
- Protected Product page with realtime table and full CRUD
- Analytics page with charts based on live product data
- Realtime updates powered by Firebase Firestore

Live app: https://realtime-dashboard-frontend.vercel.app/login  

Backend API: https://realtime-dashboard-backend.onrender.com

---

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Redux Toolkit + RTK Query** (state + API)
- **React Hook Form + Zod** (forms + validation)
- **Shadcn UI** (UI components)
- **Shadcn Charts + Recharts** (charts)
- **TanStack React Table** (data table)
- **Firebase Firestore** (realtime data)

---

## Project Structure

```text
frontend/
├── app/
│   ├── layout.tsx          # Root layout, wraps ReduxProvider
│   ├── page.tsx            # Redirects to /login
│   ├── login/page.tsx      # Login screen
│   ├── products/page.tsx   # Product management page
│   └── analytics/page.tsx  # Analytics dashboard
├── components/
│   ├── layout/
│   │   └── MainNav.tsx     # Top navigation bar
│   ├── products/
│   │   ├── ProductTable.tsx
│   │   ├── ProductFormDialog.tsx
│   │   ├── StatusDialog.tsx
│   │   └── DeleteDialog.tsx
│   └── ui/                 # Shadcn UI + chart wrappers
├── hooks/
│   └── useRealtimeProducts.ts   # Firestore + RTK Query integration
├── lib/
│   ├── apiSlice.ts         # RTK Query endpoints
│   ├── authSlice.ts        # Auth state (user email)
│   ├── store.ts            # Redux store
│   └── firebase.ts         # Firebase client init
├── types/
│   └── product.ts          # Product + ProductStatus types
├── middleware.ts           # Route protection redirects
└── README.md
```

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/tanjimahmedpranto/realtime-dashboard-frontend.git
cd realtime-dashboard-frontend
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:4000

# Firebase web app config
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

For **production (Vercel)** set the same variables in the Vercel dashboard, but with:

```env
NEXT_PUBLIC_API_URL=https://realtime-dashboard-backend.onrender.com
```

---

## Development

Backend must be running locally on port **4000**.

```bash
npm run dev
```

Open: http://localhost:3000

---

## Build & Start (Production)

```bash
npm run build
npm start
```

---

## Pages

### `/login`

- Shadcn Card + Form.
- Uses **React Hook Form + Zod** for validation.
- Calls `POST /auth/login` through `useLoginMutation` (RTK Query).
- On success:
  - Backend sets an HTTP-only JWT cookie.
  - Frontend stores the email in Redux.
  - Redirects to `/products`.

Demo credentials (configured on backend):

```text
Email:    demo@example.com
Password: password123
```

---

### `/products`

- Protected page (requires login).
- Uses `MainNav` for navigation (Products / Analytics / Logout).
- Uses `ProductTable` for displaying and managing products.

Features:

- Realtime product list (from Firestore).
- Columns: Name, Category, Price, Stock, Status, Created, Actions.
- Actions:
  - **Add Product** (opens `ProductFormDialog` in add mode)
  - **Edit** (edit modal)
  - **Change Status** (status dialog)
  - **Delete** (delete confirm dialog)

Forms use:

- React Hook Form
- Zod validation schema
- RTK Query mutations for create, update, status change, delete

---

### `/analytics`

- Also uses `useRealtimeProducts`.
- Summary cards:
  - Total products
  - Total stock
  - Total inventory value
- Charts (Shadcn Charts + Recharts):
  - Pie chart: products by status (active / inactive / archived)
  - Bar chart: stock by category
  - Bar chart: inventory value by category

All charts update automatically when data changes in Firestore.

---

## Realtime Behaviour

`useRealtimeProducts` hook:

1. Calls `GET /products` once via RTK Query to get initial data.
2. Sets up a Firestore `onSnapshot` listener on the `products` collection.
3. On any Firestore change (add / update / delete), it updates the RTK Query cache with:
   ```ts
   apiSlice.util.updateQueryData("getProducts", undefined, () => productsArray)
   ```
4. Components subscribing to `useGetProductsQuery` automatically re-render with the new data.

This means:
- You can edit products from the app OR directly in Firebase console.
- Both the table and analytics page reflect changes in realtime.

---

## Authentication Notes

- Backend sets an **HTTP-only cookie** on its own origin.
- In production:
  - Cookie is `Secure` and `SameSite=None`.
  - Frontend and backend are on different domains (Vercel + Render).
- Frontend always includes credentials:
  ```ts
  fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include"
  })
  ```
- Protected behavior is enforced by the backend:
  - If cookie is missing or invalid, backend returns `401 Unauthorized`.

---

## Deployment (Vercel)

Deployed at: https://realtime-dashboard-frontend.vercel.app

Vercel settings:

- **Build Command:** `npm run build`
- **Output:** Next.js app (default)
- **Node version:** use Vercel default
- **Environment Variables:** all `NEXT_PUBLIC_*` values as above

The live frontend is currently configured to talk to:

```env
NEXT_PUBLIC_API_URL=https://realtime-dashboard-backend.onrender.com
```

so it works end-to-end with the deployed backend.

---

## Notes for Examiners

- The app demonstrates:
  - Modern Next.js App Router usage
  - Redux Toolkit + RTK Query for clean data flow
  - Real-time Firestore integration
  - Secure cookie-based authentication with a separate backend
  - Clean UI built with Shadcn + charts
- The codebase is intentionally structured and commented to be easy to follow and grade.
