import { NextRequest, NextResponse } from 'next/server'
import { getPosProvider, menuCache } from '@/lib/pos'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const forceFresh = searchParams.get('fresh') === 'true'

    const pos = getPosProvider()
    const menu = await menuCache.getMenu(pos, forceFresh)

    return NextResponse.json({
      menu,
      cached: !forceFresh,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[API] Error fetching menu:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    )
  }
}

// Force refresh menu cache
export async function POST() {
  try {
    const pos = getPosProvider()
    const menu = await menuCache.getMenu(pos, true)

    return NextResponse.json({
      menu,
      refreshed: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[API] Error refreshing menu:', error)
    return NextResponse.json(
      { error: 'Failed to refresh menu' },
      { status: 500 }
    )
  }
}