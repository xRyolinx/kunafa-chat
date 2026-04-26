# Developer Guide - Kunafa Chat (Next.js + PostgreSQL)

## 📋 Project Overview

This is a Next.js 14 application with:
- **Frontend**: React components in `app/` using Next.js App Router
- **Backend**: API routes in `app/api/` running as serverless functions
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Session-based authentication with localStorage

## 🏗️ Architecture

### Frontend Routes

| Route | File | Component |
|-------|------|-----------|
| `/` | `app/page.jsx` | Login page (user selection + password) |
| `/chat` | `app/chat/page.jsx` | Chat interface (protected route) |

### Backend API Routes

| Method | Endpoint | File | Purpose |
|--------|----------|------|---------|
| `POST` | `/api/auth/login` | `app/api/auth/login/route.js` | Authenticate user |
| `POST` | `/api/auth/logout` | `app/api/auth/logout/route.js` | End session |
| `POST` | `/api/auth/verify` | `app/api/auth/verify/route.js` | Verify token validity |
| `GET` | `/api/auth/users` | `app/api/auth/users/route.js` | List available users |
| `GET` | `/api/chat/messages` | `app/api/chat/messages/route.js` | Fetch all messages |
| `POST` | `/api/chat/messages` | `app/api/chat/messages/route.js` | Send message |

### Database Schema

```sql
-- Messages Table
CREATE TABLE "Message" (
  id SERIAL PRIMARY KEY,
  sender VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions Table
CREATE TABLE "Session" (
  id SERIAL PRIMARY KEY,
  user VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP NOT NULL
);
```

## 🔐 Authentication Flow

1. **Login** (`/api/auth/login`)
   - User submits userId + password
   - Server validates against `server/users.json`
   - Creates session token (32-byte hex string)
   - Stores in `Session` table with 24h expiration
   - Returns token + expiration to client

2. **Storage** (Client-side localStorage)
   - `kunafa_token`: Session token (sent with every API request)
   - `kunafa_userId`: User ID (for UI)
   - `kunafa_connectedAt`: Connection datetime (for validation)

3. **Verification** (On each API request)
   - Check `Authorization: Bearer {token}` header
   - Validate token exists and isn't expired in database
   - Return 401 if invalid/expired

4. **Logout** (`/api/auth/logout`)
   - Delete session from database
   - Client clears localStorage

## 💬 Chat Flow

1. **Get Messages** (`GET /api/chat/messages`)
   - Verify session token
   - Fetch all messages from `Message` table
   - Return sorted by timestamp (ascending)

2. **Send Message** (`POST /api/chat/messages`)
   - Verify session token
   - Extract sender from session
   - Validate message text is not empty
   - Insert into `Message` table
   - Return created message

3. **Real-time Updates** (Client)
   - Poll `/api/chat/messages` every 2 seconds
   - Update UI with new messages
   - Auto-scroll to latest message

## 📝 Code Structure

### `app/lib/prisma.js` (Prisma Client Singleton)

```javascript
// Ensures only one Prisma client instance in development
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global
export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') 
  globalForPrisma.prisma = prisma
```

### `app/api/auth/login/route.js` (Example API Route)

```javascript
export async function POST(request) {
  const { userId, password } = await request.json()
  
  // 1. Validate credentials
  // 2. Create session token
  // 3. Save to database with expiration
  // 4. Return token to client
  
  return NextResponse.json({ token, userId, ... })
}
```

### `app/components/Chat.jsx` (Example Component)

```javascript
'use client'  // Client component for interactivity

export default function Chat() {
  const [messages, setMessages] = useState([])
  
  // Fetch messages on mount
  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 2000)  // Poll
    return () => clearInterval(interval)
  }, [])
  
  // Send message on form submit
  const handleSendMessage = async (e) => {
    // POST to /api/chat/messages
    // Refresh messages list
  }
  
  return (...)
}
```

## 🛠️ Common Tasks

### Add a New User

Edit `server/users.json`:
```json
{
  "users": [
    { "id": "alice", "name": "Alice", "password": "secret123" },
    { "id": "bob", "name": "Bob", "password": "secret456" }
  ]
}
```

Restart server.

### Add a New Message Field

1. Update `prisma/schema.prisma`:
   ```prisma
   model Message {
     // ... existing fields
     edited Boolean @default(false)
   }
   ```

2. Run migration:
   ```bash
   npm run db:push
   ```

3. Update API routes and components to use new field

### Add Authentication to New Endpoint

```javascript
async function verifySession(request) {
  const token = request.headers.get('authorization')?.split(' ')[1]
  
  const session = await prisma.session.findUnique({
    where: { token }
  })
  
  if (!session || new Date(session.expiresAt) < new Date()) {
    return { valid: false }
  }
  
  return { valid: true, userId: session.user }
}

export async function GET(request) {
  const auth = await verifySession(request)
  if (!auth.valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Protected code here
}
```

### Debug with Prisma Studio

```bash
npm run db:studio
# Opens http://localhost:5555
# Allows viewing/editing database through GUI
```

## 🚀 Performance Tips

### Database

- Add indexes on frequently queried fields:
  ```prisma
  model Message {
    sender String
    timestamp DateTime @default(now())
    
    @@index([sender])
    @@index([timestamp])
  }
  ```

- Use pagination for large message lists
- Cache frequently accessed data

### Frontend

- Implement virtual scrolling for many messages
- Reduce polling interval for better UX (with server load consideration)
- Use React.memo for message components

## 🧪 Testing API Endpoints

### Using cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId":"manil","password":"manil123"}'

# Send message (replace TOKEN)
curl -X POST http://localhost:3000/api/chat/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"text":"Hello!"}'

# Get messages
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/chat/messages
```

### Using Postman/Thunder Client

1. Import into Postman
2. Set `{{token}}` variable from login response
3. Use in `Authorization` header as `Bearer {{token}}`

## 📦 Deployment Checklist

- [ ] DATABASE_URL set in Vercel
- [ ] PostgreSQL database created and accessible
- [ ] `npm run build` completes without errors
- [ ] `.env.local` is NOT committed (in `.gitignore`)
- [ ] Tested login flow locally
- [ ] Tested message sending/receiving
- [ ] Vercel deployment successful
- [ ] Tested on production URL
- [ ] HTTPS working (automatic on Vercel)

## 🔗 Useful Links

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Prisma Client](https://www.prisma.io/docs/client/overview)
- [Next.js 'use client'](https://nextjs.org/docs/getting-started/react-essentials#client-components)
- [Request/Response in Next.js](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## 🐛 Debugging

### Enable Verbose Logging

```javascript
// In app/lib/prisma.js
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})
```

### Check Session Status

```bash
npm run db:studio
# Look at Session table to see active sessions
```

### View Logs

For local development:
```bash
npm run dev
# Logs appear in terminal
```

For Vercel:
```
Dashboard → Project → Deployments → Select deployment → Logs
```

## 📝 Notes

- Session tokens are 64-character hexadecimal strings
- Sessions expire exactly 24 hours from creation
- Expired sessions are automatically deleted on next verification attempt
- All timestamps are in UTC
- User credentials are in plain text in JSON (fine for demo, encrypt for production)

---

**Questions?** Check README.md or SETUP.md for more information.
