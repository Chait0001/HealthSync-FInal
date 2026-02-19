# HealthSync

A comprehensive healthcare management platform designed to streamline patient records, appointments, and hospital administration.

🚀 **Live Demo:** [https://health-sync-final-syvo.vercel.app/](https://health-sync-final-syvo.vercel.app/)

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

## ✨ Features
- **User Authentication**: Secure login and signup for patients, doctors, and content managers.
- **Role-Based Access Control**: specialized dashboards for Admin, Doctor, and Patient roles.
- **Patient Management**: comprehensive tracking of patient history, appointments, and medical records.
- **Appointment Scheduling**: Easy booking and management of doctor appointments.
- **Modern UI/UX**: Responsive design with Dark/Light mode support using Shadcn UI and Tailwind CSS.
- **Data Visualization**: insightful charts and analytics for hospital administration.

## 🛠 Tech Stack

### Frontend (Client)
- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend (Server)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (Local or AtlasURI)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chait0001/HealthSync-FInal.git
   cd HealthSync-FInal
   ```

2. **Frontend Setup**
   ```bash
   cd client
   npm install
   # Create .env.local file (see Environment Variables below)
   npm run dev
   ```
   The client will start at `http://localhost:3000`.

3. **Backend Setup**
   ```bash
   cd ../server
   npm install
   # Create .env file (see Environment Variables below)
   npm run dev
   ```
   The server will start at `http://localhost:8080`.

## 🔑 Environment Variables

### Client (`client/.env.local`)
Create a `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Server (`server/.env`)
Create a `.env` file in the `server` directory:
```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
