import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { prisma } from '@/app/lib/prisma'
import crypto from 'crypto'

// Load users config
function getUsersData() {
  try {
    const filePath = join(process.cwd(), 'server', 'users.json')
    return JSON.parse(readFileSync(filePath, 'utf-8'))
  } catch (error) {
    console.error('Error loading users:', error)
    return {
      users: [
        { id: 'manil', name: 'Manil', password: 'manil123' },
        { id: 'ines', name: 'Ines', password: 'ines123' },
      ],
    }
  }
}

export async function POST(request) {
  try {
    const { userId, password } = await request.json()
    const usersData = getUsersData()

    // Validate user exists and password matches
    const user = usersData.users.find(
      (u) => u.id === userId && u.password === password
    )

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create session token
    const token = crypto.randomBytes(32).toString('hex')
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 1 day

    // Save session to database
    await prisma.session.create({
      data: {
        user: userId,
        token,
        createdAt: now,
        expiresAt,
      },
    })

    // Return session info
    return NextResponse.json({
      token,
      userId,
      expiresAt: expiresAt.toISOString(),
      connectedAt: now.toISOString(),
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
