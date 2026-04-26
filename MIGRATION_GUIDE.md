# Kunafa Chat - Next.js + PostgreSQL Version

## 🎯 What Changed?

This is a complete refactor from **Express + Vite + SQLite** to **Next.js 14 + PostgreSQL**.

### Key Improvements

| Aspect | Before (Express) | After (Next.js) |
|--------|-----------------|-----------------|
| **Structure** | Separate server/client | Unified codebase |
| **Dev Setup** | 2 servers needed | 1 dev server |
| **API Routing** | Express routes | Next.js API routes |
| **Frontend** | React + Vite | React with App Router |
| **Database** | SQLite (ephemeral on Vercel) | PostgreSQL (persistent) |
| **Deployment** | Custom setup | Zero-config on Vercel |
| **Performance** | Slower startup | Faster with edge functions |
| **Scalability** | Limited on Vercel | Serverless scaling |

## 📦 New Project Structure

```
kunafa-chat/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.js   # POST /api/auth/login
│   │   │   ├── logout/route.js  # POST /api/auth/logout
│   │   │   ├── verify/route.js  # POST /api/auth/verify
│   │   │   └── users/route.js   # GET  /api/auth/users
│   │   └── chat/
│   │       └── messages/route.js # GET/POST /api/chat/messages
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Chat.jsx
│   │   ├── Login.css
│   │   └── Chat.css
│   ├── chat/
│   │   └── page.jsx              # /chat route
│   ├── lib/
│   │   └── prisma.js             # Prisma singleton
│   ├── page.jsx                  # / (login) route
│   ├── layout.jsx                # Root layout
│   └── globals.css
├── prisma/
│   └── schema.prisma             # PostgreSQL schema
├── server/
│   └── users.json                # User credentials
├── .env.local                    # Your DATABASE_URL (git ignored)
├── .env.example                  # Template for .env.local
├── next.config.js                # Next.js config
├── tsconfig.json                 # TypeScript config
└── package.json
```

## 🚀 Quick Start

### 1. Setup PostgreSQL

**Option A: Local PostgreSQL**
```bash
# Windows: Download from postgresql.org
# macOS: brew install postgresql@15 && brew services start postgresql@15
# Linux: sudo apt-get install postgresql

# Create database:
psql -U postgres
CREATE DATABASE kunafa;
\q
```

**Option B: Cloud PostgreSQL (Recommended)**
- [Vercel Postgres](https://vercel.com/docs/postgres)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)
- [Neon](https://neon.tech)

### 2. Create `.env.local`

```bash
# Example for local PostgreSQL:
DATABASE_URL="postgresql://postgres:password@localhost:5432/kunafa"

# Or copy from .env.example and edit
```

### 3. Install & Setup

```bash
npm install
npm run db:push
npm run dev
```

Open: http://localhost:3000

## 🔑 API Changes

All endpoints now start with `/api/` (same as before):

```
POST   /api/auth/login       - Login user
POST   /api/auth/logout      - Logout user
POST   /api/auth/verify      - Verify session
GET    /api/auth/users       - Get user list

GET    /api/chat/messages    - Get all messages
POST   /api/chat/messages    - Send message
```

## 📝 Environment Variables

### Development (`.env.local`)

```env
# Required for local development
DATABASE_URL="postgresql://user:password@localhost:5432/kunafa"
```

### Production (Vercel)

Set in Vercel Dashboard → Settings → Environment Variables:

```env
DATABASE_URL=<your-postgres-connection-string>
```

### Examples

**Vercel Postgres:**
```
postgresql://user:password@vercel-postgres.com:5432/kunafa
```

**Supabase:**
```
postgresql://postgres:password@db.supabase.co:5432/postgres
```

**Railway:**
```
postgresql://user:password@railway.app:5432/kunafa
```

## 🗄️ Database Migration

If you had data in the old SQLite database:

### Export from SQLite

```bash
# Open Prisma Studio (if using old version)
npm run db:studio
# Manually export data or use: sqlite3 dev.db ".dump"
```

### Import to PostgreSQL

1. Set new `DATABASE_URL` in `.env.local`
2. Run `npm run db:push` to create schema
3. Import exported data (SQL commands or Prisma Studio)

Or start fresh:
```bash
npm run db:push
# New empty database ready
```

## 📚 File Mappings

### Old Express Structure → New Next.js Structure

```
BEFORE                          AFTER
server/index.js              → app/api/* (routes)
server/routes/auth.js        → app/api/auth/*.js
server/routes/chat.js        → app/api/chat/messages/route.js
client/src/App.jsx           → app/page.jsx + app/layout.jsx
client/src/components/*      → app/components/*
prisma/schema.prisma         → prisma/schema.prisma (updated for PostgreSQL)
```

## 🛠️ Available Commands

```bash
# Development
npm run dev                  # Start dev server (http://localhost:3000)

# Build & Production
npm run build                # Build for production
npm start                    # Start production server

# Database
npm run db:push              # Create/sync database schema
npm run db:studio            # Open Prisma Studio GUI
npm run db:generate          # Generate Prisma client
```

## 🌐 Deployment to Vercel

### With GitHub

1. Push your code:
   ```bash
   git add .
   git commit -m "Migrate to Next.js + PostgreSQL"
   git push origin main
   ```

2. Import to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. Add environment variables:
   - Go to project Settings → Environment Variables
   - Add `DATABASE_URL` with your PostgreSQL connection string

4. Deploy:
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Your app is live!

### Why This is Better

✅ No build command configuration needed
✅ No output directory configuration needed
✅ API routes work as serverless functions
✅ Auto-scaling
✅ Environment variables set securely in Vercel
✅ Automatic SSL/HTTPS
✅ Instant redeploys on git push

## 🔍 Troubleshooting

### "Cannot find DATABASE_URL"

Create `.env.local`:
```bash
DATABASE_URL="postgresql://..."
```

### "Database connection refused"

- Ensure PostgreSQL is running locally
- Check the connection string format
- For cloud databases, verify credentials

### Build fails with Prisma error

```bash
npm run db:generate
npm run build
```

### Port 3000 already in use

```bash
PORT=3001 npm run dev
```

## ✅ Verification Checklist

- [ ] Created `.env.local` with DATABASE_URL
- [ ] Ran `npm install`
- [ ] Ran `npm run db:push` successfully
- [ ] `npm run dev` starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can login with Manil/Ines
- [ ] Can send messages
- [ ] Messages persist across refreshes
- [ ] `npm run build` completes successfully

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [PostgreSQL Tutorials](https://www.postgresql.org/docs/current/tutorial.html)

## 🎯 Summary

This refactor modernizes your chat app to use industry-standard tools:

- **Next.js 14**: Modern React framework with built-in API routes
- **PostgreSQL**: Reliable, scalable database
- **Prisma ORM**: Type-safe database access
- **Vercel**: Zero-config hosting with automatic scaling

The app is now production-ready and can scale from development to millions of users.

---

**Questions?** Check SETUP.md for detailed guides or QUICKREF.txt for quick reference.
