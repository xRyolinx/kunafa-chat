import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

function getUsersData() {
  try {
    const filePath = join(process.cwd(), 'server', 'users.json')
    return JSON.parse(readFileSync(filePath, 'utf-8'))
  } catch (error) {
    return {
      users: [
        { id: 'manil', name: 'Manil', password: 'manil123' },
        { id: 'ines', name: 'Ines', password: 'ines123' },
      ],
    }
  }
}

export async function GET() {
  const usersData = getUsersData()
  return NextResponse.json({
    users: usersData.users.map((u) => ({
      id: u.id,
      name: u.name,
    })),
  })
}
