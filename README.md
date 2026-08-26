# 🏠 PropertyAI — Smart Property Finder

> An AI-powered property discovery platform built with React & Firebase, supporting pan-India property search with intelligent matching.

🌐 **Live Demo:** [https://propertyai-a9c15.web.app](https://propertyai-a9c15.web.app)

---

## ✨ Features

- 🤖 **AI Smart Matching** — Natural language search with weighted scoring algorithm
- 🔐 **Firebase Authentication** — Secure login & signup with Email/Password
- ☁️ **Firestore Database** — All data (properties, bookings, users) stored in the cloud
- 🗺️ **Pan-India Search** — Browse properties across 9+ states with cascading State → City → Location filters
- ❤️ **Favorites** — Save and manage your favourite properties
- 📅 **Visit Booking** — Schedule property visits with date/time picker
- 👤 **User Profile** — Edit profile, view stats, manage settings
- 🔔 **Notifications** — In-app notification centre
- 👑 **Admin Dashboard** — Manage properties, users, and visit bookings
- 📱 **Mobile-First UI** — Glassmorphism design optimised for 360–400px screens

---

## 🏙️ Supported Locations

| State | Cities |
|-------|--------|
| Karnataka | Bangalore |
| Maharashtra | Mumbai, Pune |
| Telangana | Hyderabad |
| Tamil Nadu | Chennai |
| Delhi NCR | Delhi, Gurgaon, Noida |
| West Bengal | Kolkata |
| Gujarat | Ahmedabad |
| Rajasthan | Jaipur |
| Andhra Pradesh | Vijayawada, Visakhapatnam, Tirupati, Nellore |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Build Tool | Vite |
| Styling | Vanilla CSS, Glassmorphism |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| Hosting | Firebase Hosting |
| AI Matching | Custom weighted scoring engine |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Firebase project (create one at [console.firebase.google.com](https://console.firebase.google.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/AdilSk7/ai-property-finder.git
cd ai-property-finder

# Install dependencies
npm install

# Start development server
npm run dev
```

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication → Email/Password**
3. Create a **Firestore Database**
4. Set Firestore rules to allow reads/writes during development
5. Copy your Firebase config into `src/firebase.js`

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  ...
};
```

### Build & Deploy

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

---

## 👑 Admin Access

To get admin access, sign up with the email:
```
admin@propertyfinder.com
```
Then go to **Admin Dashboard → 🌱 Seed Data** to populate the database with sample properties.

---

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
├── context/           # AuthContext (Firebase Auth)
├── data/              # Property data & India location hierarchy
├── pages/             # All screen components
│   └── admin/         # Admin-only screens
├── utils/             # db.js (Firestore), smartMatch.js (AI)
├── App.jsx            # Routes
├── firebase.js        # Firebase config
└── index.css          # Global styles & design tokens
```

---

## 📸 Screenshots

> Mobile-first glassmorphism UI with dark theme

| Home | Search | Property Detail |
|------|--------|----------------|
| Browse featured properties | Filter by State/City/Location | AI match score & amenities |

---

## 📄 License

MIT License © 2026 [AdilSk7](https://github.com/AdilSk7)
