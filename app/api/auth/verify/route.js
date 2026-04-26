import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function POST(request) {
  try {
    const { token } = await request.json()

    const session = await prisma.session.findUnique({
      where: { token },
    })

    if (!session) {
      return NextResponse.json({ valid: false })
    }

    const now = new Date()
    if (new Date(session.expiresAt) < now) {
      await prisma.session.delete({ where: { token } })
      return NextResponse.json({ valid: false })
    }

    return NextResponse.json({
      valid: true,
      userId: session.user,
    })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}
