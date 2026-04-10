import { NextResponse } from 'next/server'

const SPRING_URL = process.env.SPRING_API_URL || 'http://localhost:8081'

export async function GET() {
  try {
    const res = await fetch(`${SPRING_URL}/api/plates`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Spring Boot returned ${res.status}`)

    const plates = await res.json()

    // Map Spring Boot plate format → frontend Plate format
    const mapped = plates.map((p: { plateNumber: number; category: string }) => ({
      plate_id: String(p.plateNumber),
      image_url: `/api/plates/image/${p.plateNumber}`,
      category: p.category.replace('_', ' '),
    }))

    return NextResponse.json(mapped)
  } catch (err) {
    console.error('Failed to fetch plates from Spring Boot:', err)
    return NextResponse.json({ error: 'Failed to load plates' }, { status: 502 })
  }
}
