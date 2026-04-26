import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function POST(request) {
  try {
    const { token } = await request.json()

    if (token) {
      await prisma.session.delete({
        where: { token },
      }).catch(() => {})
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
