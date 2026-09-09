# Zero Cool Commerce

A premium, data-driven product selling platform built with Next.js, TypeScript, Tailwind CSS, and Firebase. Designed to handle dynamic product lifecycles (Prototypes, Pre-Orders, Available, etc.) through a complete Admin Dashboard.

## Features

- **Dynamic Product Lifecycles**: Support for PROTOTYPE, PRE_ORDER, COMING_SOON, AVAILABLE, OUT_OF_STOCK, DISCONTINUED.
- **Admin Dashboard**: Full CRUD for products, orders (placeholder), and categories.
- **Firebase Integration**: Firestore for data, Firebase Storage for images, Firebase Auth for secure admin access.
- **Shopping Cart**: Client-side cart using Zustand.
- **Premium Design**: Dark/light mode support, responsive UI, Tailwind CSS.

## Technology Stack

- Next.js (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Firebase (Auth, Firestore, Storage)
- Zustand (State Management)
- Lucide React (Icons)
- Vercel (Deployment)

## Folder Structure

```
/
├── src/
│   ├── app/
│   │   ├── (public)/          # Public-facing routes (Shop, Cart, Checkout, etc.)
│   │   └── (admin)/           # Admin Dashboard routes
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Utility functions and Firebase config
│   ├── store/                 # Zustand state stores
│   └── types/                 # TypeScript interfaces
├── firestore.rules            # Firebase Security Rules for DB
├── storage.rules              # Firebase Security Rules for Storage
└── next.config.mjs            # Next.js Configuration
```

## Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. **Enable Authentication**: Enable Email/Password provider.
4. **Create Firestore Database**: Start in production mode.
5. **Enable Storage**: Set up Firebase Storage.
6. **Register Web App**: Get your Firebase configuration keys.

## Admin Setup

To access the Admin Dashboard at `/admin`, you need to:
1. Create a user via Firebase Authentication in the console.
2. In Firestore, create a collection named `admins`.
3. Create a document with the Document ID matching the User UID.
4. Add the following fields to the document:
   - `uid` (string): The user's UID
   - `email` (string): The user's email
   - `role` (string): `SUPER_ADMIN`
   - `isActive` (boolean): `true`

## Security Rules

You must deploy the included security rules to secure your database and storage.
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy --only firestore,storage
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your Firebase configuration values:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
```

## Local Development

```bash
npm install
npm run dev
```

The app will be running on `http://localhost:3000`.

## Vercel Deployment

1. Push your code to a private GitHub repository.
2. Connect the repository to [Vercel](https://vercel.com).
3. In Vercel, go to the project settings and add all the Firebase environment variables from your `.env.local`.
4. Deploy!

## Production Checklist

- [ ] Firebase Rules Deployed
- [ ] Environment Variables added to Vercel
- [ ] Admin User Created in Firestore
- [ ] Firebase Storage Rules properly configured
