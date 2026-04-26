# 🚀 Kunafa Chat - Next.js + PostgreSQL Setup & Deployment Guide

## ⚙️ Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **PostgreSQL**: 12+ (local or remote)
- **Git**: For version control

## 🗄️ PostgreSQL Setup

### Option 1: Local PostgreSQL (Development)

**Windows:**
1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Install and remember the password
3. Create database:
   ```bash
   psql -U postgres
   CREATE DATABASE kunafa;
   \q
   ```

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
psql postgres -c "CREATE DATABASE kunafa;"
```

**Linux (Ubuntu):**
```bash
sudo apt-get install postgresql
sudo -u postgres createdb kunafa
```

### Option 2: Cloud PostgreSQL (Recommended)

**Vercel Postgres** (easiest, integrated)
- Go to [vercel.com](https://vercel.com)
- Create project → Add PostgreSQL
- Copy connection string to `.env.local`

**Supabase** (free tier)
- Go to [supabase.com](https://supabase.com)
- Create project
- Copy `postgresql://...` from Project Settings
- Add to `.env.local`

**Railway** (simple)
- Go to [railway.app](https://railway.app)
- Create PostgreSQL plugin
- Copy connection string to `.env.local`

**Neon** (serverless PostgreSQL)
- Go to [neon.tech](https://neon.tech)
- Create project and copy connection string
- Add to `.env.local`

## 📥 Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database

**Create `.env.local` file:**
```bash
# For local PostgreSQL:
DATABASE_URL="postgresql://postgres:password@localhost:5432/kunafa"

# Or use .env.example as template
cp .env.example .env.local
```

See `.env.example` for more provider examples.

### 3. Initialize Database
```bash
npm run db:push
```

This will:
- Create database schema
- Set up Message and Session tables
- Generate Prisma client

## 🏃 Running Locally

```bash
npm run dev
```

Open: **http://localhost:3000**

The app will hot-reload on file changes.

## 🔑 Default Credentials

| User  | Password  |
|-------|-----------|
| Manil | manil123  |
| Ines  | ines123   |

Change in `server/users.json`

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel

### Via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Next.js + PostgreSQL"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select repository
   - Click "Import"

3. **Add Environment Variables**
   - Settings → Environment Variables
   - Add `DATABASE_URL` with your PostgreSQL connection string
   - Examples:
     - Vercel Postgres: `postgresql://...@vercel...`
     - Supabase: `postgresql://...@db.supabase.co`
     - Railway: `postgresql://...@railway.app`

4. **Deploy**
   - Vercel auto-deploys on push
   - Watch in Dashboard
   - Your app is live!

### Manual CLI

```bash
npm i -g vercel
vercel login
vercel
```

## 📋 Project Structure (Next.js)

```
kunafa-chat/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── auth/                 # Authentication
│   │   │   ├── login/route.js
│   │   │   ├── logout/route.js
│   │   │   ├── verify/route.js
│   │   │   └── users/route.js
│   │   └── chat/
│   │       └── messages/route.js
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Chat.jsx
│   │   ├── Login.css
│   │   └── Chat.css
│   ├── chat/
│   │   └── page.jsx              # Chat page
│   ├── lib/
│   │   └── prisma.js             # Prisma client
│   ├── page.jsx                  # Login page (/)
│   ├── layout.jsx                # Root layout
│   └── globals.css
├── prisma/
│   └── schema.prisma
├── .env.local                    # Local only (git ignored)
├── .env.example
├── next.config.js
├── tsconfig.json
└── server/
    └── users.json
```

## 🔌 API Endpoints

**Login**
```
POST /api/auth/login
Body: { userId: "manil" | "ines", password: string }
Response: { token, userId, expiresAt, connectedAt }
```

**Logout**
```
POST /api/auth/logout
Body: { token: string }
```

**Verify**
```
POST /api/auth/verify
Body: { token: string }
Response: { valid: boolean, userId: string }
```

**Get Messages**
```
GET /api/chat/messages
Headers: Authorization: Bearer {token}
```

**Send Message**
```
POST /api/chat/messages
Headers: Authorization: Bearer {token}
Body: { text: string }
```

## 📝 Available Commands

```bash
npm run dev              # Development server (port 3000)
npm run build            # Production build
npm start                # Start production server
npm run db:push          # Sync schema with database
npm run db:studio        # Open Prisma GUI
npm run db:generate      # Generate Prisma client
```

## 🛠️ Troubleshooting

### Database Connection Error
```
error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solutions:**
- Ensure PostgreSQL is running
- Check DATABASE_URL format in `.env.local`
- Test: `psql "your-connection-string"`

### Build Fails
```bash
npm run db:generate
npm run build
```

### Port 3000 in Use
```bash
PORT=3001 npm run dev
```

### Session Issues
- Verify DATABASE_URL in `.env.local`
- Run: `npm run db:push`
- Check: `npm run db:studio`

### "Cannot find module '@prisma/client'"
```bash
npm run db:generate
```

## ✅ Verify Setup

1. **Database Connected**
   ```bash
   npm run db:studio
   ```

2. **Server Running**
   ```bash
   npm run dev
   # Should show: ▲ Next.js 14.x
   ```

3. **Login Works**
   - Go to http://localhost:3000
   - Select user, enter password
   - Should go to /chat

4. **Messages Persist**
   - Send messages
   - Switch users
   - Messages appear
   - Check in: `npm run db:studio`

## 🚀 Production Checklist

- [ ] DATABASE_URL in Vercel environment
- [ ] PostgreSQL database created
- [ ] `npm run build` succeeds
- [ ] `.env.local` in `.gitignore`
- [ ] Tested login/messaging
- [ ] Vercel deployment successful
- [ ] HTTPS enabled (Vercel automatic)

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Vercel Docs](https://vercel.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**Ready? Start with:**
```bash
npm install && npm run db:push && npm run dev
```
