# Eventz Setup Guide

This guide will help you set up the Eventz project with WalletConnect authentication and Firebase database.

## Prerequisites

- Node.js 18+ installed
- A Firebase project
- A WalletConnect Cloud project ID

## 1. Firebase Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the steps
3. Once created, click on the Web icon (</>) to add a web app
4. Register your app and copy the configuration

### Enable Firestore

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **Create database**
3. Start in **production mode** or **test mode** (recommended for development)
4. Choose a Cloud Firestore location

### Configure Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Events collection
    match /events/{eventId} {
      allow read: if true; // Public read access for events
      allow write: if request.auth != null &&
                   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
                    (request.auth.uid == userId ||
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow delete: if request.auth != null &&
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Enable Firebase Storage (for image uploads)

1. In Firebase Console, go to **Build** → **Storage**
2. Click **Get started**
3. Start in **production mode** or **test mode**

### Configure Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /events/{allPaths=**} {
      allow read: if true; // Public read for event images
      allow write: if request.auth != null &&
                   request.resource.size < 5 * 1024 * 1024 && // Max 5MB
                   request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 2. WalletConnect Setup

### Get Project ID

1. Go to [Reown Cloud](https://cloud.reown.com/)
2. Sign up or log in
3. Create a new project
4. Copy your Project ID

## 3. Environment Variables

1. Copy the example environment file:
```bash
cd EventzApp
cp .env.example .env.local
```

2. Fill in your Firebase configuration:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# WalletConnect / Reown AppKit Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

## 4. Install Dependencies

```bash
npm install
```

## 5. Create First Admin User

Since authentication is now wallet-based, you need to create your first admin user manually in Firestore:

1. Go to Firebase Console → Firestore Database
2. Create a new collection called `users`
3. Add a document with the following fields:
   ```
   walletAddress: "0xYourWalletAddressHere" (lowercase)
   role: "admin"
   email: "your@email.com" (optional)
   createdAt: <Firestore Timestamp - auto>
   lastLogin: <Firestore Timestamp - auto>
   ```

Replace `0xYourWalletAddressHere` with your actual wallet address (in lowercase).

## 6. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app.

## 7. Initial Setup

1. Click "Connect Wallet" in the top right
2. Connect with your wallet (the one you added as admin in Firestore)
3. Once connected, you'll be authenticated automatically
4. Navigate to `/admin` to access the admin dashboard
5. Create your first event

## Project Structure

```
EventzApp/
├── lib/
│   ├── firebase.ts              # Firebase initialization
│   ├── firebase-storage.ts      # Image upload utilities
│   ├── firestore-config.ts      # Event CRUD operations
│   ├── firestore-users.ts       # User management
│   ├── web3-auth.ts             # WalletConnect authentication
│   ├── wagmi.ts                 # WagmiConfig setup
│   ├── config.ts                # Event config (now uses Firestore)
│   └── users.ts                 # User utilities (now uses Firestore)
├── components/
│   ├── providers.tsx            # Wagmi & QueryClient providers
│   └── wallet-connect-button.tsx # Wallet connection UI
└── app/
    ├── layout.tsx               # Root layout with providers
    ├── page.tsx                 # Landing page
    └── admin/
        ├── page.tsx             # Admin dashboard
        └── login/page.tsx       # Login (now redirects to connect wallet)
```

## Features

### WalletConnect Authentication
- Secure wallet-based authentication
- Automatic user creation on first connection
- Role-based access control (admin/user)
- Multi-chain support (Ethereum, Arbitrum, Polygon, Base)

### Firebase Integration
- **Firestore**: Event and user data storage
- **Storage**: Image uploads for event hero images
- Real-time data synchronization
- Scalable cloud infrastructure

### Event Management
- Create, edit, and delete events
- Set default event for landing page
- Auto-redirect or manual redirect modes
- Custom hero images, titles, text, and slogans
- Image upload to Firebase Storage

### User Management
- Wallet-based user accounts
- Role-based permissions (admin/user)
- Automatic user creation on wallet connection
- Track last login timestamps

## Troubleshooting

### "Firebase not initialized" Error
- Ensure all environment variables are set in `.env.local`
- Restart the development server after changing environment variables

### "Unauthorized" in Firestore
- Check your Firestore security rules
- Ensure your wallet address is added as admin in the `users` collection
- Verify the wallet address is in lowercase

### WalletConnect Not Working
- Verify your `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is correct
- Check browser console for specific errors
- Try clearing browser cache and reconnecting

### Images Not Uploading
- Check Firebase Storage rules
- Verify file size is under 5MB
- Ensure file type is an image

## Next Steps

- Customize the landing page design
- Add more event fields as needed
- Implement event analytics
- Add email notifications
- Export/import event configurations

## Security Notes

- Never commit `.env.local` to version control
- Use environment-specific Firebase projects (dev/staging/prod)
- Regularly review and update Firestore security rules
- Monitor Firebase usage and set budget alerts
- Keep your WalletConnect Project ID secure
