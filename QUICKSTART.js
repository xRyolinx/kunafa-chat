#!/usr/bin/env node

/**
 * Kunafa Chat Application
 * A simple two-user chat application with authentication and session management
 */

console.log(`
╔════════════════════════════════════════════════════════════╗
║                    KUNAFA CHAT APP                         ║
║            Simple Chat for Manil & Ines                    ║
╚════════════════════════════════════════════════════════════╝

📁 Project Structure Created:
├── server/              Express.js backend
├── client/              React frontend with Vite
├── prisma/              Database configuration
├── .env                 Environment variables
├── package.json         Root dependencies
├── SETUP.md             Detailed setup guide
└── README.md            Quick reference

🚀 Quick Start:

1. Install dependencies:
   npm install
   cd client && npm install && cd ..

2. Initialize database:
   npm run db:push

3. Start backend (Terminal 1):
   npm run dev
   → Server on http://localhost:5000

4. Start frontend (Terminal 2):
   cd client
   npm run dev
   → Frontend on http://localhost:5173

🔑 Default Credentials:
   User 1: Manil  | Password: manil123
   User 2: Ines   | Password: ines123

💾 Database:
   Type: SQLite (dev) / PostgreSQL (production)
   ORM: Prisma
   Location: dev.db

🌐 API Endpoints:
   POST   /api/auth/login           - User login
   POST   /api/auth/logout          - User logout
   POST   /api/auth/verify          - Verify session
   GET    /api/auth/users           - Get users list
   GET    /api/chat/messages        - Get all messages
   POST   /api/chat/message         - Send message

✨ Features:
   ✓ User authentication with static passwords
   ✓ Session management (24-hour expiration)
   ✓ Real-time chat messaging
   ✓ Persistent message storage
   ✓ localStorage session persistence
   ✓ Responsive UI with Tailwind-like styling
   ✓ Vercel deployment ready

📚 Documentation:
   - SETUP.md: Complete setup & deployment guide
   - README.md: Project overview
   - server/users.json: Edit user credentials here

🛠️ Available Commands:
   npm run dev              - Start backend server
   npm run build            - Generate Prisma client
   npm run db:push          - Create/update database schema
   npm run db:studio        - Open Prisma Studio

   cd client && npm run dev - Start frontend dev server
   cd client && npm run build - Build production frontend

🌍 Deploy to Vercel:
   1. Push to GitHub
   2. Import project in Vercel
   3. Set DATABASE_URL environment variable
   4. Deploy!

📖 For detailed instructions, see SETUP.md
`);
