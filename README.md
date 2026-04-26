# Kunafa Chat - Simple Chat Application

A simple chat application where only Manil and Ines can communicate with each other.

Built with **Next.js 14**, **Prisma ORM**, and **PostgreSQL** for optimal Vercel deployment.

## Features

- **Authentication**: Two users (Manil and Ines) with static passwords
- **Session Management**: 1-day session duration with localStorage persistence
- **Real-time Chat**: Send and receive messages in real-time
- **PostgreSQL Database**: Persistent message storage with Prisma ORM
- **Vercel Ready**: Optimized for serverless deployment on Vercel
- **Next.js 14**: Latest React framework with App Router

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or managed service like Vercel Postgres, Supabase, Railway)

## Installation

```bash
# Install dependencies
npm install

# Setup database
npm run db:push
```

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/kunafa"
```

See `.env.example` for more database options.

## Build & Deploy

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com)
3. Add `DATABASE_URL` environment variable (PostgreSQL connection string)
4. Deploy!

Recommended PostgreSQL providers:
- **Vercel Postgres** (built-in, easiest)
- **Supabase** (free tier available)
- **Railway** (simple and affordable)
- **Neon** (serverless PostgreSQL)

## How to Use

1. **Login Page (`/`)**: 
   - Select either "Manil" or "Ines"
   - Enter the password
   - Session is saved in localStorage with connection datetime

2. **Chat Page (`/chat`)**:
   - View messages from both users
   - Send messages
   - Click "Déconnexion" to logout
   - Session expires automatically after 24 hours

## Default Passwords

- **Manil**: `manil123`
- **Ines**: `ines123`

Update in `server/users.json`

## Database Schema

### Message Table
```sql
- id: Auto-increment primary key
- sender: "manil" or "ines"
- text: Message content
- timestamp: When the message was sent
```

### Session Table
```sql
- id: Auto-increment primary key
- user: "manil" or "ines"
- token: Unique session token
- createdAt: When the session was created
- expiresAt: When the session expires (24 hours from creation)
```

## Project Structure

```
kunafa-chat/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.js
│   │   │   ├── logout/route.js
│   │   │   ├── verify/route.js
│   │   │   └── users/route.js
│   │   └── chat/
│   │       └── messages/route.js
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Chat.jsx
│   │   └── *.css
│   ├── chat/
│   │   └── page.jsx
│   ├── lib/
│   │   └── prisma.js
│   ├── page.jsx
│   ├── layout.jsx
│   └── globals.css
├── prisma/
│   └── schema.prisma
├── server/
│   └── users.json
├── .env
├── .env.example
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with userId and password
- `POST /api/auth/verify` - Verify session token
- `POST /api/auth/logout` - Logout and destroy session
- `GET /api/auth/users` - Get list of available users

### Chat
- `GET /api/chat/messages` - Get all messages (requires Bearer token)
- `POST /api/chat/messages` - Send a message (requires Bearer token)

## Available Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run db:push          # Create/update database schema
npm run db:studio        # Open Prisma Studio
npm run db:generate      # Generate Prisma client
```

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Run `npm run db:push` to sync schema

### Session Expires Immediately
- Verify DATABASE_URL is set correctly
- Check database connectivity
- Review session expiration in `app/lib/prisma.js`

### Port 3000 Already in Use
```bash
PORT=3001 npm run dev
```

## License

MIT

