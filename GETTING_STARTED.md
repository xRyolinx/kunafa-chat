# 🚀 Getting Started - Kunafa Chat (Next.js + PostgreSQL)

## Choose Your Setup (Pick One)

### Option A: Local PostgreSQL (Development)

**Best for:** Local development and testing

1. **Install PostgreSQL**
   - [Windows](https://www.postgresql.org/download/windows/)
   - [macOS](https://www.postgresql.org/download/macosx/) or `brew install postgresql@15`
   - [Linux](https://www.postgresql.org/download/linux/)

2. **Create database**
   ```bash
   psql -U postgres
   CREATE DATABASE kunafa;
   \q
   ```

3. **Create `.env.local`**
   ```bash
   DATABASE_URL="postgresql://postgres:password@localhost:5432/kunafa"
   ```

### Option B: Vercel Postgres (Recommended - Easiest)

**Best for:** Production and zero-config setup

1. Go to [vercel.com](https://vercel.com)
2. Create project → Add PostgreSQL
3. Copy connection string to `.env.local`

### Option C: Supabase (Free tier - Great alternative)

**Best for:** Free hosting with good performance

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database → Connection string
4. Copy to `.env.local`

### Option D: Railway (Simple setup)

**Best for:** Quick deployment

1. Go to [railway.app](https://railway.app)
2. Create PostgreSQL plugin
3. Copy connection string to `.env.local`

## Installation & Setup (All Options)

### Step 1: Create `.env.local`

Create a file named `.env.local` in the project root:

```bash
# Replace with your actual connection string
DATABASE_URL="postgresql://user:password@host:port/database"
```

**For quick reference, see `.env.example` in the project root**

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Database

```bash
npm run db:push
```

This creates the database schema automatically.

### Step 4: Start Development Server

```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

## Test the App

1. **Login Screen**
   - You should see "kunafa" with two user options
   - Select "Manil" or "Ines"
   - Enter password: `manil123` or `ines123`

2. **Chat Screen**
   - Should see navbar with "kunafa" on left, "Déconnexion" on right
   - Empty messages area
   - Input box at bottom

3. **Send Message**
   - Type a message
   - Click Send
   - Message should appear immediately

4. **Test Persistence**
   - Send a few messages
   - Refresh the page (F5)
   - Messages should still be there

5. **Test Session**
   - Close browser tab
   - Reopen http://localhost:3000
   - Should be logged in (localStorage saved session)
   - Click "Déconnexion" to logout

## Database Viewer (Optional but Helpful)

View your data in a GUI:

```bash
npm run db:studio
```

Opens: http://localhost:5555

You can browse and edit tables visually.

## Common Issues & Solutions

### ❌ "DATABASE_URL not found"

**Solution:** Create `.env.local` with your PostgreSQL connection string

```bash
touch .env.local
# Then edit and add: DATABASE_URL="postgresql://..."
```

### ❌ "Error: connect ECONNREFUSED"

**Solution:** PostgreSQL is not running

**Local PostgreSQL:**
```bash
# Windows: Start PostgreSQL service from Services
# macOS: brew services start postgresql@15
# Linux: sudo systemctl start postgresql
```

**Cloud PostgreSQL:** Verify connection string is correct

### ❌ "Database does not exist"

**Solution:** Run database setup

```bash
npm run db:push
```

### ❌ "Port 3000 already in use"

**Solution:** Use different port

```bash
PORT=3001 npm run dev
```

### ❌ Messages not saving

**Solution:** Check database connection

```bash
# View database
npm run db:studio

# Regenerate Prisma client
npm run db:generate
```

## Available Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server (after build)
npm run db:push          # Create/update database schema
npm run db:studio        # Open database viewer GUI
npm run db:generate      # Regenerate Prisma client
```

## Environment Examples

### Local PostgreSQL (macOS/Linux)
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/kunafa"
```

### Local PostgreSQL (Windows)
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/kunafa"
```

### Vercel Postgres
```
DATABASE_URL="postgresql://postgres:xxxxxxxx@vercel-postgres.com:5432/kunafa"
```

### Supabase
```
DATABASE_URL="postgresql://postgres:xxxxx@db.supabase.co:5432/postgres"
```

### Railway
```
DATABASE_URL="postgresql://root:password@railway.app:5432/kunafa"
```

### Neon (Serverless)
```
DATABASE_URL="postgresql://user:password@neon.tech:5432/kunafa"
```

## Next Steps

Once everything is working:

1. **Customize users** - Edit `server/users.json` to add/change users and passwords

2. **Deploy to Vercel**
   ```bash
   git add .
   git commit -m "Next.js + PostgreSQL setup"
   git push origin main
   # Then import project in Vercel
   ```

3. **Read more docs**
   - `README.md` - Project overview
   - `SETUP.md` - Detailed deployment guide
   - `DEVELOPER_GUIDE.md` - For developers making changes
   - `MIGRATION_GUIDE.md` - Details about the refactor

## Still Having Issues?

1. Check the **Troubleshooting** section in `SETUP.md`
2. See **Common Tasks** in `DEVELOPER_GUIDE.md`
3. Review the **FAQ** in `MIGRATION_GUIDE.md`

---

**You're ready! 🎉**

Your next command should be:
```bash
npm run dev
```

Then open http://localhost:3000
