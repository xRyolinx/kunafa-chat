import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

async function verifySession(request) {
  const token = request.headers.get('authorization')?.split(' ')[1]

  if (!token) {
    return { valid: false, error: 'No token' }
  }

  const session = await prisma.session.findUnique({
    where: { token },
  })

  if (!session) {
    return { valid: false, error: 'Invalid session' }
  }

  const now = new Date()
  if (new Date(session.expiresAt) < now) {
    await prisma.session.delete({ where: { token } })
    return { valid: false, error: 'Session expired' }
  }

  return { valid: true, userId: session.user }
}

export async function GET(request) {
  try {
    const auth = await verifySession(request)

    if (!auth.valid) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    // Get pagination params from query
    const url = new URL(request.url)
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50)
    const offset = parseInt(url.searchParams.get('offset') || '0')

    // Get total count for pagination info
    const total = await prisma.message.count()

    // Fetch messages with pagination
    const messages = await prisma.message.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        timestamp: 'desc',
      },
    })

    // Return in ascending order for display, but include pagination metadata
    return NextResponse.json({
      messages: messages.reverse(),
      total,
      offset,
      limit,
      hasMore: offset + limit < total,
    })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const auth = await verifySession(request)

    if (!auth.valid) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    const { text } = await request.json()
    const sender = auth.userId

    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: {
        sender,
        text: text.trim(),
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
